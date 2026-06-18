// ─────────────────────────────────────────────────────────────────────────────
// Tekivex launch promo — headless MP4 renderer.
//
// Generates the promo frame-by-frame as SVG, rasterizes each with @resvg/resvg-js,
// and encodes an H.264 MP4 (Twitter/X-ready) plus a poster PNG with ffmpeg-static.
// No browser required. Tooling is installed with `npm i --no-save` so it never
// touches package.json. Run:  node marketing/build-video.mjs
// ─────────────────────────────────────────────────────────────────────────────
import { Resvg } from '@resvg/resvg-js';
import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_MP4 = join(__dirname, 'tekivex-promo.mp4');
const OUT_POSTER = join(__dirname, 'tekivex-promo-poster.png');

const W = 1080, H = 1080, FPS = 30;
const FONT_DIR = '/mnt/skills/examples/canvas-design/canvas-fonts';
const fontFiles = [
  join(FONT_DIR, 'WorkSans-Bold.ttf'),
  join(FONT_DIR, 'WorkSans-Regular.ttf'),
  join(FONT_DIR, 'JetBrainsMono-Bold.ttf'),
];

// ── palette ──
const C = {
  gs: '#3b82f6', py: '#ef4444', as: '#06b6d4', qv: '#8b5cf6', df: '#22c55e', ui: '#f97316',
  ink: '#f8fafc', muted: '#94a3b8', green: '#86efac',
};

// ── math helpers ──
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
const easeInOut = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a, b, t) => a + (b - a) * t;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function text(x, y, str, o = {}) {
  const { size = 48, weight = 700, fill = C.ink, anchor = 'middle', family = 'Work Sans', spacing = 0, opacity = 1 } = o;
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}" opacity="${opacity}">${esc(str)}</text>`;
}
// rise wrapper: fade + slide up over `dur` seconds starting at `delay`
function rise(lt, inner, { delay = 0, dur = 0.6, dy = 30 } = {}) {
  const p = easeOut((lt - delay) / dur);
  return `<g opacity="${p.toFixed(3)}" transform="translate(0 ${((1 - p) * dy).toFixed(2)})">${inner}</g>`;
}
function tag(cx, y, label, color) {
  const w = 70 + label.length * 22;
  return `<g>
    <rect x="${cx - w / 2}" y="${y - 44}" width="${w}" height="60" rx="30" fill="${color}22" stroke="${color}66"/>
    <circle cx="${cx - w / 2 + 34}" cy="${y - 14}" r="9" fill="${color}"/>
    ${text(cx + 14, y + 6, label, { size: 28, weight: 700, fill: color, spacing: 2 })}
  </g>`;
}

