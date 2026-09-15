---
title: Migration from AG Grid — verification checklist
description: Migrate one workflow at a time with explicit compatibility tests.
---

# Migration from AG Grid

**Corrected September 15, 2026.** This guide replaces earlier unverified drop-in API mappings and size/pricing claims. GridStorm is not established here as a drop-in replacement for AG Grid. A successful migration means preserving the behavior your users need, not merely replacing a component import.

## 1. Capture the current behavior

Create a branch and retain the existing lockfile. List the screen's columns, stable row IDs, renderers, editors, filters, selection behavior, export formats and server calls. Record persisted grid state and the formats consumers expect. Keep a working baseline available for comparison and rollback.

A useful small fixture contains a blank cell, a zero, a negative number, two rows with the same display name but different IDs, a date and a non-ASCII label. Specify the expected sort/filter result by row ID. This catches mistakes that a table of unique positive numbers will miss.

## 2. Verify packages and licenses

Follow [GridStorm installation](/getting-started/installation/) and the documentation for your specific framework. Pin the tested versions. The [source revision used for this correction](https://github.com/novaai0401-ui/grid-data/tree/36ec37ade513428609807120fe4b23e01ca06413) contains multiple framework adapters; confirm the published package and its license before relying on it.

AG Grid has both Community and Enterprise features. Consult the [current feature matrix](https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise/) and your existing agreement before estimating savings. Removing one dependency does not by itself determine the cost of implementing its replacement.

## 3. Port a small read-only grid

Start with row identity and three ordinary columns. Compile against the installed types instead of copying a cross-library API mapping. Verify empty data, loading and error states. Then add one required feature at a time, recording its package, configuration and acceptance test. See [columns](/core-concepts/columns/), [row data](/core-concepts/row-data/) and [plugin architecture](/core-concepts/plugin-system/).

## 4. Test behavior at boundaries

- Sort then filter and confirm the expected IDs remain selected.
- Edit and cancel a value; simulate a rejected save and confirm it is not silently committed.
- Scroll while editing and check focus and state are preserved as required.
- Copy and export dates, quotes, empty values and non-ASCII text; reopen the result in the consuming application.
- Restore saved layout and selection after a refresh, or explicitly migrate the stored format.
- Operate with keyboard and screen reader, including entry, editing, errors and exit.

For server-driven screens, test slow responses, failed requests and stale responses arriving out of order. Do not assume a client-side demo proves server-side correctness.

## 5. Compare and release

Measure equivalent production builds with the same enabled features. Use the [performance guide](/guides/performance/) to record conditions instead of repeating a universal size or frame-rate claim. Keep the old screen behind your application's rollback mechanism until its replacement passes the acceptance tests. Document known differences for users and remove the old dependency only when no remaining screen needs it.
