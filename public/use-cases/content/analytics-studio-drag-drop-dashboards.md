Most dashboard projects stall in the same place: someone has a CSV or an API response full of numbers, a clear question to answer, and no fast path from one to the other. The traditional answer involves a warehouse, a modeling layer, an access policy, and a BI seat for everyone who wants to look. That is a lot of infrastructure to stand up before you have even confirmed the chart is worth building.

Analytics Studio takes the opposite stance. It is a drag-and-drop visual analytics builder that runs entirely in the browser with no backend required. You load a dataset, drag fields into a pivot, drop in KPI tiles and charts, and arrange the result into a layout you can ship. Under the hood it is powered by [GridStorm](/product/gridstorm), the same grid engine that drives high-density data rendering, so the pivot stays responsive even as row counts climb.

This article walks through building a real dashboard the way a developer or analyst actually would: start from data, shape it visually, add the tiles that matter, wire up filters, and lay it all out — without writing SQL or provisioning a server.

## Start from a dataset, not a schema

Everything begins with data in memory. Analytics Studio accepts an array of records — from a `fetch`, a file upload, or a value you already have on the page — and infers field types so the builder can offer sensible aggregations and groupings.

```tsx
import { Dashboard, DataSource } from "@tekivex/analytics-studio";

const orders = await fetch("/api/orders").then((r) => r.json());

const source = new DataSource(orders, {
  name: "orders",
  // type inference is automatic; override only where you need to
  fields: {
    orderedAt: { type: "date" },
    revenue: { type: "number", format: "currency" },
    region: { type: "dimension" },
  },
});

export default function App() {
  return <Dashboard source={source} editable />;
}
```

The `editable` flag is what turns a static render into a builder. With it on, your users get the full drag-and-drop surface: a field list on the side, drop zones for rows, columns, and measures, and a canvas for tiles. Turn it off and you ship a locked, read-only dashboard built from the same definition.

## Build the pivot by dragging fields

The pivot builder is the heart of the experience. Each field in the dataset becomes a draggable chip. Drop a categorical field like `region` into **Rows** to group by it; drop `revenue` into **Values** and Analytics Studio aggregates it — sum by default, with mean, median, count, min, and max one click away. Drop a second dimension like `productLine` into **Columns** and you get a cross-tab instantly.

Because grouping and aggregation happen client-side over the in-memory dataset, every change is immediate. There is no query round-trip, so reordering fields or switching an aggregation feels like dragging cells in a spreadsheet rather than waiting on a report to rerun.

If you would rather define the starting pivot in code and let users adjust it from there, the configuration mirrors the visual layout one-to-one:

```ts
import { PivotConfig } from "@tekivex/analytics-studio";

const pivot: PivotConfig = {
  rows: ["region"],
  columns: ["productLine"],
  values: [
    { field: "revenue", agg: "sum", format: "currency" },
    { field: "orderId", agg: "count", label: "Orders" },
  ],
  sort: { by: "revenue", dir: "desc" },
};
```

The pivot is not a dead end — it is a data shape. Any tile on the dashboard can read from the same grouped result, which keeps a single source of truth across the page.

## Add KPI tiles with thresholds and alerts

Numbers that matter deserve their own tiles. KPI tiles take a measure and an optional comparison — period-over-period, target, or a fixed baseline — and render the value, the delta, and a trend sparkline. Where Analytics Studio earns its keep is auto-thresholds: it can derive reasonable warning and critical bands from the distribution of the data, or you can set explicit rules.

| Tile | Measure | Threshold rule | Behavior |
|------|---------|----------------|----------|
| Revenue | `sum(revenue)` | target 1,000,000 | green at/over target |
| Refund rate | `count(refunds)/count(orders)` | warn > 3%, crit > 6% | amber/red banding |
| Avg fulfillment | `mean(hoursToShip)` | auto | bands from data spread |

Alert rules attach to the same thresholds, so a KPI that crosses a critical band can flag visually and fire a callback you handle however you like — toast, log, or webhook.

## Drop in charts from the same data

With the pivot shaped, charts become a matter of choosing a visualization and pointing it at fields. Analytics Studio ships 26+ chart types — bar, line, scatter, radar, heatmap, treemap, sankey, and more — and the builder suggests fits based on the fields you drag in. Drag a date and a measure and it leans toward a line chart; drag two dimensions and a measure and a heatmap or treemap surfaces.

You do not have to memorize which chart suits which question. If you want a deeper treatment of that decision, the [chart types guide](/use-cases/analytics-studio-chart-types-guide) maps data questions to visualizations directly. For dashboard purposes, the important thing is that every chart reads from the same in-memory source, so a filter applied once reshapes the whole page coherently.

## Wire up cross-filtering

A dashboard is only as useful as its filters. Analytics Studio supports two kinds: control filters that users drive (a region dropdown, a date range), and cross-filters where clicking a bar or a treemap cell filters every other tile to that selection.

```tsx
<Dashboard
  source={source}
  filters={[
    { field: "region", control: "multiselect" },
    { field: "orderedAt", control: "daterange", default: "last-90-days" },
  ]}
  crossFilter // click any chart segment to filter the page
/>
```

Cross-filtering is where the no-backend model pays off most. Because the full dataset already lives in the browser, drilling from a summary into a slice does not issue a new query — the engine just recomputes the affected views against data it already holds. Interaction stays at interface speed.

## Lay it out and ship it

The final step is arrangement. Tiles live on a responsive grid you resize and reposition by dragging. The layout is fully responsive out of the box, so the same dashboard reflows sensibly from a wide monitor down to a tablet. When you are happy, the layout serializes to a plain object you can persist anywhere — local storage, your own database, a config file in the repo — and rehydrate later.

```ts
const layout = dashboard.exportLayout();   // serializable JSON
localStorage.setItem("dash:orders", JSON.stringify(layout));

// later
const saved = JSON.parse(localStorage.getItem("dash:orders")!);
<Dashboard source={source} layout={saved} />;
```

Because there is no server in the loop, "deploying" a dashboard is just shipping a static bundle plus the layout definition. That makes Analytics Studio a natural fit for embedding inside an existing app rather than sending users off to a separate BI tool.

## When to use drag-and-drop dashboards

This approach is strongest when the data already fits comfortably in memory — think operational dashboards over a slice of recent records, embedded analytics inside a SaaS product, or internal tools where standing up warehouse infrastructure is overkill. It is also ideal for fast iteration: building, rearranging, and discarding dashboards costs nothing.

It is less suited to billion-row aggregations or governed enterprise reporting that demands a central semantic layer and row-level security at the database. For those, a server-backed warehouse remains the right tool. If you are weighing that trade-off, our [comparison with Metabase and Looker](/use-cases/analytics-studio-vs-metabase-looker) lays out where each model wins.

## Key takeaways

Analytics Studio turns a dataset into an interactive dashboard through direct manipulation: drag fields into a pivot, drop KPI tiles with thresholds and alert rules, add any of 26+ charts, wire cross-filters, and arrange a responsive layout — all in the browser, all without a backend, all powered by GridStorm for smooth rendering at scale.

The result is a workflow where the distance between "I have some numbers" and "I have a shippable dashboard" is measured in minutes rather than sprints. Start from the [product overview](/product/analytics-studio) or browse the broader [use cases hub](/use-cases) to see where it fits in your stack.
