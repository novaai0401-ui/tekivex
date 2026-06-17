"SQL in the browser" sounds like a contradiction. SQL is the language of databases, and databases are servers — engines that own storage, manage indexes, and answer queries over the network. So when Analytics Studio advertises an in-browser SQL engine that runs `SELECT`, `WHERE`, `GROUP BY`, and `JOIN` with no server involved, the reasonable first question is: how can that possibly work, and is it actually useful?

It works because the hard part of SQL is not storage — it is evaluation. If your data already lives in memory as JavaScript arrays, you do not need a network round-trip or a disk-backed engine to answer a query. You need a parser, a query planner, and an executor. Analytics Studio bundles exactly that: a compact SQL engine that treats in-memory datasets as tables and evaluates queries against them entirely on the client.

This article opens up the architecture — parse, plan, execute — explains which clauses are supported and why, walks through the performance characteristics that matter, and lays out the cases where running SQL in the browser genuinely beats sending the query to a server.

## The three stages: parse, plan, execute

A client-side SQL engine is a miniature version of what a database does, minus storage management. The pipeline has three stages.

**Parse.** The query string is tokenized and turned into an abstract syntax tree (AST). `SELECT region, SUM(revenue) FROM orders WHERE status = 'paid' GROUP BY region` becomes a structured object describing projections, a source table, a predicate, and grouping keys. Parsing is also where syntax errors are caught and reported with position information, before any data is touched.

**Plan.** The planner turns the AST into an ordered list of operations and decides how to run them efficiently. Filtering before grouping shrinks the working set early; a join picks a strategy based on the relative sizes of the two inputs; projection is deferred until the end so intermediate steps carry only what they need. This is the same logical optimization a server-side planner does — it just operates over arrays instead of pages on disk.

**Execute.** The plan runs against the in-memory tables. Each operator is a transformation over rows: filter discards non-matching records, group partitions rows by key, aggregate folds each partition into a single result, join pairs rows across tables. The output is a plain array of result rows, ready to feed a pivot, a chart, or a KPI tile.

```ts
import { SqlEngine } from "@tekivex/analytics-studio";

const engine = new SqlEngine();
engine.registerTable("orders", orders);   // array of records in memory
engine.registerTable("customers", customers);

const rows = engine.query(`
  SELECT c.segment, SUM(o.revenue) AS revenue
  FROM orders o
  JOIN customers c ON o.customerId = c.id
  WHERE o.status = 'paid'
  GROUP BY c.segment
`);
```

No `fetch`, no connection string, no credentials. The tables are JavaScript values you already have, and the result comes back synchronously.

## What the engine supports — and what it deliberately does not

The engine targets the analytical core of SQL: the clauses you reach for when summarizing data. That keeps the implementation small and fast and avoids pretending to be a full RDBMS.

| Feature | Supported | Notes |
|---------|-----------|-------|
| `SELECT` with projections & aliases | Yes | expressions and computed columns |
| `WHERE` predicates | Yes | comparison, `AND`/`OR`/`NOT`, `IN`, `LIKE` |
| `GROUP BY` + aggregates | Yes | `SUM`, `COUNT`, `AVG`, `MIN`, `MAX` |
| `JOIN` | Yes | inner and left joins across registered tables |
| `ORDER BY` / `LIMIT` | Yes | sort and paginate results |
| Transactions, writes, DDL | No | the engine is read/query only |
| Persistent storage / indexes | No | data lives in memory for the session |

The omissions are intentional. Analytics Studio is a query engine for analysis, not a database. There are no writes, no migrations, no durability guarantees — the dataset is whatever you registered for the current session. That constraint is exactly what makes it safe to run on the client: a query can never corrupt anything, because there is nothing to corrupt.

## Performance: what actually costs time

Because everything is in memory, the usual database bottlenecks — disk I/O and network latency — disappear. What remains is CPU work proportional to the data, and a few characteristics worth understanding.

- **Filtering is linear and cheap.** A `WHERE` clause is a single pass over the rows. Pushing predicates early (the planner does this for you) keeps every later stage smaller.
- **Joins are the expensive operation.** A naive join is quadratic. The engine builds a hash on the smaller side so a typical equi-join stays close to linear, but joining two large tables on a low-selectivity key is the one place you can feel cost. Filter before you join wherever possible.
- **Aggregation scales with group cardinality.** Grouping into a handful of regions is trivial; grouping by a near-unique key produces almost as many groups as rows and gives you little summarization for the cost.
- **Result size, not table size, drives render cost.** A query over a large dataset that returns ten summary rows is fast to display. The grid powered by [GridStorm](/use-cases/gridstorm-virtual-scrolling-60fps) handles large result sets via virtual scrolling, but smaller results are always cheaper.

A practical guideline: in-browser SQL is comfortable from thousands up into the low millions of rows, depending on the device and the query. Past that, you are doing the work the browser should hand back to a server.

```sql
-- Cheap: filter narrows the set before the grouping does its work
SELECT region, COUNT(*) AS paid_orders, SUM(revenue) AS revenue
FROM orders
WHERE status = 'paid' AND orderedAt >= '2026-01-01'
GROUP BY region
ORDER BY revenue DESC
LIMIT 10;
```

## When in-browser SQL beats a server

The point is not that client-side SQL replaces your warehouse. It is that for a large class of problems, the server round-trip is pure overhead. In-browser SQL wins when:

- **The data already lives on the client.** You fetched a dataset to render a page; querying it again on the server means shipping it back, re-querying, and shipping results forward. Querying locally skips all three.
- **Interactivity matters more than scale.** Cross-filtering, drill-downs, and "what if I group by this instead" feel instant when there is no network in the loop. Every server query, however fast, has a floor set by latency.
- **You want zero backend to operate.** No database to provision, secure, scale, or pay for. A dashboard becomes a static bundle. This is the same property that makes [drag-and-drop dashboards](/use-cases/analytics-studio-drag-drop-dashboards) deployable as plain front-end assets.
- **Privacy or offline use is a requirement.** Data that never leaves the browser cannot leak over the wire, and queries keep working with no connection.

Conversely, a server is the right call when the dataset is too large to ship to the client, when many users must share a single governed source of truth, or when you need durable writes, row-level security enforced at the data layer, or queries over data that changes faster than you can re-fetch it.

## When to use the in-browser engine

Reach for in-browser SQL when you have a bounded dataset on the client and want fast, interactive analysis without standing up infrastructure: embedded product analytics, internal tools, exploratory dashboards, and anywhere a server round-trip would only add latency. Keep the server when scale, governance, or durability are the binding constraints — and note you can combine the two by querying a server once for a slice, then exploring that slice locally with SQL.

## Key takeaways

Analytics Studio's SQL engine is a parse-plan-execute pipeline over in-memory tables: it parses queries to an AST, plans an efficient operator order, and executes against JavaScript arrays — supporting `SELECT`, `WHERE`, `GROUP BY`, and `JOIN` with no server, no storage, and no credentials. Performance is governed by data size, join selectivity, and group cardinality rather than disk or network, which keeps it comfortable into the low millions of rows.

Used where the data is already client-side and interactivity is the priority, it removes an entire tier from your architecture. Explore it on the [product page](/product/analytics-studio) or see how it fits the wider toolkit on the [use cases hub](/use-cases).
