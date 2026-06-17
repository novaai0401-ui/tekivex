Most "platforms" in developer tooling are really one large dependency wearing six hats. Adopt one piece and you inherit the entire runtime, the opinionated state layer, and a license that quietly changes the day your usage grows. The Tekivex Platform is built on the opposite premise. It is six separate, MIT-licensed packages, each solving one hard problem well, each installable on its own, and each free to use, modify, and redistribute commercially with no enterprise tier, no per-seat fees, and no paywall.

This article is about how those six products fit together when you *do* want the full stack. We will walk through an operations and analytics dashboard — the kind of internal tool that renders millions of rows, updates in real time, lets users export polished reports, and sits behind authentication — and show where each Tekivex product lives in that picture. The important caveat to hold throughout: nothing here is required. The composition is convenient, not coercive.

The goal is to give you a mental model precise enough to make adoption decisions: which package owns which concern, how data moves between them, and where the seams are.

## The six products at a glance

Each product occupies a distinct layer of a typical data-heavy frontend. They share design conventions — CSS-variable theming, framework-agnostic APIs — but no hard runtime coupling.

| Product | Layer | Responsibility | Package |
|---|---|---|---|
| [Tekivex UI](/product/tekivex-ui) | Presentation shell | Layout, navigation, forms, primitives | `tekivex-ui` |
| [GridStorm](/product/gridstorm) | Data presentation | High-performance virtualized data grids | `@tekivex/gridstorm` |
| [DataFlow](/product/dataflow) | Data transport | Real-time streaming and subscriptions | — |
| [Analytics Studio](/product/analytics-studio) | Insight | BI dashboards and charts | — |
| [Pyntra](/product/pyntra) | Output | In-browser PDF generation and editing | `@pyntra/engine` |
| [Quantum Vault](/product/quantum-vault) | Identity | Post-quantum authentication tokens | `@tekivex/quantum-vault` |

Read top to bottom and you have roughly the request lifecycle of our example app: a user authenticates (Quantum Vault), lands in an application shell (Tekivex UI), sees live tables (GridStorm) fed by a stream (DataFlow), explores aggregate trends (Analytics Studio), and exports a report (Pyntra).

## The application shell: Tekivex UI

[Tekivex UI](/product/tekivex-ui) is the foundation most teams start with because it owns everything the user actually touches: the app frame, the sidebar, modals, buttons, and form controls. It is headless and tree-shakeable, ships with zero runtime dependencies, meets WCAG 2.1 AA, themes entirely through CSS variables, and keeps its core under 8kB. Headless matters here — it gives you behavior and accessibility without imposing visual opinions, so the shell can host components from GridStorm and Analytics Studio without style collisions.

In our dashboard, Tekivex UI provides the chrome and the layout grid. Everything else mounts inside it.

```tsx
import { AppShell, Sidebar, Topbar, Panel } from 'tekivex-ui';
import { DataGrid } from '@tekivex/gridstorm';
import { createStream } from '@tekivex/dataflow';
import { useEffect, useState } from 'react';

const stream = createStream('wss://ops.example.com/events');

export function OpsDashboard() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    // DataFlow pushes deltas; we patch grid state in place.
    const sub = stream.subscribe('inventory', (delta) => {
      setRows((prev) => delta.apply(prev));
    });
    return () => sub.close();
  }, []);

  return (
    <AppShell>
      <Topbar title="Operations" />
      <Sidebar items={navItems} />
      <Panel heading="Live Inventory">
        <DataGrid
          rows={rows}
          columns={columns}
          virtualized
          rowKey="sku"
        />
      </Panel>
    </AppShell>
  );
}
```

Note what is *not* happening: Tekivex UI does not know what GridStorm is. It renders children. GridStorm does not know where its rows came from. That decoupling is the whole point.

## High-performance tables: GridStorm

[GridStorm](/product/gridstorm) handles the part that breaks naive implementations — rendering and updating large, frequently-changing datasets without dropping frames. It virtualizes rows and columns so only the visible viewport is in the DOM, which is what makes a live-updating inventory or trade-blotter view feasible.

The contract GridStorm exposes is deliberately plain: give it `rows`, `columns`, and a stable `rowKey`. It does not prescribe how you fetch or mutate data. You can hand it a static array from a REST call, a paginated cursor, or — as above — a buffer that a stream keeps mutating. Because the grid is keyed by `sku`, incoming deltas reconcile against existing rows instead of forcing full re-renders.

## Real-time transport: DataFlow

[DataFlow](/product/dataflow) is the conduit. It manages the WebSocket (or SSE) lifecycle, multiplexes named channels over a single connection, handles reconnection, and emits deltas rather than full snapshots so you transmit only what changed.

