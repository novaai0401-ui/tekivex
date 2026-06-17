Theming is one of those features that looks trivial in a demo and turns into a performance liability in production. A toggle flips from light to dark, a few colors change, everyone moves on. But the *mechanism* behind that toggle matters enormously once your application has thousands of mounted components, deeply nested trees, and a design system that needs to support not just dark and light but high-contrast modes for accessibility compliance.

Tekivex UI takes a deliberate position here: theming is a job for the browser's cascade, not for JavaScript. Every theme in the library is expressed as a set of CSS custom properties (CSS variables) defined on the document root. Switching themes means changing a single attribute on that root element. No context provider re-renders, no component subscribes to a theme value, no React reconciliation pass fires. The browser repaints with the new variable values and the work is done.

This article explains why that architecture matters, how the design token system is structured, and how you build and ship a custom theme of your own. If you have ever profiled a theme switch and watched a flame graph light up with component renders, this is the alternative.

## The cost of theming through JavaScript

The most common pattern in the React ecosystem is the runtime theme provider. A `<ThemeProvider>` holds the active theme object in context. Components read from that context — often through styled-components, Emotion, or a `useTheme()` hook — and produce styles based on the values they read. When the theme changes, the context value changes, and React must re-render every consumer to recompute those styles.

That is correct behavior for context. It is also expensive. The cost scales with the number of components subscribed to the theme, not with the number of things that actually changed on screen. In a large dashboard you can be re-rendering hundreds of subtrees and re-serializing thousands of style declarations to swap one color palette. Runtime CSS-in-JS adds another layer: style objects are recomputed and re-injected into the document on each change.

CSS custom properties sidestep all of it. The variables live in the stylesheet. Components reference them once, statically, in their CSS. When you change the active theme, the *values* behind those variables change but the *references* do not. JavaScript does essentially nothing.

| Concern | Runtime CSS-in-JS theme provider | CSS custom properties |
| --- | --- | --- |
| Theme switch cost | Re-render every subscribed component | One attribute write, browser repaint |
| Scales with | Number of theme consumers | Constant — independent of tree size |
| Runtime JS on switch | Recompute + re-inject styles | None |
| Style location | Generated at runtime | Static stylesheet |
| SSR / first paint | Hydration-sensitive | Resolved by the cascade immediately |

Tekivex UI ships with zero runtime dependencies and a core bundle under 8 kB precisely because none of this theming machinery needs to exist at runtime. The styles are plain CSS.

## Design tokens as the contract

A token is a named, semantic design decision. Instead of scattering `#1a1a1a` across a codebase, you define `--tkv-color-surface` once and reference it everywhere. The theme is then nothing more than a mapping from token names to values. Swapping that mapping swaps the entire look without touching a single component.

Tekivex UI organizes tokens into a small number of categories so they stay predictable across the React, Vue, and Svelte packages:

| Category | Prefix | Example |
| --- | --- | --- |
| Color | `--tkv-color-*` | `--tkv-color-surface`, `--tkv-color-text` |
| Spacing | `--tkv-space-*` | `--tkv-space-2`, `--tkv-space-4` |
| Typography | `--tkv-font-*` | `--tkv-font-size-md`, `--tkv-font-weight-bold` |
| Radius | `--tkv-radius-*` | `--tkv-radius-sm`, `--tkv-radius-full` |

The categories are intentionally narrow. Spacing and radius are theme-invariant in most products — only color tends to change between light, dark, and high-contrast modes — so keeping them separate means a custom theme usually only overrides the color tokens and inherits everything else.

## Defining themes in CSS

Here is the shape of a real token sheet. Base tokens live on `:root`, and each theme is an override block keyed by a `data-theme` attribute. The high-contrast theme is a peer of dark, not a variant of it — it sets its own deliberate values to meet WCAG 2.1 AA contrast requirements rather than tweaking dark by a few percent.

