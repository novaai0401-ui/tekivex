Most "platforms" in developer tooling are really one large dependency wearing several hats. Adopt one piece and you inherit the entire runtime, the opinionated state layer, and a license that quietly changes the day your usage grows. The Tekivex Platform is built on the opposite premise. It is three separate, free-to-use products, each solving one hard problem well, each adoptable on its own, and each free for commercial use with no enterprise tier, no per-seat fees, and no paywall.

This article is about how those three products fit together when you *do* want the full stack. We will walk through an operations dashboard — the kind of internal tool that renders millions of rows, lets users work with live data, and sits behind authentication — and show where each Tekivex product lives in that picture. The important caveat to hold throughout: nothing here is required. The composition is convenient, not coercive.

The goal is to give you a mental model precise enough to make adoption decisions: which package owns which concern, how data moves between them, and where the seams are.

## The three products at a glance

Each product occupies a distinct layer of a typical data-heavy frontend. They share design conventions — CSS-variable theming, framework-agnostic APIs — but no hard runtime coupling.

| Product | Layer | Responsibility | Package |
|---|---|---|---|
| [Tekivex UI](/product/tekivex-ui) | Presentation shell | Layout, navigation, forms, primitives | `tekivex-ui` |
| [GridStorm](/product/gridstorm) | Data presentation | High-performance virtualized data grids | `gridstorm` |
| [Quantum Vault](/product/quantum-vault) | Identity | Post-quantum authentication tokens | `@sigvault/sdk` |

Read top to bottom and you have roughly the request lifecycle of our example app: a user authenticates (Quantum Vault), lands in an application shell (Tekivex UI), and works with live tables (GridStorm).

## The application shell: Tekivex UI

[Tekivex UI](/product/tekivex-ui) is the foundation most teams start with because it owns everything the user actually touches: the app frame, the sidebar, modals, buttons, and form controls. It is headless and tree-shakeable, ships with zero runtime dependencies, targets WCAG 2.1 AA (with AAA on the roadmap), themes entirely through CSS variables, and keeps its core under 8kB. Headless matters here — it gives you behavior and accessibility without imposing visual opinions, so the shell can host a GridStorm data grid without style collisions.

In our dashboard, Tekivex UI provides the chrome and the layout grid. Everything else mounts inside it.

```tsx
import { TkxConfigProvider, TkxCard } from 'tekivex-ui';
import 'tekivex-ui/styles';
import { GridStorm } from 'gridstorm/react';
import { useEffect, useState } from 'react';

export function OpsDashboard() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    // Fetch the initial inventory snapshot; refresh on your own schedule.
    fetchInventory().then(setRows);
  }, []);

  return (
    <TkxConfigProvider>
      <TkxCard heading="Live Inventory">
        <GridStorm
          rowData={rows}
          columnDefs={columns}
          rowKey="sku"
        />
      </TkxCard>
    </TkxConfigProvider>
  );
}
```

Note what is *not* happening: Tekivex UI does not know what GridStorm is. It renders children. GridStorm does not know where its rows came from. That decoupling is the whole point.

## High-performance tables: GridStorm

[GridStorm](/product/gridstorm) handles the part that breaks naive implementations — rendering and updating large, frequently-changing datasets without dropping frames. It virtualizes rows and columns so only the visible viewport is in the DOM, which is what makes a live-updating inventory or trade-blotter view feasible.

The contract GridStorm exposes is deliberately plain: give it `rowData`, `columnDefs`, and a stable `rowKey`. It does not prescribe how you fetch or mutate data. You can hand it a static array from a REST call, a paginated cursor, or a buffer that a websocket keeps mutating. Because the grid is keyed by `sku`, incoming changes reconcile against existing rows instead of forcing full re-renders.

For lower-level control, the vanilla API mounts a grid into any element, and plugins are PascalCase classes you opt into explicitly:

```ts
import { createGrid, SortingPlugin, FilteringPlugin, FormulaPlugin } from 'gridstorm';
import 'gridstorm/theme';

const grid = createGrid({
  container: document.getElementById('grid')!,
  columnDefs: [{ field: 'name', headerName: 'Name' }],
  rowData: rows,
  plugins: [new SortingPlugin(), new FilteringPlugin(), new FormulaPlugin()],
});
```

You ship only the plugins you instantiate, so a read-only table never pulls in editing or export logic it does not use.

## Identity: Quantum Vault

[Quantum Vault](/product/quantum-vault) wraps the stack in authentication built on post-quantum tokens — designed to remain valid against an adversary with a quantum computer, which matters for tokens that must stay trustworthy for years. Quantum Vault ships on npm as `@sigvault/sdk`.

Under the hood it signs tokens with ML-DSA-87 (Dilithium-5, NIST FIPS 204) and protects the payload with XChaCha20-Poly1305 authenticated encryption, with replay protection provided by a stateful HYDRA mutation chain. It is pure JavaScript with zero native dependencies.

It is also the gate that protects everything else. You issue a token at sign-in and verify it before mounting the shell.

```ts
import { generateKeypair, MutationChain, issueToken, verifyToken } from '@sigvault/sdk';

const { signingKey, verifyingKey, encryptKey } = generateKeypair();
const chain = new MutationChain();

const { tokenHex } = issueToken({
  signingKeySeed: signingKey,
  encryptKey,
  chain,
  claims: { sub: 'user-123', role: 'admin' },
  ttl: 3600,
});

const result = verifyToken({
  token: tokenHex,
  verifyingKey,
  encryptKey,
  chain: new MutationChain(chain.state),
});
// result.claims — attach to your API requests, or gate the Tekivex UI shell
```

Quantum Vault does not require any other Tekivex package — it issues and verifies tokens for whatever transport or API you use. Here it simply happens to gate the Tekivex UI shell.

## Installing the stack

Because each product is its own package, you install exactly what you need:

```bash
npm install gridstorm tekivex-ui @sigvault/sdk
```

Drop any line you do not want. Need only a fast grid in an existing app? Add GridStorm on its own and stop there.

## When to use the full stack — and when not to

The full composition earns its keep when you are building a data-dense internal application: live tables, a consistent accessible shell, and post-quantum auth, all in one place. The products were designed against that shape, so the seams line up.

But adopt by problem, not by brand. The architecture is intentionally à la carte:

- **Just need a grid?** Take GridStorm alone; it has no Tekivex dependencies.
- **Already standardized on a design system?** Skip Tekivex UI and feed GridStorm yourself.
- **Have an auth provider you trust?** Keep it; Quantum Vault is optional.

This is the practical upshot of the [free, no-paywall model](/use-cases/tekivex-mit-open-source-model): there is no commercial incentive to bundle, so the packages stay genuinely independent. You will not hit a feature wall that forces the rest of the suite on you. See the [use cases](/use-cases) for individual-adoption walkthroughs.

## Conclusion

The Tekivex Stack is a set of layers — identity, shell, and grids — that happen to compose cleanly because they were built with consistent, decoupled contracts. Quantum Vault guards the door, Tekivex UI frames the app, and GridStorm renders the rows. Used together they cover the core of an operations dashboard. Used apart, each still stands on its own. That independence, backed by a no-paywall, free-to-use model, is what lets you start with one product today and grow into the rest only if and when the problem calls for it.
