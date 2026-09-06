Rendering tabular data is deceptively hard. A grid that holds a few hundred rows feels trivial — until a customer pastes in a 100,000-row export and the browser locks up for several seconds. The naive approach of mounting one DOM node per cell does not scale: 100,000 rows times 20 columns is two million DOM nodes, and no browser will lay that out at an interactive frame rate.

This article walks through how [GridStorm](/product/gridstorm) renders 100,000-plus rows while holding 60 frames per second. We will cover the core technique — windowing — and then the details that separate a demo from a production grid: row and cell recycling, the per-frame render budget, the trade-off between measuring and estimating row heights, how to avoid layout thrashing, and why GridStorm being a headless core makes all of this tractable.

By the end you should understand not just *that* virtualization works, but the specific decisions that keep scrolling smooth under real-world data and interaction.

## The problem with rendering everything

Browsers are good at laying out content, but layout cost is roughly proportional to the number of nodes that participate in it. When you mount every row, three costs compound:

- **Construction**: creating elements and attaching event listeners.
- **Layout and paint**: the browser must measure and position every node.
- **Memory and GC pressure**: millions of nodes and their associated framework fibers or component instances consume memory and slow garbage collection.

A 60fps target gives you a budget of about **16.67 milliseconds per frame**. Within that window the browser has to run your JavaScript, recalculate style, perform layout, paint, and composite. If your scroll handler alone blows past 16ms, you drop frames and the grid stutters. The only sustainable answer is to stop rendering rows the user cannot see.

## Windowing: render only the visible slice

Virtual scrolling — also called windowing — renders only the rows currently inside the viewport, plus a small overscan buffer above and below. As the user scrolls, GridStorm computes which rows should now be visible and updates the rendered set.

The math is straightforward when rows share a fixed height. Given the scroll offset, viewport height, and row height, you can derive the first and last visible index directly. GridStorm's `VirtualScroller` does this internally; conceptually the calculation is:

```ts
import { createGrid } from 'gridstorm';
import type { ColumnDef } from 'gridstorm';

function visibleRange(scrollTop: number, viewportHeight: number, rowHeight: number, total: number, overscan = 6) {
  const first = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const start = Math.max(0, first - overscan);
  const end = Math.min(total - 1, first + visibleCount + overscan);
  return { start, end };
}

// You don't call this yourself — createGrid wires the scroller for you:
const columnDefs: ColumnDef[] = [{ field: 'name', headerName: 'Name' }];
const grid = createGrid({ container: el, columnDefs, rowData });
```

A full-height spacer element gives the scrollbar the correct size and position, so the browser's native scrolling behaves exactly as a user expects. The rendered rows are absolutely positioned (or translated) to their true offset within that spacer. The result: a viewport showing ~30 rows touches ~30 row's worth of DOM nodes regardless of whether the dataset has a thousand rows or a million.

## Row and cell recycling

Windowing alone reduces the *count* of nodes, but if you destroy and recreate rows on every scroll tick you still pay construction and GC costs constantly. GridStorm recycles.

Instead of unmounting a row that scrolls out of view and mounting a fresh one, the core maintains a pool of row containers keyed by their position in the window rather than by data identity. As you scroll, a container that leaves the top is reassigned to the row entering at the bottom; only its bound data and cell contents change. The DOM node, its event listeners, and its layout box survive.

The same principle applies at the cell level for grids with many columns and horizontal virtualization. Cells are pooled per column slot, so a horizontal scroll reuses existing cell nodes and rebinds their values rather than tearing down and rebuilding the row's children.

Recycling turns a steady stream of allocations into a near-zero-allocation steady state during scroll, which is precisely what keeps the garbage collector from introducing periodic frame drops.

## Measuring vs estimating row heights

Fixed-height rows make windowing arithmetic exact. But real grids often need variable heights — wrapped text, expandable detail rows, differing font sizes. Variable heights break the simple `scrollTop / rowHeight` formula because you no longer know an arbitrary row's offset without summing every prior row.

GridStorm supports both modes:

| Strategy | When to use | Cost |
| --- | --- | --- |
| Fixed height | Uniform rows; the common case | O(1) offset lookup, cheapest |
| Estimated height | Variable rows, offset approximated then corrected on measure | Slight scrollbar drift, corrected lazily |
| Measured height | Precise variable layout required | Requires measuring rendered rows, more work per frame |

The estimate-then-measure approach gives most of the benefit at most of the speed: GridStorm assigns every unmeasured row a uniform estimate, renders the window, measures the rows that actually got rendered, and stores their real heights. A prefix-sum index lets offset and index lookups stay logarithmic rather than linear as measurements accumulate. The scrollbar may shift slightly as estimates resolve into real values, but it converges quickly and stays stable in regions the user has already visited.

## Avoiding layout thrash

The subtlest performance killer is layout thrashing — interleaving DOM reads (like `getBoundingClientRect` or `offsetHeight`) with DOM writes within the same frame. Each read forces the browser to flush pending layout so it can return an accurate value; alternating read/write/read/write triggers repeated synchronous layouts and destroys your frame budget.

GridStorm batches strictly. Within a frame it performs all reads first (scroll position, any height measurements), then computes the new window, then performs all writes (repositioning recycled rows, updating contents). Scroll events are coalesced and the actual render work is scheduled inside `requestAnimationFrame`, so at most one render runs per frame regardless of how many scroll events fire.

```ts
let pending = false;
let lastScrollTop = 0;

viewport.addEventListener('scroll', () => {
  lastScrollTop = viewport.scrollTop; // read
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    const window = grid.updateWindow(lastScrollTop); // compute
    grid.applyWindow(window);                        // batched writes
  });
});
```

This read/compute/write discipline is what lets the grid stay inside 16ms even while the user flings the scrollbar.

## Why a headless core helps

GridStorm is headless: the core owns state, windowing math, recycling, and the height index, but it does not own the DOM. It hands your framework adapter a description of which rows and cells should be visible and where, and the adapter renders them using the framework's own primitives.

This separation matters for performance because the hot path — the per-frame windowing calculation — is plain TypeScript with no framework overhead. The core keeps the bundle small (under 50KB) and lets the React, Vue, Svelte, or Angular adapter do only the cheap, framework-native work of reconciling a few dozen visible rows. You can read more about how this composes in the [plugin architecture deep dive](/use-cases/gridstorm-plugin-architecture).

## Key takeaways

- Rendering every row does not scale; windowing renders only the visible slice plus a small overscan.
- Recycling row and cell nodes turns per-scroll allocations into a near-zero-allocation steady state, avoiding GC-induced frame drops.
- Fixed heights give O(1) offset math; estimated and measured heights support variable rows with a prefix-sum index for logarithmic lookups.
- Batch reads before writes and render once per frame inside `requestAnimationFrame` to avoid layout thrash and stay within the 16ms budget.
- A headless core keeps the hot path framework-free and the bundle small.

These techniques are not exotic, but getting all of them right simultaneously — and keeping them correct as features like sorting, filtering, and pinned columns are layered on — is the actual engineering. You can see the result holding 60fps over 100,000 rows on the [live demo](https://www.tekivex.com/gridstorm), or explore the broader set of [GridStorm use cases](/use-cases) to see how the same core powers real-time and analytical workloads.