// ── scene draws (return SVG markup; lt = seconds into scene) ──
const scenes = [
  { name: 'hook', dur: 3.5, draw: (lt) => `
    ${rise(lt, text(540, 360, 'OPEN SOURCE · MIT LICENSED', { size: 30, weight: 700, fill: C.muted, spacing: 6 }), { delay: 0.05 })}
    ${rise(lt, text(540, 470, 'Enterprise developer tools,', { size: 78, weight: 700 }), { delay: 0.15 })}
    ${rise(lt, text(540, 575, 'open and free.', { size: 78, weight: 700, fill: C.gs }), { delay: 0.3 })}
    ${rise(lt, text(540, 680, 'No paywalls. No per-seat fees. Free forever.', { size: 36, weight: 400, fill: C.muted }), { delay: 0.5 })}
  ` },

  { name: 'brand', dur: 3.5, draw: (lt) => {
    const dotColors = [C.gs, C.py, C.as, C.qv, C.df, C.ui];
    const dots = dotColors.map((col, i) => {
      const s = easeOut((lt - 0.1 - i * 0.08) / 0.4);
      const cx = 540 - (6 * 46) / 2 + 23 + i * 46, cy = 360;
      return `<g transform="translate(${cx} ${cy}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})"><rect x="${cx - 17}" y="${cy - 17}" width="34" height="34" rx="9" fill="${col}"/></g>`;
    }).join('');
    const pill = (cx, y, w, label, free) =>
      `<rect x="${cx - w / 2}" y="${y - 38}" width="${w}" height="56" rx="28" fill="${free ? '#22c55e28' : '#ffffff0d'}" stroke="${free ? '#22c55e88' : '#ffffff28'}"/>${text(cx, y, label, { size: 26, weight: 700, fill: free ? C.green : C.ink })}`;
    return `
      ${dots}
      ${rise(lt, text(540, 540, 'Tekivex', { size: 132, weight: 700 }), { delay: 0.25 })}
      ${rise(lt, `${pill(540 - 250, 660, 200, '6 products')}${pill(540, 660, 230, 'MIT licensed')}${pill(540 + 255, 660, 220, 'Free forever', true)}`, { delay: 0.5 })}
    `;
  } },

  { name: 'gridstorm', dur: 5, draw: (lt) => {
    const rowH = 56, cols = ['Symbol', 'Price', 'Change', 'Volume', ''];
    const syms = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'META', 'GOOGL', 'AMD', 'NFLX', 'INTC', 'ORCL', 'CRM', 'UBER', 'SHOP', 'BABA'];
    const mx = 110, my = 470, mw = 860, mh = 470;
    const colX = [mx + 28, mx + 210, mx + 400, mx + 600, mx + 790];
    const offset = (lt * 95) % rowH;
    let rows = '';
    for (let i = -1; i < Math.ceil(mh / rowH) + 1; i++) {
      const idx = (Math.floor(lt * 95 / rowH) + i + 100) % syms.length;
      const y = my + 64 + i * rowH - offset;
      if (y < my + 56 || y > my + mh - 8) continue;
      const up = (idx % 3 !== 0);
      const price = (50 + (idx * 37 % 400)).toFixed(2);
      const chg = ((idx % 7) - 3 + 0.2).toFixed(2);
      const flash = (idx % 4 === 0) ? (0.12 + 0.12 * Math.sin(lt * 6 + idx)) : 0;
      rows += `<rect x="${mx}" y="${y - 38}" width="${mw}" height="${rowH}" fill="${C.df}" opacity="${flash.toFixed(3)}"/>`;
      rows += text(colX[0], y, syms[idx], { size: 24, weight: 700, fill: '#cbd5e1', anchor: 'start' });
      rows += text(colX[1], y, '$' + price, { size: 23, fill: '#94a3b8', anchor: 'start', weight: 400 });
      rows += text(colX[2], y, (up ? '+' : '') + chg + '%', { size: 23, weight: 700, fill: up ? C.green : '#fca5a5', anchor: 'start' });
      rows += text(colX[3], y, (1 + idx % 9) + '.' + (idx % 9) + 'M', { size: 23, fill: '#94a3b8', anchor: 'start', weight: 400 });
      rows += text(colX[4], y, up ? '▲' : '▼', { size: 22, fill: up ? C.green : '#fca5a5', anchor: 'middle' });
    }
    const head = cols.map((c, i) => c ? text(colX[i], my + 36, c, { size: 22, weight: 700, fill: '#e2e8f0', anchor: 'start' }) : '').join('');
    return `
      ${rise(lt, tag(540, 250, 'GRIDSTORM', C.gs), { delay: 0.05 })}
      ${rise(lt, text(540, 340, 'The data grid that flies', { size: 64, weight: 700 }), { delay: 0.15 })}
      ${rise(lt, text(540, 400, '100K+ rows @ 60fps  ·  42 Excel formulas  ·  <50KB core', { size: 30, weight: 400, fill: C.muted }), { delay: 0.3 })}
      ${rise(lt, `
        <clipPath id="gclip"><rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="20"/></clipPath>
        <rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="20" fill="#0f1730" stroke="#ffffff1a"/>
        <rect x="${mx}" y="${my}" width="${mw}" height="56" fill="#16203f"/>
        ${head}
        <g clip-path="url(#gclip)">${rows}</g>
      `, { delay: 0.45, dur: 0.7 })}
    `;
  } },

  { name: 'pyntra', dur: 4.5, draw: (lt) => {
    const dx = 200, dy = 470, dw = 680, dh = 430;
    const fill = easeOut((lt - 0.7) / 1.0);
    const sigP = clamp((lt - 1.0) / 1.4);
    const dash = (1 - easeInOut(sigP)) * 620;
    const lockA = easeOut((lt - 2.0) / 0.4);
    return `
      ${rise(lt, tag(540, 250, 'PYNTRA', C.py), { delay: 0.05 })}
      ${rise(lt, text(540, 340, 'Edit & sign PDFs in the browser', { size: 56, weight: 700 }), { delay: 0.15 })}
      ${rise(lt, text(540, 400, 'Form-fill · annotate · AES-256 · zero server, zero upload', { size: 29, weight: 400, fill: C.muted }), { delay: 0.3 })}
      ${rise(lt, `
        <rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" rx="14" fill="#f8fafc"/>
        <rect x="${dx + 40}" y="${dy + 44}" width="${dw - 200}" height="16" rx="6" fill="#e2e8f0"/>
        <rect x="${dx + 40}" y="${dy + 76}" width="${dw - 360}" height="16" rx="6" fill="#e2e8f0"/>
        <rect x="${dx + 40}" y="${dy + 124}" width="${dw - 80}" height="50" rx="8" fill="none" stroke="${C.py}" stroke-width="3"/>
        <clipPath id="fclip"><rect x="${dx + 40}" y="${dy + 124}" width="${dw - 80}" height="50" rx="8"/></clipPath>
        <rect clip-path="url(#fclip)" x="${dx + 40}" y="${dy + 124}" width="${((dw - 80) * fill).toFixed(1)}" height="50" fill="${C.py}22"/>
        <rect x="${dx + 40}" y="${dy + 200}" width="${dw - 160}" height="16" rx="6" fill="#e2e8f0"/>
        <svg x="${dx + dw - 250}" y="${dy + dh - 130}" width="220" height="100" viewBox="0 0 220 100">
          <path d="M10 65 C 40 12, 60 88, 92 44 S 152 12, 182 56 C 198 72, 208 38, 215 50" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round" stroke-dasharray="620" stroke-dashoffset="${dash.toFixed(1)}"/>
        </svg>
        <g opacity="${lockA.toFixed(3)}">${text(dx + 40, dy + dh - 36, '🔒  Encrypted · AES-256', { size: 26, weight: 700, fill: '#16a34a', anchor: 'start', family: 'Work Sans' })}</g>
      `, { delay: 0.45, dur: 0.7 })}
    `;
  } },

  { name: 'trio', dur: 4.5, draw: (lt) => {
    const cardW = 280, gap = 30, totalW = cardW * 3 + gap * 2, x0 = 540 - totalW / 2, cy = 470, ch = 400;
    const card = (i, title, color, body, inner) => {
      const x = x0 + i * (cardW + gap);
      return `<g>
        <rect x="${x}" y="${cy}" width="${cardW}" height="${ch}" rx="20" fill="#0f1730" stroke="#ffffff1a"/>
        ${text(x + 26, cy + 56, title, { size: 28, weight: 700, fill: color, anchor: 'start' })}
        ${text(x + 26, cy + 96, body, { size: 20, weight: 400, fill: C.muted, anchor: 'start' })}
        ${inner(x)}
      </g>`;
    };
    // Analytics bars
    const barsInner = (x) => {
      const bx = x + 26, by = cy + ch - 40, bw = (cardW - 52 - 4 * 14) / 5, hMax = 230;
      const targets = [0.55, 0.85, 0.45, 0.7, 1.0];
      return targets.map((tg, i) => {
        const h = easeOut((lt - 0.5 - i * 0.08) / 0.7) * tg * hMax;
        return `<rect x="${bx + i * (bw + 14)}" y="${by - h}" width="${bw}" height="${h.toFixed(1)}" rx="5" fill="${C.as}"/>`;
      }).join('');
    };
    // DataFlow counter + sparkline
    const flowInner = (x) => {
      const val = Math.floor(1240 + easeOut(lt / 1.6) * 8600 + Math.sin(lt * 12) * 18);
      const pts = '0,40 30,22 60,30 90,12 120,34 150,16 180,28 210,8 240,22';
      return `${text(x + 26, cy + 250, val.toLocaleString(), { size: 60, weight: 700, fill: C.df, anchor: 'start', family: 'JetBrains Mono' })}
        <polyline points="${pts}" fill="none" stroke="${C.df}" stroke-width="3" transform="translate(${x + 26} ${cy + 300})"/>
        ${text(x + 26, cy + ch - 30, 'events / sec', { size: 18, weight: 400, fill: C.muted, anchor: 'start' })}`;
    };
    // Quantum shield with pulse glow
    const shieldInner = (x) => {
      const pulse = 1 + 0.06 * Math.sin(lt * 3.2);
      const glow = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(lt * 3.2));
      const scx = x + cardW / 2, scy = cy + 250;
      return `<g transform="translate(${scx} ${scy}) scale(${pulse.toFixed(3)}) translate(${-scx} ${-scy})">
        <g transform="translate(${scx - 60} ${scy - 60})">
          <path d="M60 8 L108 28 V64 C108 96 88 122 60 132 C32 122 12 96 12 64 V28 Z" fill="${C.qv}1f" stroke="${C.qv}" stroke-width="3" opacity="${glow.toFixed(3)}"/>
          <path d="M44 66 l12 12 l24 -26" fill="none" stroke="${C.qv}" stroke-width="5" stroke-linecap="round"/>
        </g></g>`;
    };
    return `
      ${rise(lt, text(540, 320, 'One stack. All open source.', { size: 60, weight: 700 }), { delay: 0.05 })}
      ${rise(lt, card(0, 'Analytics Studio', C.as, '26+ charts · in-browser SQL', barsInner), { delay: 0.3, dur: 0.6 })}
      ${rise(lt, card(1, 'DataFlow', C.df, 'real-time streaming', flowInner), { delay: 0.4, dur: 0.6 })}
      ${rise(lt, card(2, 'Quantum Vault', C.qv, 'post-quantum tokens', shieldInner), { delay: 0.5, dur: 0.6 })}
    `;
  } },

  { name: 'ui', dur: 3.5, draw: (lt) => {
    const el = (i, inner) => rise(lt, inner, { delay: 0.4 + i * 0.1, dur: 0.45, dy: 22 });
    const cy = 620;
    return `
      ${rise(lt, tag(540, 270, 'TEKIVEX UI', C.ui), { delay: 0.05 })}
      ${rise(lt, text(540, 360, '50+ accessible components', { size: 60, weight: 700 }), { delay: 0.15 })}
      ${rise(lt, text(540, 420, 'React · Vue · Svelte  ·  WCAG 2.1 AA  ·  tree-shakeable', { size: 29, weight: 400, fill: C.muted }), { delay: 0.3 })}
      ${el(0, `<rect x="${540 - 360}" y="${cy - 40}" width="200" height="72" rx="14" fill="${C.ui}"/>${text(540 - 260, cy + 8, 'Get started', { size: 26, weight: 700, fill: '#1a1205' })}`)}
      ${el(1, `<rect x="${540 - 140}" y="${cy - 40}" width="150" height="72" rx="14" fill="none" stroke="#ffffff33"/>${text(540 - 65, cy + 8, 'Docs', { size: 26, weight: 700 })}`)}
      ${el(2, `<rect x="${540 + 40}" y="${cy - 40}" width="320" height="72" rx="14" fill="#0f1730" stroke="#ffffff26"/>${text(540 + 64, cy + 8, 'Search components…', { size: 24, weight: 400, fill: C.muted, anchor: 'start' })}`)}
      ${el(3, `<rect x="${540 - 200}" y="${cy + 70}" width="110" height="58" rx="29" fill="${C.ui}"/><circle cx="${540 - 200 + 81}" cy="${cy + 99}" r="22" fill="#fff"/>`)}
      ${el(4, `<rect x="${540 - 60}" y="${cy + 72}" width="130" height="54" rx="27" fill="${C.ui}28" stroke="${C.ui}88"/>${text(540 + 5, cy + 106, 'Accessible', { size: 22, weight: 700, fill: '#fdba74' })}`)}
      ${el(5, `<rect x="${540 + 90}" y="${cy + 72}" width="130" height="54" rx="27" fill="${C.ui}28" stroke="${C.ui}88"/>${text(540 + 155, cy + 106, 'Themeable', { size: 22, weight: 700, fill: '#fdba74' })}`)}
    `;
  } },

  { name: 'usecases', dur: 3.5, draw: (lt) => {
    const cards = [
      ['ARCHITECTURE', 'GridStorm: 100K rows at 60fps', C.gs],
      ['COMPARISON', 'Pyntra vs PDF.js vs Puppeteer', C.py],
      ['EXPLAINER', 'Post-quantum tokens, explained', C.qv],
      ['USE CASE', 'Real-time streaming in React', C.df],
      ['COMPARISON', 'Tekivex UI vs MUI vs Chakra', C.ui],
      ['USE CASE', 'Drag-and-drop BI dashboards', C.as],
    ];
    const cw = 282, chh = 150, gap = 18, x0 = 540 - (cw * 3 + gap * 2) / 2, y0 = 540;
    const grid = cards.map((c, i) => {
      const cx = x0 + (i % 3) * (cw + gap), cyy = y0 + Math.floor(i / 3) * (chh + gap);
      const inner = `<rect x="${cx}" y="${cyy}" width="${cw}" height="${chh}" rx="16" fill="#0f1730" stroke="#ffffff1a"/>
        ${text(cx + 22, cyy + 44, c[0], { size: 16, weight: 700, fill: c[2], anchor: 'start', spacing: 2 })}
        ${text(cx + 22, cyy + 88, c[1].length > 26 ? c[1].slice(0, 25) + '…' : c[1], { size: 22, weight: 700, anchor: 'start' })}`;
      return rise(lt, inner, { delay: 0.35 + i * 0.07, dur: 0.5, dy: 26 });
    }).join('');
    return `
      ${rise(lt, text(540, 300, 'NEW', { size: 26, weight: 700, fill: C.gs, spacing: 6 }), { delay: 0.05 })}
      ${rise(lt, text(540, 390, '27 engineering deep-dives', { size: 64, weight: 700 }), { delay: 0.15 })}
      ${rise(lt, text(540, 450, 'Architecture, migrations & comparisons — by the team that builds them.', { size: 27, weight: 400, fill: C.muted }), { delay: 0.3 })}
      ${grid}
    `;
  } },

  { name: 'cta', dur: 3.2, draw: (lt) => {
    const caret = (Math.floor(lt * 2) % 2 === 0) ? 1 : 0;
    return `
      ${rise(lt, `${text(540, 400, 'Free forever.', { size: 92, weight: 700 })}`, { delay: 0.1 })}
      ${rise(lt, text(540, 510, 'No paywalls.', { size: 92, weight: 700, fill: C.green }), { delay: 0.25 })}
      ${rise(lt, text(540, 590, 'Open-source enterprise developer tools.', { size: 32, weight: 400, fill: C.muted }), { delay: 0.45 })}
      ${rise(lt, `
        <rect x="${540 - 320}" y="650" width="640" height="84" rx="14" fill="#0a0f1f" stroke="#ffffff1f"/>
        ${text(540 - 290, 702, '$', { size: 30, weight: 700, fill: C.muted, anchor: 'start', family: 'JetBrains Mono' })}
        ${text(540 - 262, 702, 'npm i @tekivex/gridstorm', { size: 30, weight: 700, fill: C.green, anchor: 'start', family: 'JetBrains Mono' })}
        <rect x="${540 + 232}" y="680" width="14" height="34" fill="${C.green}" opacity="${caret}"/>
      `, { delay: 0.6 })}
      ${rise(lt, text(540, 860, 'tekivex.com', { size: 64, weight: 700, fill: C.gs }), { delay: 0.8 })}
    `;
  } },
];

