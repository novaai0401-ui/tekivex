Most PDF components on npm ship with a UI baked in. You get their toolbar, their icons, their theme, their idea of how a page thumbnail should look — and the first thing every serious team does is fight it. Overriding someone else's component tree to match your design system is a special kind of misery, and it usually ends with a fork or a wrapper full of `!important`.

Pyntra takes the opposite stance. The logic ships as headless React hooks; the presentation is entirely yours. `@pyntra/engine` gives you document state and operations — load, render, fill, sign, annotate, save — and you wire them to your own components, to Material UI, or to [Tekivex UI](/product/tekivex-ui) through a bring-your-own-UI adapter. The engine never renders a button you did not ask for.

This article walks through the headless model: why separating logic from presentation matters, how the hooks are organized, and how to assemble a custom viewer and toolbar from your own building blocks.

## Why headless

"Headless" means the library owns behavior and state but renders no markup of its own. The pattern has become common for complex interactive components precisely because those are the ones whose UI teams most need to control.

- **Design-system fit.** Your viewer looks like your app, not like Pyntra. No theme overrides, no shadow-DOM workarounds.
- **Smaller surface, fewer surprises.** Logic and presentation evolve independently. A styling change never risks a behavior regression, and vice versa.
- **Testability.** Hooks expose plain state and actions, so you can test document behavior without mounting a pixel.
- **Adapter freedom.** The same engine drives a Material UI toolbar, a Tekivex UI toolbar, or a hand-rolled one. Swapping presentation does not touch logic.

The trade-off is honest: you write the markup. For teams that already have a component library, that is a feature — it is the work they were going to do anyway, minus the fight with someone else's defaults.

## The provider and the core hook

Everything hangs off a provider that holds the loaded document and a root hook that exposes top-level state and actions.

```tsx
import { PyntraProvider, usePyntra } from "@pyntra/engine/react";

function App({ bytes }: { bytes: Uint8Array }) {
  return (
    <PyntraProvider source={bytes}>
      <Toolbar />
      <Viewer />
    </PyntraProvider>
  );
}

function Toolbar() {
  const { pageCount, currentPage, goToPage, zoom, setZoom, save } = usePyntra();

  return (
    <div className="my-toolbar">
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
        Prev
      </button>
      <span>{currentPage} / {pageCount}</span>
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pageCount}>
        Next
      </button>
      <input
        type="range" min={0.5} max={3} step={0.1}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
      />
      <button onClick={() => save()}>Save</button>
    </div>
  );
}
```

Note what is *not* here: no styling assumptions, no icon set, no layout. `usePyntra` hands you state (`pageCount`, `currentPage`, `zoom`) and actions (`goToPage`, `setZoom`, `save`). The `div`, the `button`, the `input` — all yours.

## Rendering pages with a render hook

A viewer is a list of pages. `usePage` gives you what you need to render one — its dimensions and a render target — while leaving the surrounding layout to you.

```tsx
import { usePyntra, usePage } from "@pyntra/engine/react";

function Viewer() {
  const { pageCount } = usePyntra();
  return (
    <div className="my-viewer-scroll">
      {Array.from({ length: pageCount }, (_, i) => (
        <Page key={i} index={i} />
      ))}
    </div>
  );
}

function Page({ index }: { index: number }) {
  const { canvasRef, width, height, isReady } = usePage(index);
  return (
    <div className="my-page" style={{ width, height }}>
      {!isReady && <span className="my-spinner">Rendering…</span>}
      <canvas ref={canvasRef} />
    </div>
  );
}
```

Because the hook manages the render lifecycle, you can virtualize the list, lazy-render off-screen pages, or wrap each page in your own selection overlay without touching engine internals.

## Field and tool hooks

Editing follows the same shape. Each interactive concern has a focused hook so your components stay small and your design system stays in charge.

| Hook | Exposes | You render |
| --- | --- | --- |
| `useFormField(name)` | `value`, `setValue`, `type`, `options` | The input matching your design system |
| `useSignaturePad()` | `canvasRef`, `clear`, `toImage`, `isEmpty` | The pad surface and its buttons |
| `useAnnotations()` | `tool`, `setTool`, `add`, `remove`, `list` | Your annotation toolbar |
| `useDocumentSave()` | `save`, `isSaving`, `error` | Your save button and status |

```tsx
import { useFormField } from "@pyntra/engine/react";

// One renderer per field type, all driven by the same hook.
function Field({ name }: { name: string }) {
  const { type, value, setValue, options } = useFormField(name);

  switch (type) {
    case "checkbox":
      return <MyCheckbox checked={Boolean(value)} onChange={setValue} />;
    case "dropdown":
      return <MySelect value={String(value)} options={options} onChange={setValue} />;
    case "listbox":
      return <MyMultiSelect values={value as string[]} options={options} onChange={setValue} />;
    default:
      return <MyTextInput value={String(value ?? "")} onChange={setValue} />;
  }
}
```

The hook tells you the field's `type` and `options`; you decide what an input looks like in your product. The same `setValue` mutates the underlying document model regardless of which component you render.

## Choosing an adapter

You have three reasonable starting points, and they are not mutually exclusive — you can mix adapters within one app.

- **Your own components.** Maximum control. Best when you already maintain a design system and want the viewer to be indistinguishable from the rest of the app.
- **Material UI.** Fastest path to a polished result if you are already on MUI; wire the hooks to MUI inputs and buttons.
- **[Tekivex UI](/product/tekivex-ui).** A supported adapter that ships sensible defaults so you can stand up a full editor quickly, then customize as needed.

## Key takeaways

- **Logic and presentation are fully separated.** `@pyntra/engine` hooks expose document state and actions; you own every pixel of markup.
- **One hook per concern.** `usePyntra`, `usePage`, `useFormField`, `useSignaturePad`, `useAnnotations`, and `useDocumentSave` keep components small and focused.
- **Adapter freedom.** Render with your own components, Material UI, or Tekivex UI — and swap without rewriting behavior.
- **You write the markup, and that is the point.** For teams with a design system, headless removes the fight with someone else's defaults.

The headless model is what lets the same engine power a stripped-down single-field form and a full annotation suite without compromise. It runs entirely client-side, so a custom viewer built this way inherits Pyntra's privacy and latency properties for free — see [the client-side approach](/use-cases/pyntra-client-side-pdf-editing) and the [fill-and-sign walkthrough](/use-cases/pyntra-fill-sign-pdf-browser), or browse the [use-cases hub](/use-cases) and the [Pyntra product page](/product/pyntra) for the full picture. Bring your own UI; let the engine handle the PDF.
