---
title: Introduction
description: GridStorm architecture, source packages, and release verification.
---

# GridStorm introduction

GridStorm is a TypeScript data grid with a headless engine, a DOM renderer and optional plugins. Virtual scrolling limits the number of rendered rows. Performance depends on cell complexity, data operations, device and browser; this page does not establish a frame-rate or bundle-size benchmark.

## Source and release scope

This introduction was corrected on September 15, 2026 against [source revision 36ec37a](https://github.com/novaai0401-ui/grid-data/tree/36ec37ade513428609807120fe4b23e01ca06413). The repository includes React, Vue, Svelte and Angular adapter packages. Check each adapter's installation guide and the exact npm version before adopting it: source availability does not establish that every package has been published together.

The repository root uses the [MIT license](https://github.com/novaai0401-ui/grid-data/blob/36ec37ade513428609807120fe4b23e01ca06413/LICENSE). Check the license accompanying each installed package and its dependencies. The previous introduction described an open-core model with premium plugins and React-only availability; those statements did not accurately describe the inspected source and have been removed.

## How the layers fit together

1. The core owns row and column state, an event bus, commands and plugin lifecycle.
2. The DOM renderer displays the current viewport and connects user interaction to the engine.
3. Plugins add operations such as sorting, filtering, editing, grouping and clipboard handling.
4. Framework adapters connect this lifecycle to application components.
5. Theme styles provide presentation through CSS custom properties.

Use only the plugins required for your task. For example, a read-only report needs different capabilities from an editable planning table. Verify plugin dependencies and imports against the release you install.

## Accessibility and evaluation

ARIA roles, keyboard navigation and focus handling are implementation tools, not a certification of your finished application. Test your own cell renderers with a keyboard and screen reader, including editing, errors and movement between the grid and surrounding controls. See the site's [accessibility statement](/accessibility) for scope and limitations.

When comparing grids, build the same small workflow in each candidate: load your data, sort and filter, edit a cell, navigate by keyboard and export where required. Compare the resulting bundle with identical build settings. This introduction does not claim a measured advantage over another library.

## Continue

- [Quick start](/getting-started/quick-start/)
- [Installation](/getting-started/installation/)
- [Architecture](/core-concepts/architecture/)
- [Performance guide](/guides/performance/)