```css
:root {
  /* Light theme is the default on :root */
  --tkv-color-surface: #ffffff;
  --tkv-color-text: #1a1d21;
  --tkv-color-accent: #2563eb;
  --tkv-color-border: #d8dde3;

  /* Theme-invariant tokens */
  --tkv-space-2: 0.5rem;
  --tkv-space-4: 1rem;
  --tkv-font-size-md: 1rem;
  --tkv-font-weight-bold: 600;
  --tkv-radius-sm: 4px;
  --tkv-radius-full: 9999px;
}

[data-theme="dark"] {
  --tkv-color-surface: #14171a;
  --tkv-color-text: #e8eaed;
  --tkv-color-accent: #5b8cff;
  --tkv-color-border: #2a2f36;
}

[data-theme="high-contrast"] {
  --tkv-color-surface: #000000;
  --tkv-color-text: #ffffff;
  --tkv-color-accent: #ffff00;
  --tkv-color-border: #ffffff;
}
```

Components in the library never hardcode a color. A button references `var(--tkv-color-accent)`, a card references `var(--tkv-color-surface)`, and the value each resolves to is whatever the nearest matching theme block on the cascade provides. Because the override blocks target the root, every component below inherits the active palette automatically.

## Switching themes without a re-render

The switch itself is a one-liner: write a `data-theme` attribute on the document element. That is the entire operation. The browser recomputes the affected custom properties and repaints. React does not reconcile, Vue does not patch, Svelte does not run an update — the framework is not involved at all.

```tsx
import { useState, useEffect } from "react";
import { Button } from "tekivex-ui";

type Theme = "light" | "dark" | "high-contrast";

function applyTheme(theme: Theme) {
  // The cascade does the work. No provider, no context, no re-render.
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("tkv-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("tkv-theme") as Theme) ?? "light"
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const cycle: Record<Theme, Theme> = {
    light: "dark",
    dark: "high-contrast",
    "high-contrast": "light",
  };

  return (
    <Button onClick={() => setTheme((t) => cycle[t])}>
      Theme: {theme}
    </Button>
  );
}
```

Notice that the only component re-rendering here is the toggle itself — because its own label changed. Every other Tekivex UI component on the page restyles purely through CSS. The `useState` exists to drive the toggle's text and persistence, not to broadcast the theme to consumers. There are no consumers in the React sense.

For server-rendered apps, the same approach avoids hydration flicker: set the attribute in a small inline script before paint, reading the persisted value from `localStorage`, and the correct theme is in place on first render with no flash and no client-side re-render.

## Building a custom theme

Because a theme is just a token map, a custom theme is just another override block. Define your brand palette under a `data-theme` attribute of your choosing, ship it in your own stylesheet alongside Tekivex UI's tokens, and pass that attribute name to your toggle. You override only the tokens you care about; everything you leave alone falls back to the base `:root` values, so spacing, typography, and radius stay consistent with the rest of the system unless you explicitly diverge.

This is also where the headless side of the library pays off. The components ship behavior and accessibility wiring, not opinionated visuals, so a custom token map can restyle them comprehensively without fighting baked-in styles. If you need to go further and own the markup entirely, the [headless primitives](/use-cases/tekivex-ui-headless-design-system) expose the same token contract for full control.

## Key takeaways

- Theming through CSS custom properties moves the work from JavaScript to the browser's cascade, making a theme switch cost a constant single attribute write regardless of how many components are mounted.
- Runtime CSS-in-JS theme providers re-render every subscribed component on each switch; that cost grows with your tree, not with what actually changed.
- Tokens are organized into color, spacing, typography, and radius categories. Most themes only override color, inheriting the rest.
- High-contrast is a first-class theme, defined deliberately to meet WCAG 2.1 AA — not a derived tweak of dark mode.
- A custom theme is a `data-theme` override block plus a one-line toggle. No provider, no context, no re-render of the component tree.

If you are weighing this architecture against a styled-components or Emotion-based system, the [comparison with MUI and Chakra](/use-cases/tekivex-ui-vs-mui-chakra) goes deeper on the runtime trade-offs, and our [accessible forms guide](/use-cases/tekivex-ui-accessible-forms) shows how the same token contract drives focus and state styling. For the full component catalog and framework support across React 18+, Vue 3, and Svelte 5, see the [Tekivex UI product page](/product/tekivex-ui), or browse more engineering write-ups in [use cases](/use-cases).

Theming should be a property of your stylesheet, not a runtime tax on your render loop. By committing to CSS custom properties and a disciplined token contract, Tekivex UI keeps theme switching instant, keeps the bundle small, and keeps accessibility modes like high-contrast on equal footing with the rest of the system. The cascade was built for exactly this — Tekivex UI just gets out of its way.
