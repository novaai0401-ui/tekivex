Most component libraries make a quiet bargain with you: in exchange for ready-made buttons and dropdowns, you accept their markup, their class names, and their opinions about how things should look. That trade works until it doesn't. The day a designer hands you a spec that the library can't express, you start fighting the very tool that was supposed to save time — overriding styles with `!important`, wrapping components to defeat their defaults, or reverse-engineering internal DOM structure that was never meant to be public API.

Tekivex UI takes a different stance. It is a headless-first component system for React, Vue, and Svelte that separates *behavior* from *presentation*. The primitives handle the hard, error-prone parts — keyboard interaction, focus management, ARIA wiring, state machines — and hand you the markup and styling decisions. You own the look. The library owns the correctness.

This article walks through the design philosophy behind that split, why headless matters more than it first appears, and how zero runtime dependencies plus tree-shakeable ESM keep your bundle honest. Tekivex UI is MIT-licensed and ships 50+ accessible components meeting WCAG 2.1 AA. The full reference lives on the [Tekivex UI product page](/product/tekivex-ui).

## What "headless" actually means

A headless component is one that exposes behavior and state without prescribing how it renders. A headless `Dialog` knows how to trap focus, close on `Escape`, restore focus to the trigger, and announce itself to assistive technology. What it deliberately does *not* know is whether your modal has rounded corners, a backdrop blur, or a slide-up animation. Those are your problems — and that is the point.

The distinction matters because the hard parts of UI components are rarely the visuals. Anyone can style a div. Far fewer teams correctly implement roving tabindex for a menu, or the precise focus-return semantics a screen-reader user expects when a popover closes. By pulling that logic into tested, accessible primitives, Tekivex UI lets you write the markup you'd write by hand — just without re-solving accessibility every time.

## Composition over configuration

There are two ways a library can let you customize a component. The configuration approach hands you a growing list of props: `variant`, `size`, `rounded`, `elevation`, `iconPosition`, and eventually `unstyled` once the props run out. The composition approach gives you smaller pieces and lets you assemble them.

Tekivex UI favors composition. Instead of one monolithic `<Select variant="..." />`, you compose a trigger, a listbox, and option primitives, wrapping each in your own elements with your own styles. The result is more verbose at the call site, but it scales: there is no prop you're waiting on the maintainers to add, because the structure is already in your hands.

```tsx
// Import only the primitives you use — each is independently tree-shakeable.
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from 'tekivex-ui/combobox'

export function CountryPicker({ countries }: { countries: string[] }) {
  return (
    <Combobox className="cp">
      {/* Your markup, your classes. The primitive wires up ARIA + keyboard nav. */}
      <ComboboxInput className="cp__input" placeholder="Search countries…" />
      <ComboboxList className="cp__list">
        {countries.map((c) => (
          <ComboboxOption key={c} value={c} className="cp__option">
            {({ active, selected }) => (
              <span data-active={active} data-selected={selected}>
                {c}
              </span>
            )}
          </ComboboxOption>
        ))}
      </ComboboxList>
    </Combobox>
  )
}
```

Notice the render-prop on `ComboboxOption`: the primitive surfaces its internal state (`active`, `selected`) so you can drive your own styling from it. You never inspect a `.tekivex-option--active` class that might change in a minor release. The state is contract; the styling is yours.

```css
/* Style against the state the primitive exposes. No overrides, no !important. */
.cp__option [data-active='true'] {
  background: var(--tk-color-accent-subtle);
}
.cp__option [data-selected='true'] {
  font-weight: 600;
}
```

## Why headless beats fighting opinionated styles

When a library ships its own styles, every customization is subtractive: you start from their design and chip away at it. Headless is additive: you start from nothing and add only what you want. The difference shows up most clearly under real-world pressure — a rebrand, a design-system migration, a white-label deployment where each customer needs a distinct look.

| Concern | Opinionated styled library | Tekivex UI (headless) |
| --- | --- | --- |
| Custom markup | Limited to exposed slots | You write the DOM |
| Style overrides | CSS specificity battles | No overrides — you author from scratch |
| Accessibility | Bundled, hard to audit | Bundled, but markup is visible to you |
| Theming | Library theme tokens | Your CSS, your variables |
| Upgrade risk | Internal classes may shift | State contract is the only surface |
| Initial speed | Fast (defaults) | Slightly slower (you style it) |

The honest tradeoff: headless asks for more up-front work. If you need a generic admin panel by Friday and have no design opinions, a fully styled kit is faster. Headless pays off when the design is yours to own and must stay yours over time. We compare the two models in depth in [Tekivex UI vs MUI and Chakra](/use-cases/tekivex-ui-vs-mui-chakra).

## Tree-shaking, zero deps, and a tiny core

Headless architecture has a happy side effect on bundle size. Because each primitive is a self-contained ESM module with no shared theme runtime, your bundler can drop everything you don't import. Tekivex UI ships as tree-shakeable ES modules with **zero runtime dependencies** — nothing is pulled in transitively at runtime, so there is no hidden weight and no version-conflict surface from a dependency tree you didn't choose.

The core is under 8 kB. Everything else is pay-as-you-go: import a `Dialog` and you ship a dialog; you don't ship the data table you never touched.

