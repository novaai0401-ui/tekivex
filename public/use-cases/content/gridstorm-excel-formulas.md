When business users meet a data grid, they often expect it to behave like a spreadsheet — type `=SUM(B2:B10)`, paste a column from Excel and have the numbers stay numbers, reference one cell from another and watch it recalculate. Meeting that expectation in the browser is a real engineering problem: you need a parser, a dependency graph, a recalculation engine, and a clipboard layer that coerces types correctly, all running fast enough that editing feels instant.

[GridStorm](/product/gridstorm) ships this as a plugin: a formula engine supporting 42 Excel-compatible functions, evaluated entirely client-side. This article opens up how it works — how formulas are parsed, how the dependency graph tracks which cells depend on which, how recalculation stays incremental, how copy/paste coerces types the way Excel does, and which categories of functions are supported.

If you have ever wondered what it actually takes to put a working formula bar in a web grid, this is the walkthrough.

## Turning the formula engine on

The engine is a plugin, so you opt in and point it at the columns that should accept formulas.

```ts
import { createGrid } from '@tekivex/gridstorm';
import { formulaPlugin } from '@tekivex/gridstorm/plugins/formula';

const grid = createGrid({
  columns,
  rows,
  plugins: [
    formulaPlugin({
      // Cells whose raw value starts with '=' are treated as formulas.
      enabledColumns: ['amount', 'tax', 'total'],
      locale: 'en-US',
    }),
  ],
});
```

A cell holds two things now: its raw input (`=amount*1.08`) and its computed value (`108`). The grid displays the computed value and reveals the raw formula when you edit the cell, exactly like a spreadsheet.

## Parsing: from text to an AST

The first job is turning a formula string into something executable. The engine tokenizes the input — recognizing numbers, strings, cell references (`B2`), range references (`A1:A20`), function names, and operators — then parses those tokens into an abstract syntax tree that respects operator precedence and parentheses.

```ts
// Conceptually, "=SUM(A1:A3) * 2" parses to:
const ast = {
  type: 'binary', op: '*',
  left: {
    type: 'call', fn: 'SUM',
    args: [{ type: 'range', from: 'A1', to: 'A3' }],
  },
  right: { type: 'number', value: 2 },
};
```

Parsing happens once per edit, not once per recalculation. The AST is cached against the cell, so when a dependency changes the engine re-evaluates the existing tree rather than re-parsing the text. Parse errors (an unbalanced parenthesis, an unknown function) are surfaced as cell errors like `#NAME?` rather than throwing, matching spreadsheet semantics users already understand.

## The dependency graph

The heart of any formula engine is knowing what depends on what. When the engine parses `=A1 + B1`, it records that the current cell depends on `A1` and `B1`. Across the whole sheet these references form a directed graph: edges point from a cell to the cells it reads.

This graph does two critical jobs:

- **Determines recalculation order.** Cells must be evaluated in topological order so that when `C1 = A1 + B1` and `A1 = 5 * 2`, `A1` is computed before `C1`.
- **Detects circular references.** If following the edges ever returns to the starting cell, the engine flags `#CIRCULAR!` instead of looping forever.

When a cell's value changes, the engine does not recompute the entire sheet. It walks the graph forward from the changed cell to find only the dependents — directly and transitively — and recomputes just those, in topological order. On a sheet where one input feeds three formulas, editing that input touches four cells, not the whole grid.

## Incremental recalculation

Recalculation is the loop that runs on every edit, and it has to feel instant. The strategy is dirty-marking plus topological evaluation:

1. The edited cell is marked dirty.
2. Forward graph traversal marks every transitive dependent dirty.
3. The dirty set is evaluated in topological order, each cell reading the already-updated values of its dependencies.
4. Computed values are written back and the affected cells re-render through the grid's normal windowing path.

Because evaluation is scoped to the dirty set and the AST is already cached, recalculation cost scales with the number of *affected* formulas, not the size of the sheet. Combined with virtualization, a formula sheet with tens of thousands of rows recalculates a localized edit without a perceptible pause.

## Copy/paste and type coercion

Spreadsheet interop lives or dies on the clipboard. Users copy ranges out of Excel and paste them in, and they expect numbers, dates, currencies, and percentages to arrive as the right types — not as strings that silently break downstream formulas.

GridStorm's clipboard handling parses the tab-separated, multi-row payload Excel places on the clipboard and coerces each value against the target column's type:

| Pasted text | Target type | Coerced to |
| --- | --- | --- |
| `1,234.50` | number | `1234.5` |
| `$2,000` | currency | `2000` |
| `12%` | number/percent | `0.12` |
| `2026-06-17` | date | a Date value |
| `TRUE` | boolean | `true` |
| `=A1+A2` | formula column | a live formula |

Coercion is locale-aware (thousands separators and decimal marks differ by locale, which is why the plugin takes a `locale` option), and values that cannot be coerced are kept as text rather than discarded, so nothing is silently lost. Copying *out* reverses the process, emitting Excel-compatible TSV so a round-trip back into Excel preserves structure.

## Supported function categories

The 42 functions cover the categories that the overwhelming majority of business spreadsheets actually use:

- **Math and aggregation**: `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`, `ROUND`, `ABS`, `MOD`, and related.
- **Logical**: `IF`, `AND`, `OR`, `NOT`, `IFERROR`.
- **Lookup**: `VLOOKUP`, `INDEX`, `MATCH`.
- **Text**: `CONCAT`, `LEFT`, `RIGHT`, `MID`, `LEN`, `TRIM`, `UPPER`, `LOWER`.
- **Date and time**: `TODAY`, `NOW`, `DATE`, `YEAR`, `MONTH`, `DAY`.
- **Conditional aggregation**: `SUMIF`, `COUNTIF`, `AVERAGEIF`.

These compose like their Excel counterparts — `=IF(SUMIF(region, "EMEA", amount) > 1000, "review", "ok")` works — because the parser and evaluator implement the same precedence, argument, and error semantics. The goal is not to reimplement all of Excel, but to cover the functions that make a grid genuinely useful as a lightweight spreadsheet without the weight of a full spreadsheet application.

## When to reach for the formula engine

- Use it for **user-editable calculations** — budget tools, pricing sheets, planning grids — where business users expect spreadsheet behavior.
- Use it for **Excel interop** where teams live in Excel but need a web surface that does not corrupt their data on paste.
- Skip it when your grid is read-only or all computation happens server-side; leaving the plugin out keeps your bundle smaller, which is the point of the [plugin architecture](/use-cases/gridstorm-plugin-architecture).

A formula engine in the browser is a parser, a dependency graph, an incremental recalculator, and a type-coercing clipboard working in concert — and getting the Excel semantics right (error values, locale handling, topological recalculation) is what separates a toy from something a finance team will trust. GridStorm packages all of it as one opt-in plugin atop the same virtualized core described in the [60fps article](/use-cases/gridstorm-virtual-scrolling-60fps). Try editing formulas live on the [demo](https://gridstorm.tekivex.com), or see the full [use cases](/use-cases) hub for more.
