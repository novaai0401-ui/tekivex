Filling out a PDF, signing it, and protecting it with a password is one of the most common document workflows in any business — onboarding paperwork, consent forms, NDAs, expense claims. It is also one of the most awkward to build well, because the obvious implementation routes the user's most sensitive document through a server.

Pyntra does the entire flow in the browser. You load a PDF, fill every kind of form field, capture a handwritten signature from a signature pad, stamp an image, encrypt the result with AES-256, and hand the user a download — without a single byte leaving the page. This walkthrough builds that flow end to end with `@pyntra/engine`.

Everything below runs client-side. There is no upload step to add, no temporary file to delete, and no server to scale. If you want the architectural rationale behind that, see [the Pyntra client-side approach](/use-cases/pyntra-client-side-pdf-editing).

## Loading a PDF in the browser

The input is a `Uint8Array`. It can come from a file picker, a drag-and-drop zone, or a `fetch` of an asset you already control.

```tsx
import { loadDocument, type PyntraDocument } from "@pyntra/engine";

async function onFile(file: File): Promise<PyntraDocument> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await loadDocument(bytes);

  // If the source is already encrypted, supply the password to decrypt.
  if (doc.isEncrypted) {
    await doc.unlock(prompt("PDF password") ?? "");
  }
  return doc;
}
```

Once loaded, the document exposes its AcroForm fields in a typed list, so you can drive your UI from the actual structure of the PDF rather than hard-coding field names.

## Filling every field type

PDF forms support more than text boxes. Pyntra models each field type explicitly, so a checkbox is a boolean, a dropdown is a constrained choice, and a listbox can hold multiple selections. The `fields` API normalizes the underlying AcroForm details into values you can set directly.

```ts
const f = doc.fields;

f.set("full_name", "Dana Okoro");              // text
f.set("bio", "Line one\nLine two");            // multiline text
f.set("start_date", "2026-07-01");             // date
f.set("years_experience", 8);                  // number
f.set("agree_terms", true);                    // checkbox
f.set("contract_type", "full_time");           // radio group
f.set("department", "Engineering");            // dropdown
f.set("skills", ["TypeScript", "Rust"]);       // listbox (multi-select)

// Inspect available options before setting a constrained field.
const dept = f.get("department");
console.log(dept.options); // ["Engineering", "Design", "Operations"]
```

If the PDF is missing a field you need, you are not stuck. Pyntra supports adding new fields by drawing a rectangle on a page — the same drag-to-draw interaction users get in the editor, available programmatically.

```ts
doc.fields.add({
  type: "text",
  name: "employee_id",
  page: 0,
  rect: { x: 320, y: 540, width: 180, height: 24 },
});
```

The full field-type matrix:

| Field type | Pyntra value | Notes |
| --- | --- | --- |
| Text | `string` | Single line |
| Multiline | `string` | Newlines preserved |
| Date | `string` (ISO) | Rendered per field format |
| Number | `number` | Validated on set |
| Checkbox | `boolean` | On/off state |
| Radio | `string` | One value per group |
| Dropdown | `string` | Constrained to options |
| Listbox | `string[]` | Multi-select |

## Capturing a signature

Signing has two parts: getting the signature image, and placing it on the page. Pyntra includes a signature pad that captures strokes on a canvas and exports them as a transparent PNG, which you then stamp onto the document at a chosen rectangle.

```tsx
import { useSignaturePad } from "@pyntra/engine/react";

function SignatureStep({ doc }: { doc: PyntraDocument }) {
  const { canvasRef, clear, toImage, isEmpty } = useSignaturePad();

  async function place() {
    const png = await toImage(); // Uint8Array, transparent background
    await doc.stamp({
      image: png,
      page: 0,
      rect: { x: 80, y: 120, width: 200, height: 60 },
    });
  }

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={150} />
      <button onClick={clear}>Clear</button>
      <button disabled={isEmpty} onClick={place}>Place signature</button>
    </div>
  );
}
```

## Stamping an image

Stamping is not limited to signatures. The same `stamp` operation embeds any image — a company seal, a "PAID" mark, a scanned initial, a logo. Because embedding happens in the engine, the image becomes part of the PDF's resource tree rather than a fragile overlay.

```ts
// Embed a company seal on the last page.
const sealBytes = new Uint8Array(await (await fetch("/seal.png")).arrayBuffer());

await doc.stamp({
  image: sealBytes,
  page: doc.pageCount - 1,
  rect: { x: 420, y: 60, width: 96, height: 96 },
  opacity: 0.9,
});
```

Stamping sits alongside Pyntra's other annotation tools — highlight, draw, eraser, redact, crop, and shapes — all of which mutate the same document model and serialize cleanly on save.

## Encrypting with AES-256 and downloading

The last step protects the finished document. Pyntra supports RC4, AES-128, and AES-256; for anything sensitive, use AES-256. Encryption is applied at save time, producing a password-protected PDF entirely on the client.

```ts
const encrypted = await doc.save({
  encryption: {
    algorithm: "AES-256",
    userPassword: "openWithThis",   // required to open
    ownerPassword: "fullControl",   // required to change permissions
    permissions: { printing: true, copying: false, modifying: false },
  },
});

// Trigger a client-side download — no server involved.
const blob = new Blob([encrypted], { type: "application/pdf" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "signed-contract.pdf";
a.click();
URL.revokeObjectURL(url);
```

That is the whole pipeline: bytes in, edited and encrypted bytes out, and the user clicks download. The plaintext document and the password never touched a server.

## Key takeaways

- **All field types are first-class.** Text, multiline, date, number, checkbox, radio, dropdown, and listbox each map to a natural JavaScript value, and you can add new fields by drawing a rectangle.
- **Signing is capture plus stamp.** The signature pad produces a transparent PNG; `stamp` embeds it as a real PDF resource, the same mechanism used for seals and logos.
- **Encryption is built in.** AES-256 at save time means the protected document is produced locally, with no service to trust.
- **No round trip.** The entire fill-sign-encrypt-download flow is client-side, which removes the upload-handling backend altogether.

For larger or unusual documents you can move `loadDocument` and `save` into a web worker so the UI stays smooth. To build a fully custom interface around these operations, read [headless React PDF hooks](/use-cases/pyntra-headless-react-pdf-hooks); to see how this stack compares to alternatives, see [Pyntra vs PDF.js vs Puppeteer](/use-cases/pyntra-vs-pdfjs-puppeteer). The complete capability list and a live demo are on the [Pyntra product page](/product/pyntra).
