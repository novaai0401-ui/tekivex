Accessibility is where most data grids quietly fail. A grid can look polished, scroll at 60fps, and still be unusable for someone navigating with a keyboard or a screen reader — because the DOM the virtualization engine produces is a soup of `div` elements with no semantics, focus jumps unpredictably as rows recycle, and nothing is announced when the selection moves. For public-sector, enterprise, and regulated software, that is not a polish issue; it is a compliance and inclusion failure.

[GridStorm](/product/gridstorm) treats accessibility as a first-class plugin that targets WCAG 2.1 Level AA. This article explains how it works: the ARIA grid roles it applies, the keyboard navigation model it implements, how it manages focus through a virtualized, recycling DOM, what it announces to screen readers, and which WCAG success criteria a data grid actually has to satisfy.

The hard part is that accessibility and virtualization are in tension — assistive technology expects a complete, stable structure, while virtualization deliberately renders an incomplete, shifting one. Reconciling the two is the real work, and it is what the a11y plugin exists to do.

## Turning on accessibility

Like everything else, accessibility is a plugin you compose onto the grid. It hooks the same lifecycle described in the [plugin architecture article](/use-cases/gridstorm-plugin-architecture) to contribute roles, attributes, and keyboard handling.

```ts
import { createGrid, A11yPlugin } from 'gridstorm';

const grid = createGrid({
  columnDefs,
  rowData,
  plugins: [
    new A11yPlugin({
      label: 'Quarterly revenue by region',
      announceSelection: true,
      announceSort: true,
    }),
  ],
});
```

The `label` becomes the grid's accessible name, and the announce options control what gets read aloud as the user interacts.

## ARIA grid roles

A screen reader understands a table only if the DOM carries the right roles. The plugin applies the WAI-ARIA grid pattern:

- The scroll container gets `role="grid"` with `aria-label` and `aria-rowcount` / `aria-colcount` set to the **total** counts, not the rendered counts.
- Each rendered row gets `role="row"` and an `aria-rowindex` reflecting its real position in the full dataset.
- Header cells get `role="columnheader"`; data cells get `role="gridcell"` with `aria-colindex`.
- Sortable columns expose `aria-sort` (`ascending`, `descending`, or `none`).

```html
<div role="grid" aria-label="Quarterly revenue by region"
     aria-rowcount="100000" aria-colcount="8">
  <div role="row" aria-rowindex="1">
    <div role="columnheader" aria-colindex="1" aria-sort="ascending">Region</div>
    <!-- ... -->
  </div>
  <div role="row" aria-rowindex="4213">
    <div role="gridcell" aria-colindex="1">EMEA</div>
    <!-- ... -->
  </div>
</div>
```

The critical detail is `aria-rowcount="100000"` alongside `aria-rowindex="4213"` on a row that is the *first* one in the rendered window. This is exactly how the ARIA spec says to handle virtualized grids: tell assistive technology the true size and the true index of each rendered row, so a screen reader announces "row 4,213 of 100,000" even though only forty rows exist in the DOM.

## The keyboard navigation model

A grid must be fully operable without a mouse (WCAG 2.1.1). GridStorm implements a roving tabindex: the grid is a single tab stop, and arrow keys move an active cell within it.

| Key | Action |
| --- | --- |
| Arrow keys | Move the active cell up/down/left/right |
| Home / End | First / last cell in the row |
| Ctrl+Home / Ctrl+End | First / last cell in the grid |
| Page Up / Page Down | Move by a viewport of rows |
| Enter / F2 | Begin editing the active cell |
| Space | Toggle selection of the row or cell |
| Tab | Leave the grid for the next page element |

Only the active cell carries `tabindex="0"`; every other cell is `tabindex="-1"`. This is what keeps the grid a single, predictable tab stop instead of forcing a keyboard user to press Tab a hundred thousand times to get past it.

## Focus management through recycling

This is where virtualization fights accessibility. When the user arrows down past the bottom of the visible window, the grid must scroll — and scrolling recycles DOM nodes. If the focused cell's DOM node gets reassigned to a different row, focus is either lost (the screen reader goes silent) or lands on the wrong data.

The a11y plugin solves this by tracking the active cell by its **logical** coordinates (row index, column index) rather than by a DOM reference. When navigation moves focus to a row that is not currently rendered, the plugin first scrolls that row into the window, lets the windowing engine render and recycle, and only then moves real DOM focus onto the freshly rendered cell. Focus follows the data, not the node.

```ts
function moveActive(row: number, col: number) {
  grid.a11y.setActive(row, col);     // update logical position
  grid.scrollToRow(row);             // ensure the row is in the window
  requestAnimationFrame(() => {
    grid.a11y.focusActiveCell();     // focus the now-rendered DOM cell
  });
}
```

Sequencing the focus move after the render frame is what prevents the brief silence or misplacement that plagues naive virtualized grids.

## Screen-reader announcements

Beyond structure and focus, the plugin uses an ARIA live region to announce state changes that are otherwise only visible:

- **Selection changes**: "Row 4,213 selected" when `announceSelection` is on.
- **Sort changes**: "Sorted by Region, ascending" when a column is sorted.
- **Filter results**: "Showing 312 of 100,000 rows" after a filter applies.
- **Edit confirmation**: announcing the committed value when an edit lands.

Announcements go through a visually hidden `aria-live="polite"` region so they do not interrupt the user mid-utterance, and they are debounced so a rapid sequence of changes does not flood the screen reader.

## The WCAG 2.1 AA criteria a grid must meet

Targeting Level AA for a grid comes down to a concrete set of success criteria:

- **1.3.1 Info and Relationships** — semantic roles convey the table structure.
- **1.4.3 Contrast (Minimum)** — text and meaningful UI meet 4.5:1 (3:1 for large text); the plugin ships accessible default styles and you must preserve contrast in your theme.
- **1.4.11 Non-text Contrast** — focus indicators and state borders meet 3:1.
- **2.1.1 Keyboard** — every operation is reachable by keyboard.
- **2.4.3 Focus Order** — focus moves in a logical sequence.
- **2.4.7 Focus Visible** — the active cell has a clearly visible focus ring.
- **4.1.2 Name, Role, Value** — every interactive element exposes all three to assistive technology.

The plugin handles the structural and behavioral criteria (roles, keyboard, focus, name/role/value); contrast criteria depend partly on your theme, so they remain a shared responsibility you verify in your own styling.

## When accessibility is non-negotiable

- It is **required** for public-sector and government software (Section 508, EN 301 549), education, healthcare, and finance — domains where inaccessible software is a legal liability.
- It is **good engineering** everywhere else: keyboard operability and clear focus benefit power users, and semantic structure improves testability.
- The only reason to omit the plugin is a genuinely internal, throwaway tool — and even then, the keyboard model alone usually pays for itself.

Accessibility in a virtualized grid is not a checkbox; it is the careful reconciliation of a deliberately incomplete DOM with assistive technology that expects a complete one — correct ARIA counts on recycled rows, focus that follows logical coordinates through scrolling, and announcements for state that would otherwise be invisible. GridStorm packages that reconciliation as an opt-in plugin targeting WCAG 2.1 AA. Try keyboard navigation on the [live demo](https://www.tekivex.com/gridstorm), read how it fits the broader [plugin model](/use-cases/gridstorm-plugin-architecture), or browse the full [use cases](/use-cases) hub.
