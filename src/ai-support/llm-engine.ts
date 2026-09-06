/**
 * Tekivex LLM Engine — Llama 3.2 in the Browser
 *
 * Wraps @mlc-ai/web-llm to run Llama 3.2 locally via WebGPU.
 * - Zero server, zero API key, zero cost
 * - Model downloaded once, cached in browser IndexedDB forever
 * - Auto-restores from cache on next visit — no re-download prompt
 * - Falls back gracefully when WebGPU is unavailable
 * - RAG: top KB entries injected into system prompt per query
 */

// web-llm is dynamically imported so it doesn't bloat the initial bundle.
// It loads only when the user enables AI (or auto-restores from cache).
import type { MLCEngine, InitProgressReport } from '@mlc-ai/web-llm';
import { findTopMatches } from './ai-assistant';
import { KNOWLEDGE_BASE } from './knowledge-base';

// ─────────────────────────────────────────────
// MODEL OPTIONS
// ─────────────────────────────────────────────

export interface ModelOption {
  id: string;
  label: string;
  sizeMb: number;
  description: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 · 1B',
    sizeMb: 870,
    description: '⚡ Fastest · 870 MB · Recommended',
  },
  {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 · 3B',
    sizeMb: 1820,
    description: '🧠 Smarter · 1.8 GB · Slower',
  },
];

// 1B is the default — half the size, ~2× faster, sufficient for Q&A
export const DEFAULT_MODEL_ID = MODEL_OPTIONS[0]!.id;

// ─────────────────────────────────────────────
// PERSISTENT CACHE FLAGS  (localStorage)
// After the model downloads successfully we set a flag so future visits
// know the model is already in IndexedDB and can auto-load silently.
// ─────────────────────────────────────────────

const LS_CACHE_PREFIX   = 'tekivex_llm_cached_';
const LS_LAST_MODEL_KEY = 'tekivex_llm_model_id';

export function isModelCachedLocally(modelId: string): boolean {
  try { return localStorage.getItem(LS_CACHE_PREFIX + modelId) === '1'; }
  catch { return false; }
}

export function markModelCached(modelId: string): void {
  try {
    localStorage.setItem(LS_CACHE_PREFIX + modelId, '1');
    localStorage.setItem(LS_LAST_MODEL_KEY, modelId);
  } catch { /* storage quota exceeded — ignore */ }
}

export function getLastUsedModelId(): string {
  try { return localStorage.getItem(LS_LAST_MODEL_KEY) ?? DEFAULT_MODEL_ID; }
  catch { return DEFAULT_MODEL_ID; }
}

/** True if ANY model variant is already cached locally */
export function anyModelCached(): boolean {
  return MODEL_OPTIONS.some((m) => isModelCachedLocally(m.id));
}

// ─────────────────────────────────────────────
// WEBGPU DETECTION
// ─────────────────────────────────────────────

export async function isWebGpuSupported(): Promise<boolean> {
  try {
    if (!('gpu' in navigator)) return false;
    const adapter = await (navigator as any).gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// PROGRESS CALLBACK TYPE
// ─────────────────────────────────────────────

export interface LoadProgress {
  /** 0–100 */
  percent: number;
  text: string;
  phase: 'fetching' | 'loading' | 'ready';
  /** True when restoring from browser cache (no network download) */
  fromCache?: boolean;
}

// ─────────────────────────────────────────────
// SINGLETON ENGINE
// ─────────────────────────────────────────────

let _engine: MLCEngine | null = null;
let _loadedModelId: string | null = null;
let _loading = false;

export async function loadModel(
  modelId: string,
  onProgress: (p: LoadProgress) => void,
): Promise<MLCEngine> {
  // Already loaded with the same model — instant return
  if (_engine && _loadedModelId === modelId) {
    onProgress({ percent: 100, text: 'Llama 3.2 ready!', phase: 'ready', fromCache: true });
    return _engine;
  }

  // Prevent concurrent loads — wait for the in-flight load to finish
  if (_loading) {
    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (!_loading) { clearInterval(check); resolve(); }
      }, 200);
    });
    if (_engine && _loadedModelId === modelId) return _engine;
  }

  const fromCache = isModelCachedLocally(modelId);
  _loading = true;

  try {
    onProgress({
      percent: 0,
      text: fromCache ? 'Restoring from local cache…' : 'Initializing…',
      phase: 'fetching',
      fromCache,
    });

    // Dynamic import — only pulled when AI is first used
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');

    _engine = await CreateMLCEngine(modelId, {
      initProgressCallback: (report: InitProgressReport) => {
        const pct = Math.round((report.progress ?? 0) * 100);
        const phase: LoadProgress['phase'] =
          pct < 95 ? 'fetching' : pct < 100 ? 'loading' : 'ready';
        onProgress({
          percent: pct,
          text: report.text ?? (fromCache ? 'Loading from cache…' : 'Downloading model…'),
          phase,
          fromCache,
        });
      },
    });

    _loadedModelId = modelId;
    // Persist cache flag so next visit auto-loads silently
    markModelCached(modelId);
    onProgress({ percent: 100, text: 'Llama 3.2 ready!', phase: 'ready', fromCache });
    return _engine;
  } finally {
    _loading = false;
  }
}

