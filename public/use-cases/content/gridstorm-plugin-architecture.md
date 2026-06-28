Most data grids are monoliths. Every feature you might ever want — sorting, filtering, grouping, editing, clipboard, charting — ships in the same bundle, coupled to the same internal state, whether you use it or not. That design optimizes for "it just works" out of the box at the cost of bundle size, extensibility, and the ability to reason about what the grid is actually doing.

[GridStorm](/product/gridstorm) takes the opposite approach. It is organized around a small headless core and 35 composable plugins. The core knows almost nothing about features; it owns state, the windowing engine, and a lifecycle that plugins hook into. Everything else — sorting, filtering, selection, the formula engine, accessibility, clipboard — is a plugin you opt into.

This article explains how that architecture works: the responsibilities of the headless core, the plugin lifecycle and registration model, how to write a custom plugin, and how plugins compose without stepping on one another. If you have only used integrated grids, this is the mental model shift that makes GridStorm worth understanding.

## What the headless core owns — and what it doesn't

The core is deliberately minimal. It owns:

- **Row and column state**: the source data, column definitions, and derived view state.
- **The windowing engine**: which rows and cells are visible, the height index, and recycling (the subject of the [virtual scrolling deep dive](/use-cases/gridstorm-virtual-scrolling-60fps)).
- **An event/lifecycle bus**: well-defined hook points plugins subscribe to.
- **A pipeline**: an ordered transform of source rows into the rows the grid actually displays.

It does **not** own the DOM (that is the framework adapter's job) and it does not implement features. "Headless" means the core computes *what* to show and leaves *how* to render it to the adapter, and leaves *what features exist* to plugins. This is why the core stays under 50KB and why importing only the plugins you need keeps application bundles small.

## The plugin lifecycle

A plugin is a factory that returns an object with a known shape. When you register it, the core calls its `setup` hook with a context handle that exposes the state, the row pipeline, and the lifecycle bus. The plugin uses that handle to register pipeline stages, listen for events, expose API methods, and contribute view metadata.

```ts
import { createGrid } from '@tekivex/gridstorm';
import { sortingPlugin } from '@tekivex/gridstorm/plugins/sorting';
import { filteringPlugin } from '@tekivex/gridstorm/plugins/filtering';
import { selectionPlugin } from '@tekivex/gridstorm/plugins/selection';

const grid = createGrid({
  columns,
  rows,
  plugins: [
    filteringPlugin(),  // pipeline stage: narrows rows
    sortingPlugin(),    // pipeline stage: orders rows
    selectionPlugin(),  // listens to events, exposes selection API
  ],
});
```

The lifecycle has a small number of phases:

| Phase | What happens |
| --- | --- |
| `setup` | Plugin registers pipeline stages, event listeners, and API methods |
| `pipeline` | On data or config change, registered stages run in order to produce view rows |
| `event` | User interaction and data updates dispatch events plugins may handle |
| `teardown` | Plugin detaches listeners and releases resources when the grid is destroyed |

The ordering of pipeline stages is significant — filtering before sorting means you sort fewer rows — and the core runs stages in registration order, so plugin order in the array is meaningful and intentional.

## Registration and the context handle

Registration is just placing the plugin in the `plugins` array; the core handles wiring. What each plugin receives is a context object that is the entire extension surface:

```ts
interface PluginContext<Row> {
  state: GridState<Row>;
  pipeline: { register(stage: PipelineStage<Row>): void };
  on(event: GridEvent, handler: EventHandler): () => void;
  expose(name: string, method: Function): void;
  invalidate(): void; // request a re-render
}
```

Plugins never reach into each other directly. They communicate through state and events, which is what keeps composition predictable: a plugin can be added or removed without other plugins needing to know it existed, as long as it does not depend on state another plugin contributes.

## Writing a custom plugin

Suppose you want a plugin that highlights every row whose value in a numeric column exceeds a threshold — a simple "outlier" marker. It needs to listen for data changes, compute which rows qualify, and contribute a row class. Here is the whole thing:

```ts
import type { GridPlugin } from '@tekivex/gridstorm';

export function outlierPlugin(opts: { column: string; threshold: number }): GridPlugin {
  return {
    name: 'outlier',
    setup(ctx) {
      const isOutlier = (row: any) => row[opts.column] > opts.threshold;

      // Contribute a row class without touching other plugins' logic.
      ctx.state.rowClass.add((row) => (isOutlier(row) ? 'is-outlier' : ''));

      // Expose an API method consumers can call.
      ctx.expose('countOutliers', () =>
        ctx.state.rows.filter(isOutlier).length
      );

      // React to data changes.
      const off = ctx.on('rows:changed', () => ctx.invalidate());
      return () => off(); // teardown
    },
  };
}
```

Register it like any built-in plugin:

```ts
const grid = createGrid({
  columns,
  rows,
  plugins: [outlierPlugin({ column: 'latency', threshold: 500 })],
});

console.log(grid.api.countOutliers());
```

Three things to notice. The plugin returns its teardown function from `setup`, so the core can clean up listeners on destroy. It contributes behavior (a row class) and capability (an API method) without modifying the core or other plugins. And it uses `invalidate` to request a render rather than touching the DOM, respecting the headless boundary.

## How plugins compose

Composition works because the contracts are narrow. Pipeline stages are pure transforms over rows; event handlers are isolated; contributions like row classes and cell decorations are additive (the core merges contributions from all plugins rather than letting one win). The result is that the 35 shipped plugins, and your own, slot together in predictable ways:

- **Independent plugins** (selection and flash highlighting) simply coexist.
- **Ordered plugins** (filtering before sorting) rely on the deterministic pipeline order.
- **Cooperating plugins** (clipboard reading the selection plugin's state) communicate through shared state, never direct references.

This is also what makes accessibility work as a plugin rather than a core concern — the [a11y plugin](/use-cases/gridstorm-accessible-data-grid) contributes ARIA roles and keyboard handling through the same hooks, and the [42-function formula engine](/use-cases/gridstorm-excel-formulas) is a pipeline stage plus an editing integration.

## When the plugin model is the right fit

- Use it when **bundle size matters** — you ship only the features you import.
- Use it when you need **custom grid behavior** that an integrated grid would force you to fork or hack around; a plugin is a first-class, testable extension point.
- Use it when you want to **reason about** what the grid does — the plugin contracts are explicit and documented.
- The trade-off: composing plugins requires understanding ordering and shared state, which is marginally more to learn than a grid where everything is on by default.

The plugin architecture is the reason GridStorm can be both small and capable: the core stays under 50KB and feature breadth lives in 35 independently versioned, separately importable plugins, validated by a comprehensive automated test suite. Explore the composition live on the [demo](https://gridstorm.tekivex.com), see how [Analytics Studio](/product/analytics-studio) builds an entire analytics surface on this core, or browse the full [use cases](/use-cases) hub.