const TOTAL = scenes.reduce((s, sc) => s + sc.dur, 0);
const starts = []; { let acc = 0; for (const sc of scenes) { starts.push(acc); acc += sc.dur; } }
const FADE = 0.3;

function background() {
  return `
    <defs>
      <radialGradient id="bg1" cx="50%" cy="-10%" r="75%">
        <stop offset="0%" stop-color="#1b2a55"/><stop offset="55%" stop-color="#0b1020"/>
      </radialGradient>
      <radialGradient id="bg2" cx="110%" cy="110%" r="60%">
        <stop offset="0%" stop-color="#2a1f4d"/><stop offset="100%" stop-color="#0b102000"/>
      </radialGradient>
      <pattern id="dots" width="38" height="38" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.4" fill="#ffffff0d"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="#0b1020"/>
    <rect width="${W}" height="${H}" fill="url(#bg1)"/>
    <rect width="${W}" height="${H}" fill="url(#bg2)"/>
    <rect width="${W}" height="${H}" fill="url(#dots)"/>`;
}
function watermark() {
  return `<g>
    <rect x="48" y="40" width="34" height="34" rx="9" fill="${C.gs}"/>
    <rect x="48" y="40" width="34" height="34" rx="9" fill="${C.qv}" opacity="0.5"/>
    ${text(96, 66, 'Tekivex', { size: 30, weight: 700, anchor: 'start' })}
  </g>`;
}
function sceneLayer(i, lt, alpha) {
  return `<g opacity="${alpha.toFixed(3)}">${scenes[i].draw(lt)}</g>`;
}
function frameSVG(t) {
  let i = 0;
  for (let k = 0; k < scenes.length; k++) if (t >= starts[k]) i = k;
  const lt = t - starts[i];
  let layers = '';
  if (lt < FADE && i > 0) {
    const prev = scenes[i - 1];
    layers += sceneLayer(i - 1, prev.dur, 1);                 // outgoing holds final state
    layers += sceneLayer(i, lt, easeInOut(lt / FADE));        // incoming crossfades in
  } else {
    layers += sceneLayer(i, lt, 1);
  }
  const prog = (t / TOTAL) * W;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${background()}
    ${watermark()}
    ${layers}
    <rect x="0" y="${H - 6}" width="${prog.toFixed(1)}" height="6" fill="${C.gs}"/>
  </svg>`;
}

// ── render frames ──
const dir = mkdtempSync(join(tmpdir(), 'tekivex-promo-'));
const totalFrames = Math.round(TOTAL * FPS);
const fontOpt = { font: { loadSystemFonts: false, fontFiles, defaultFontFamily: 'Work Sans' } };
console.log(`Rendering ${totalFrames} frames (${TOTAL.toFixed(1)}s @ ${FPS}fps) …`);
let posterBuf = null;
for (let f = 0; f < totalFrames; f++) {
  const t = f / FPS;
  const png = new Resvg(frameSVG(t), fontOpt).render().asPng();
  writeFileSync(join(dir, `f_${String(f).padStart(5, '0')}.png`), png);
  if (Math.abs(t - (TOTAL - 0.2)) < 1 / FPS) posterBuf = png; // poster from the CTA end
  if (f % 60 === 0) process.stdout.write(`  ${f}/${totalFrames}\r`);
}
if (posterBuf) writeFileSync(OUT_POSTER, posterBuf);
console.log(`\nEncoding MP4 …`);

// ── encode H.264 MP4 (Twitter/X-ready) ──
execFileSync(ffmpegPath, [
  '-y',
  '-framerate', String(FPS),
  '-i', join(dir, 'f_%05d.png'),
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-profile:v', 'high',
  '-crf', '18',
  '-preset', 'medium',
  '-movflags', '+faststart',
  OUT_MP4,
], { stdio: ['ignore', 'inherit', 'inherit'] });

rmSync(dir, { recursive: true, force: true });
console.log(`\n✓ ${OUT_MP4}`);
console.log(`✓ ${OUT_POSTER}`);