export function getLoadedEngine(): MLCEngine | null { return _engine; }

export function isModelLoaded(modelId?: string): boolean {
  if (!_engine) return false;
  if (modelId) return _loadedModelId === modelId;
  return true;
}

export function unloadModel(): void {
  _engine = null;
  _loadedModelId = null;
}

// ─────────────────────────────────────────────
// SYSTEM PROMPT BUILDER (RAG)
// Injects the top KB entries most relevant to the current query.
// Called fresh for every message so the context always matches.
// ─────────────────────────────────────────────

function buildSystemPrompt(userQuery: string): string {
  const matches = findTopMatches(userQuery, 4);

  let contextBlock = '';
  if (matches.length > 0) {
    contextBlock = '\n\n## Relevant Product Knowledge\n';
    matches.forEach(({ entry }, i) => {
      contextBlock += `\n### [${i + 1}] ${entry.questions[0]}\n${entry.answer}\n`;
    });
  }

  const productSummary = `
## Tekivex Products
${KNOWLEDGE_BASE
  .filter((e) => e.id.endsWith('-what-is') || e.id === 'what-is-tekivex')
  .map((e) => `- **${e.questions[0]?.replace('What is ', '').replace('Tell me about ', '')}**: ${e.answer.split('\n')[0]}`)
  .join('\n')}
`;

  return `You are the **Tekivex AI Support Assistant** — a helpful, knowledgeable, and friendly support bot for Tekivex software products.

## Your Role
- Answer questions about all six Tekivex products:
  - Libraries (published on npm): GridStorm, Tekivex UI, Quantum Vault
  - Hosted web apps (free, nothing to install — you open the URL and use them): Pyntra, Analytics Studio, DataFlow
- Help with installation, configuration, troubleshooting, pricing, and comparisons
- For the three hosted apps, never suggest installing or importing anything — direct the user to open the live app at its URL
- Give concise, accurate, developer-friendly answers
- Use markdown: **bold** for emphasis, \`code\` for snippets, bullet lists for features
- If unsure, say so and point to GitHub issues or docs

## Important Facts
- All Tekivex products are free forever, no per-developer fees
- Issues: https://github.com/novaai0401-ui/tekivex-issue-report/issues
- GridStorm demo: https://www.tekivex.com/gridstorm
- Tekivex UI demo: https://www.tekivex.com/ui
- Pyntra (hosted studio for cards, photos, video & PDFs — open and use it): https://pyntra.tekivex.com
- Analytics Studio (hosted BI app — open and use it): https://www.tekivex.com/analytics
- DataFlow (hosted real-time streaming dashboard — open and use it): https://www.tekivex.com/dataflow/stocks
- Docs: https://www.tekivex.com/gridstorm/#/docs
- Enterprise: enterprise@tekivex.com
${productSummary}${contextBlock}

Keep answers focused and practical. Respond in plain markdown. Be concise.`;
}

// ─────────────────────────────────────────────
// STREAMING INFERENCE
// ─────────────────────────────────────────────

export interface StreamCallbacks {
  onToken: (token: string, fullText: string) => void;
  onDone:  (fullText: string) => void;
  onError: (err: Error) => void;
}

export async function askLlama(
  query: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  callbacks: StreamCallbacks,
): Promise<void> {
  const engine = getLoadedEngine();
  if (!engine) { callbacks.onError(new Error('Model not loaded')); return; }

  const systemPrompt = buildSystemPrompt(query);

  // Send up to last 10 turns so Llama maintains context across the conversation
  const recentHistory = history.slice(-10);
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: query },
  ];

  try {
    const stream = await engine.chat.completions.create({
      messages,
      stream: true,
      temperature: 0.5,
      max_tokens: 400,
      top_p: 0.85,
      frequency_penalty: 0.1,
    });

    let fullText = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? '';
      if (delta) {
        fullText += delta;
        callbacks.onToken(delta, fullText);
      }
    }
    callbacks.onDone(fullText);
  } catch (err) {
    callbacks.onError(err instanceof Error ? err : new Error(String(err)));
  }
}