In the snippet above, `createStream` opens one connection and `subscribe('inventory', ...)` taps a single logical channel on it. The `delta.apply(prev)` call is where transport meets presentation: DataFlow produces an immutable patch, your state holds the canonical array, and GridStorm re-renders the affected rows. DataFlow has no opinion about the grid — it would feed a chart, a counter, or a log tail just as happily. The same stream instance can drive both the grid and an Analytics Studio chart from different channels.

## Insight: Analytics Studio

Where GridStorm shows rows, [Analytics Studio](/product/analytics-studio) shows shape. It provides the BI layer — dashboards, time-series charts, aggregations, and the drill-down interactions that let a user move from "throughput dipped at 14:00" to the specific records behind the dip.

Architecturally it sits beside GridStorm, not above it. Both are consumers of data. A common pattern is to point an Analytics Studio chart at a rolling aggregate of the same DataFlow channel that feeds the grid, so the headline metrics and the raw table stay consistent by construction. Selecting a bar in a chart can filter the grid; that wiring lives in your application state, keeping the two components independent.

## Output: Pyntra

Dashboards eventually need to leave the browser as documents. [Pyntra](/product/pyntra) is an in-browser PDF engine: it generates and edits documents client-side, so "Export this view as a report" never has to round-trip to a server-side rendering farm.

```ts
import { Document, Table, render } from '@pyntra/engine';

export async function exportReport(rows: Row[], title: string) {
  const doc = new Document({ title });
  doc.heading(title);
  doc.add(new Table({
    columns: ['SKU', 'Location', 'On Hand', 'Status'],
    rows: rows.map((r) => [r.sku, r.location, r.onHand, r.status]),
  }));
  const blob = await render(doc);          // produces a PDF Blob
  return URL.createObjectURL(blob);        // hand to <a download>
}
```

Pyntra takes the same row data your grid is displaying and turns it into a downloadable artifact. Because it runs in the browser, the report reflects exactly what the user sees, including any client-side filters, with no PII leaving the page to be rendered.

## Identity: Quantum Vault

[Quantum Vault](/product/quantum-vault) wraps the stack in authentication built on post-quantum tokens — designed to remain valid against an adversary with a quantum computer, which matters for tokens that must stay trustworthy for years.

It is also the gate that protects everything else. You verify a session before mounting the shell, and you attach the token to the DataFlow connection so the stream itself is authenticated.

```ts
import { vault } from '@tekivex/quantum-vault';

const session = await vault.verify();      // throws if no valid session
if (!session) location.assign('/login');

const stream = createStream('wss://ops.example.com/events', {
  token: session.token,                    // authenticated transport
});
```

Quantum Vault does not require any other Tekivex package — it issues and verifies tokens for whatever transport or API you use. Here it simply happens to secure DataFlow and gate the Tekivex UI shell.

## Installing the stack

Because each product is its own package, you install exactly what you need:

```bash
npm install tekivex-ui @tekivex/gridstorm @tekivex/dataflow \
  @tekivex/quantum-vault @pyntra/engine
# Analytics Studio added when you reach the BI phase.
```

Drop any line you do not want. Need only a fast grid in an existing app? `npm install @tekivex/gridstorm` and stop there.

## When to use the full stack — and when not to

The full composition earns its keep when you are building a real-time, data-dense internal application: live tables, BI dashboards, exportable reports, and auth, all in one place. The products were designed against that shape, so the seams line up.

But adopt by problem, not by brand. The architecture is intentionally à la carte:

- **Just need a grid?** Take GridStorm alone; it has no Tekivex dependencies.
- **Already standardized on a design system?** Skip Tekivex UI and feed GridStorm yourself.
- **Have an auth provider you trust?** Keep it; Quantum Vault is optional.
- **No real-time data?** DataFlow adds nothing — wire the grid to your existing fetch layer.

This is the practical upshot of the [MIT, no-paywall model](/use-cases/tekivex-mit-open-source-model): there is no commercial incentive to bundle, so the packages stay genuinely independent. You will not hit a feature wall that forces the rest of the suite on you. See the [use cases](/use-cases) for individual-adoption walkthroughs.

## Conclusion

The Tekivex Stack is a set of layers — identity, shell, transport, grids, insight, output — that happen to compose cleanly because they were built with consistent, decoupled contracts. Tekivex UI frames the app, GridStorm renders the rows, DataFlow streams the changes, Analytics Studio reveals the trends, Pyntra ships the documents, and Quantum Vault guards the door. Used together they cover the full lifecycle of an operations dashboard. Used apart, each still stands on its own. That independence, backed by a permanent MIT license, is what lets you start with one package today and grow into the rest only if and when the problem calls for it.
