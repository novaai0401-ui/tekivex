// Shareable chart links. The entire chart state — the CSV data itself, the
// chosen chart type, and the selected columns — is encoded into the URL
// fragment (the part after '#'). Fragments are NEVER sent to a server by the
// browser, so a shared link keeps the same privacy promise as the tool: the
// data travels in the recipient's link, not through our (non-existent) backend.
//
// Pure functions so the round-trip is unit-tested. Encoding is
// base64url(JSON) with a short version tag; links past a sane size cap are
// refused (with a clear reason) rather than producing a URL no browser or chat
// app will accept.

export type ShareKind = 'bar' | 'line' | 'area' | 'donut';

export interface ChartShareState {
  /** Raw CSV text (the source of truth — re-parsed on load). */
  csv: string;
  kind: ShareKind;
  labelCol: number;
  valueCols: number[];
}

const PREFIX = 'c1:'; // version 1
/** Max encoded fragment length. ~16 KB keeps links inside real URL limits. */
export const MAX_SHARE_LEN = 16_000;

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export interface EncodeResult {
  ok: boolean;
  /** Fragment value (without the leading '#'), when ok. */
  fragment?: string;
  /** Reason when not ok (e.g. too large to share). */
  error?: string;
}

export function encodeChartState(state: ChartShareState): EncodeResult {
  const compact = { v: 1, k: state.kind, l: state.labelCol, c: state.valueCols, d: state.csv };
  const json = JSON.stringify(compact);
  const encoded = PREFIX + toBase64Url(new TextEncoder().encode(json));
  if (encoded.length > MAX_SHARE_LEN) {
    return { ok: false, error: 'This dataset is too large to put in a shareable link. Download the SVG or PNG instead.' };
  }
  return { ok: true, fragment: encoded };
}

export function decodeChartState(fragment: string): ChartShareState | null {
  const raw = fragment.startsWith('#') ? fragment.slice(1) : fragment;
  if (!raw.startsWith(PREFIX)) return null;
  try {
    const json = new TextDecoder().decode(fromBase64Url(raw.slice(PREFIX.length)));
    const obj = JSON.parse(json) as { v?: number; k?: string; l?: number; c?: number[]; d?: string };
    if (obj.v !== 1 || typeof obj.d !== 'string' || !obj.d) return null;
    const kind: ShareKind = ['bar', 'line', 'area', 'donut'].includes(obj.k as string) ? (obj.k as ShareKind) : 'bar';
    const labelCol = Number.isInteger(obj.l) ? (obj.l as number) : 0;
    const valueCols = Array.isArray(obj.c) ? obj.c.filter((n) => Number.isInteger(n)) : [];
    return { csv: obj.d, kind, labelCol, valueCols };
  } catch {
    return null;
  }
}
