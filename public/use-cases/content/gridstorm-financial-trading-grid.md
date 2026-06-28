A trading blotter is one of the most demanding things you can render in a browser. Prices tick several times per second across hundreds of instruments, traders expect to see the change instantly with a flash of color, columns like symbol and position must stay pinned while the rest scrolls, and none of it can stutter — a dropped frame during a fast market is not a cosmetic problem, it is a usability failure that erodes trust in the tool.

This article shows how to build a real-time financial trading grid with [GridStorm](/product/gridstorm). We will cover streaming cell updates without re-rendering the world, flash-highlighting cells on a tick, conditional formatting for up/down moves, frozen and pinned columns, and the strategies that keep a high update rate from melting the main thread. We will also look at how GridStorm pairs with a streaming data source.

The throughline is the same idea that lets the grid handle 100,000 rows: do the least work possible per frame, and never let update volume dictate render volume.

## Streaming cell updates without re-rendering everything

The first instinct — replace the whole row dataset whenever a price changes — is also the most expensive. At hundreds of ticks per second, that approach forces constant reconciliation across the entire visible window even though a single cell changed.

GridStorm exposes targeted cell updates. You push a value for a specific row and column, and the core updates only that cell, leaving the rest of the row's DOM untouched.

```ts
import { createGrid, StreamingPlugin } from 'gridstorm';

const grid = createGrid({
  columnDefs,
  rowData: initialQuotes,
  getRowId: (r) => r.symbol,
  plugins: [new StreamingPlugin()],
});

socket.on('tick', ({ symbol, price, change }) => {
  grid.updateCells(symbol, { price, change });
});
```

Because updates are addressed by row id and column, an update to an off-screen symbol costs almost nothing — the core records the new value in state and the cell is rendered with the correct value only if and when it scrolls into view.

## Flash highlight on tick

Traders read direction from color. The convention is a brief flash — green when a value ticks up, red when it ticks down — that fades after a couple hundred milliseconds. GridStorm's streaming plugin can emit a transition class on the changed cell so you drive the flash purely in CSS, which keeps the animation on the compositor and off the main thread.

```ts
new StreamingPlugin({
  flash: {
    duration: 400,
    classFor: (next, prev) => (next > prev ? 'tick-up' : next < prev ? 'tick-down' : null),
  },
});
```

```css
.tick-up  { animation: flash-green 0.4s ease-out; }
.tick-down { animation: flash-red   0.4s ease-out; }
@keyframes flash-green { from { background: rgba(0,200,120,0.5); } to { background: transparent; } }
@keyframes flash-red   { from { background: rgba(220,60,60,0.5); } to { background: transparent; } }
```

Using CSS animations rather than JavaScript-driven color interpolation matters at high tick rates: the browser handles the fade on the compositor thread, so even a wall of flashing cells does not compete with your update logic for the 16ms frame budget.

## Conditional formatting

Beyond the transient flash, traders want persistent visual encoding: negative changes in red, positive in green, values past a threshold emphasized. This is conditional formatting driven by the cell's current value, applied through the column's `cellClass` and `cellStyle` callbacks.

```ts
import type { ColumnDef } from 'gridstorm';

const columnDefs: ColumnDef[] = [
  { field: 'symbol', headerName: 'Symbol', pin: 'left', width: 90 },
  {
    field: 'change',
    headerName: 'Chg %',
    cellClass: (row) => (row.change < 0 ? 'neg' : row.change > 0 ? 'pos' : ''),
    cellStyle: (row) => ({ fontWeight: Math.abs(row.change) > 5 ? 700 : 400 }),
  },
  { field: 'bid', headerName: 'Bid' },
  { field: 'ask', headerName: 'Ask' },
];
```

The formatting callbacks are evaluated only for cells in the rendered window, so conditional formatting across a 5,000-row watchlist costs the same as across the ~40 rows actually on screen.

## Frozen and pinned columns

In a trading grid the instrument identity has to stay visible no matter how far right the user scrolls through bid/ask/spread/volume/Greeks. GridStorm supports pinning columns to the left or right edge; pinned columns render in their own layer that does not move with horizontal scroll, while still participating in the same vertical virtualization as the rest of the row.

You saw `pin: 'left'` on the symbol column above. Pin a running P&L or action buttons to the right edge with `pin: 'right'`. Pinned columns are kept in sync with their row during recycling, so vertical scrolling stays smooth and the frozen columns never tear away from their data.

## High-update-rate strategies

The single most important technique for a fast market is to decouple ingest rate from render rate. The network may deliver 800 ticks per second; the screen refreshes 60 times per second. Rendering more often than the screen can show is wasted work.

GridStorm's recommended pattern is to coalesce incoming ticks into a per-frame buffer and flush once per animation frame:

```ts
const buffer = new Map<string, Partial<Quote>>();
let scheduled = false;

socket.on('tick', (t) => {
  buffer.set(t.symbol, { ...buffer.get(t.symbol), price: t.price, change: t.change });
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    for (const [symbol, patch] of buffer) grid.updateCells(symbol, patch);
    buffer.clear();
  });
});
```

Additional strategies that compound:

- **Last-value-wins coalescing**: when a symbol ticks ten times between frames, only its latest value matters — the `Map` above keeps just the newest patch.
- **Skip off-screen flash work**: cells outside the window do not need flash animations; only their stored value needs updating.
- **Pause animations during fast scroll**: while the user is dragging the scrollbar, suppress flashes to keep the scroll path clean.

## Pairing with a streaming data source

GridStorm renders; it does not manage your transport. For the data side — connection management, backpressure, reconnection, and fan-out to multiple grids — pair it with a dedicated streaming layer (a `WebSocket`, an SSE `EventSource`, or your own client). The integration pattern is the same regardless of transport: subscribe to the stream, buffer incoming messages per animation frame, then flush the batch into `updateCells` once per frame. The division of labor is clean: your transport owns the stream, GridStorm owns the frame.

## When to use this pattern

- Use targeted `updateCells` plus per-frame coalescing for **any high-frequency feed** — trading, telemetry, observability dashboards, live sports data.
- Use CSS-driven flashes rather than JavaScript color interpolation whenever update volume is high.
- Pin identity and summary columns so they survive horizontal scroll.
- Lean on virtualization so watchlist size does not affect per-frame cost — the same engine described in the [60fps virtual scrolling article](/use-cases/gridstorm-virtual-scrolling-60fps) does the heavy lifting here.

A trading grid is the proving ground for a data grid: it combines high update rates, strict latency expectations, and dense visual encoding. By keeping render volume bounded to one flush per frame and addressing updates by row and column, GridStorm holds a smooth frame rate even under a fast market. See it tick live on the [demo](https://gridstorm.tekivex.com), and browse the other [use cases](/use-cases) for analytical and accessibility-focused builds on the same core.
