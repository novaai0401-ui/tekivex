Virtual scrolling keeps a large table usable by rendering a small viewport rather than every record. It does not guarantee a particular frame rate. Plain text cells and charts in every cell are different workloads, even when both tables contain 100,000 rows.

This guide explains windowing and a repeatable way to evaluate [GridStorm](/product/gridstorm). **This is a measurement procedure, not a published benchmark.** Earlier wording presented 60fps as an outcome without providing reproducible measurements. That claim has been removed.

## Calculate the visible window

Consider 100,000 fixed-height rows, each 32 pixels tall, in a 640-pixel viewport. Twenty rows fit at a row-aligned scroll position. With six rows of overscan on each side, an interior window mounts 32 rows; a partially visible boundary can require 33. With ten columns, that is about 320–330 cells, excluding headers and pinned areas, instead of one million cells.

This standalone teaching example is **not GridStorm's internal implementation or a grid API**:

```js
function visibleRange(scrollTop, viewportHeight, rowHeight, total, overscan = 6) {
  if (rowHeight <= 0 || viewportHeight < 0 || total < 0) {
    throw new RangeError('Invalid dimensions');
  }
  if (total === 0) return { start: 0, endExclusive: 0 };
  const top = Math.max(0, Math.min(scrollTop, Math.max(0, total * rowHeight - viewportHeight)));
  return {
    start: Math.max(0, Math.floor(top / rowHeight) - overscan),
    endExclusive: Math.min(total, Math.ceil((top + viewportHeight) / rowHeight) + overscan),
  };
}
visibleRange(3200, 640, 32, 100000); // { start: 94, endExclusive: 126 }
visibleRange(0, 640, 32, 100000);    // { start: 0, endExclusive: 26 }
visibleRange(0, 640, 32, 0);        // { start: 0, endExclusive: 0 }
```

An exclusive end makes the mounted row count `endExclusive - start`. Dataset boundaries have less overscan because rows outside the dataset do not exist. Wrapped text and expanded rows require a different height model; this example assumes fixed heights.

## Treat a frame budget as a target

At 60Hz, a display refresh interval is approximately 16.67ms. JavaScript, style calculations, layout and painting share that interval. A 120Hz display offers about 8.33ms. A scroll callback below 16ms does not prove the complete frame is on time.

Windowing reduces DOM work, but sorting can still inspect the full dataset and custom renderers can trigger expensive layout. Extensions, power-saving settings and background tabs affect observations. See [MDN's requestAnimationFrame documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) for scheduling and background-tab limitations.

## Run a repeatable evaluation

1. Start with the [playground](/gridstorm/playground/) or your own integration. Record the package version or source commit. Keep a fixed build because live demos can change.
2. Use deterministic data: sequential IDs, fixed-length labels and repeatable numeric values. Record rows, columns, row height, viewport, framework adapter and enabled plugins.
3. Start with plain text cells. Repeat with your real renderers, sorting, filtering, pinned columns and streaming updates. Report these as separate workloads.
4. Record browser, OS, CPU, memory, refresh rate and battery status. Keep the tab foregrounded and retain the same zoom and viewport.
5. Warm the page once. Record several equal-duration scroll runs in the Performance panel, using the same distance and direction. Inspect frame timing, long tasks and visible blank regions rather than reporting only an average frame rate.
6. Repeat on the slowest device you support. Save the trace, dataset and reproduction steps.

| Field | Evidence to retain |
| --- | --- |
| Build | Package version, lockfile and source commit |
| Data | Row and column counts, generator seed, cell types |
| Rendering | Adapter, plugins, row height, viewport and zoom |
| Environment | Browser, OS, hardware and refresh rate |
| Runs | Number, duration, distance and warm-up |
| Results | Frame distribution, long tasks, memory and visual defects |

These are fields to measure, not implied passing results. Chrome's [Performance panel reference](https://developer.chrome.com/docs/devtools/performance/reference) explains trace inspection. One machine's result does not establish performance on every visitor's device.

## Diagnose a slow result

If node count grows as you scroll, check whether the adapter retains off-screen elements. If nodes stay bounded but frames are slow, simplify cell renderers and disable optional plugins one at a time. Look for geometry reads after DOM writes, expensive formatters and large allocations during scrolling.

For blank regions during rapid scrolling, test more overscan. It trades rendering work and memory for fewer gaps. If sorting pauses but scrolling stays smooth, investigate sorting separately: virtualization does not make every data operation cheap.

Include keyboard focus, row announcements and navigation to off-screen selections in your checks. A smooth visual demonstration alone does not establish accessibility.

## Use supported APIs and measure the complete application

Follow the [installation guide](/gridstorm/docs/getting-started/installation/) and [grid API reference](/gridstorm/docs/api/grid-api/) for integration. Measure a production bundle with the adapter and plugins you actually import; a core-only figure excludes part of the download.

A useful result is a documented workload that meets your product's responsiveness requirements. If it fails, preserve the fixture and trace when reporting the issue. Do not generalize a favorable result into a universal frame-rate promise.