```bash
npm install tekivex-ui
```

```ts
// Good: granular imports let the bundler keep only what you use.
import { Dialog, DialogTrigger, DialogPanel } from 'tekivex-ui/dialog'
import { Stack } from 'tekivex-ui/layout'

// Avoid: a single barrel import can defeat tree-shaking in older toolchains.
// import * as Tekivex from 'tekivex-ui'
```

Roughly, the budget breaks down like this:

- **Core (<8 kB):** state primitives, the composition utilities, focus and dismiss management that most components reuse.
- **Per-component:** each primitive set (`combobox`, `dialog`, `tabs`, …) adds only its own logic.
- **Layout system:** `Stack`, `Grid`, `Flex`, `Container`, and `Divider` are likewise independent imports.
- **Form toolkit:** validation and field-binding helpers, imported only when you build forms.

You pay for what you import — nothing more.

## Theming without inheritance headaches

Because Tekivex UI doesn't ship presentation, theming isn't a matter of overriding library styles — it is a job for the browser's cascade, not for JavaScript. Every theme is expressed as a set of CSS custom properties on the document root. Switching themes means changing one attribute on that root. No context provider re-renders, no component subscribes to a theme value, no reconciliation pass fires; the browser repaints with the new values and the work is done.

That distinction is a performance one. The common React pattern is a runtime `<ThemeProvider>` holding the theme in context; when the theme changes, every subscribed component must re-render to recompute styles, and runtime CSS-in-JS re-injects style objects on top. The cost scales with the number of theme consumers, not with what actually changed on screen.

| Concern | Runtime CSS-in-JS provider | CSS custom properties |
| --- | --- | --- |
| Theme switch cost | Re-render every subscribed component | One attribute write, browser repaint |
| Scales with | Number of theme consumers | Constant — independent of tree size |
| Runtime JS on switch | Recompute + re-inject styles | None |
| SSR / first paint | Hydration-sensitive | Resolved by the cascade immediately |

Themes are just **design tokens** — named semantic decisions (`--tkv-color-surface`, `--tkv-space-4`, `--tkv-radius-sm`) organised into a few narrow categories: color, spacing, typography, radius. Spacing and radius are theme-invariant in most products, so a custom theme usually overrides only the color tokens and inherits the rest. Base tokens live on `:root`; each theme is an override block keyed by `data-theme`, with high-contrast a first-class peer of dark (set deliberately to meet WCAG 2.1 AA), not a tweak of it.

```css
:root { --tkv-color-surface: #ffffff; --tkv-color-text: #1a1d21; --tkv-color-accent: #2563eb; }
[data-theme="dark"] { --tkv-color-surface: #14171a; --tkv-color-text: #e8eaed; --tkv-color-accent: #5b8cff; }
[data-theme="high-contrast"] { --tkv-color-surface: #000; --tkv-color-text: #fff; --tkv-color-accent: #ff0; }
```

The switch itself is a one-liner — and the only component that re-renders is the toggle whose own label changed:

```ts
function applyTheme(theme: 'light' | 'dark' | 'high-contrast') {
  document.documentElement.setAttribute('data-theme', theme); // cascade does the rest
  localStorage.setItem('tkv-theme', theme);
}
```

A custom brand theme is just another `data-theme` override block shipped in your own stylesheet. For SSR, set the attribute in a small inline script before paint to avoid hydration flicker.

## Forms, accessibly

Forms are where headless earns its keep most visibly. Validation state, error association via `aria-describedby`, focus-on-first-error, and live-region announcements are tedious and easy to get subtly wrong. The Tekivex UI form toolkit handles that plumbing while leaving every label, hint, and error message as markup you control. If forms are your focus, [building accessible forms](/use-cases/tekivex-ui-accessible-forms) goes deep on the patterns.

## When to use headless components

Reach for headless primitives when:

- Your design is bespoke and must stay distinct from off-the-shelf looks.
- You support multiple brands, themes, or white-label tenants.
- Accessibility is a hard requirement and you don't want to hand-roll it.
- You care about bundle size and want to ship only what you use.
- You expect the project to live for years and want a stable, minimal API surface.

Lean toward a pre-styled kit when speed-to-prototype outweighs design ownership, or when you genuinely have no opinions about appearance and never will. Both are legitimate — the mistake is choosing a styled library and then needing it to behave like a headless one.

## Key takeaways

Headless is a discipline of separation: the library guarantees behavior and accessibility; you guarantee presentation. That boundary is what makes the rest possible. Composition over configuration means you assemble small primitives instead of waiting on props. Zero runtime dependencies and tree-shakeable ESM mean a core under 8 kB and a bundle that grows only with the features you actually use. Theming through CSS custom properties means no inheritance battles and no provider overhead.

The cost is real — you write more markup and more styles up front. The return is a system you own outright, that won't fight you during a rebrand, won't surprise you with shifting internal classes, and won't tax users with code they never invoked. For teams building enterprise UIs across React 18+, Vue 3, and Svelte 5 that need to look the way *they* decide and stay accessible by default, that is a trade worth making.

Explore the [full component catalog](/product/tekivex-ui) or browse more [Tekivex use cases](/use-cases) to see how teams put these primitives to work.
