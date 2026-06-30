/**
 * Tekivex AI Support Chat Widget — Llama 3.2 Edition
 *
 * Key guarantees:
 *  ✅ Chat history persists in localStorage — survives page reload
 *  ✅ Minimize/maximize never loses messages or model state
 *  ✅ Once Llama is downloaded, it auto-restores from cache silently
 *  ✅ "Enable AI" prompt never shown again after first download
 *  ✅ Offline mode — model runs 100% locally after first download
 *  ✅ RAG — top KB entries injected per query for accurate answers
 *  ✅ Full conversation history sent to Llama for contextual follow-ups
 *  ✅ TF-IDF instant fallback when WebGPU unavailable
 */

import React from 'react';
import {
  isWebGpuSupported,
  loadModel,
  askLlama,
  isModelLoaded,
  isModelCachedLocally,
  anyModelCached,
  getLastUsedModelId,
  MODEL_OPTIONS,
  DEFAULT_MODEL_ID,
  type LoadProgress,
  type ModelOption,
} from './llm-engine';
import { ask } from './ai-assistant';
import { STARTER_QUESTIONS, CATEGORY_META } from './knowledge-base';

// ─────────────────────────────────────────────
// PERSISTENCE KEYS
// ─────────────────────────────────────────────

const LS_MESSAGES_KEY  = 'tekivex_chat_v2';   // bump version to reset old format
const LS_OPEN_KEY      = 'tekivex_chat_open';  // remember open/closed state
const MAX_SAVED_MSGS   = 60;                   // keep last 60 messages in storage

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type ModelState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'unsupported'; reason: string }
  | { status: 'loading'; progress: LoadProgress }
  | { status: 'ready'; modelId: string }
  | { status: 'error'; message: string };

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  usedLlm?: boolean;
  category?: string;
  timestamp: string; // ISO string — safe for JSON serialization
}

// ─────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(LS_MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    // Filter out any lingering streaming messages from a crashed session
    return parsed.filter((m) => !m.streaming);
  } catch {
    return [];
  }
}

function saveMessages(msgs: ChatMessage[]): void {
  try {
    const toSave = msgs
      .filter((m) => !m.streaming)
      .slice(-MAX_SAVED_MSGS);
    localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(toSave));
  } catch { /* storage quota — ignore */ }
}

function loadOpenState(): boolean {
  try { return localStorage.getItem(LS_OPEN_KEY) === '1'; }
  catch { return false; }
}

function saveOpenState(open: boolean): void {
  try { localStorage.setItem(LS_OPEN_KEY, open ? '1' : '0'); }
  catch { /* ignore */ }
}

// ─────────────────────────────────────────────
// SIMPLE MARKDOWN RENDERER
// ─────────────────────────────────────────────

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let kc = 0;
  const key = () => String(kc++);

  function inline(line: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    let rest = line;
    let lk = 0;
    while (rest.length > 0) {
      const boldM = rest.match(/\*\*(.+?)\*\*/);
      const codeM = rest.match(/`([^`]+?)`/);
      const linkM = rest.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const candidates = [
        boldM ? { idx: boldM.index!, type: 'bold', m: boldM } : null,
        codeM ? { idx: codeM.index!, type: 'code', m: codeM } : null,
        linkM ? { idx: linkM.index!, type: 'link', m: linkM } : null,
      ].filter(Boolean) as { idx: number; type: string; m: RegExpMatchArray }[];
      if (!candidates.length) { parts.push(<React.Fragment key={lk++}>{rest}</React.Fragment>); break; }
      candidates.sort((a, b) => a.idx - b.idx);
      const first = candidates[0]!;
      if (first.idx > 0) parts.push(<React.Fragment key={lk++}>{rest.slice(0, first.idx)}</React.Fragment>);
      if (first.type === 'bold') {
        parts.push(<strong key={lk++}>{first.m[1]}</strong>);
        rest = rest.slice(first.idx + first.m[0].length);
      } else if (first.type === 'code') {
        parts.push(<code key={lk++} className="ai-inline-code">{first.m[1]}</code>);
        rest = rest.slice(first.idx + first.m[0].length);
      } else {
        parts.push(<a key={lk++} href={first.m[2]} target="_blank" rel="noopener noreferrer" className="ai-link">{first.m[1]}</a>);
        rest = rest.slice(first.idx + first.m[0].length);
      }
    }
    return parts;
  }

  while (i < lines.length) {
    const line = lines[i]!;
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code: string[] = []; i++;
      while (i < lines.length && !lines[i]!.startsWith('```')) { code.push(lines[i]!); i++; }
      elements.push(<div key={key()} className="ai-code-block">{lang && <div className="ai-code-lang">{lang}</div>}<pre><code>{code.join('\n')}</code></pre></div>);
      i++; continue;
    }
    if (line.startsWith('### ')) { elements.push(<h4 key={key()} className="ai-h4">{inline(line.slice(4))}</h4>); i++; continue; }
    if (line.startsWith('## '))  { elements.push(<h3 key={key()} className="ai-h3">{inline(line.slice(3))}</h3>); i++; continue; }
    if (line.startsWith('# '))   { elements.push(<h2 key={key()} className="ai-h2">{inline(line.slice(2))}</h2>); i++; continue; }
    if (/^[-*_]{3,}$/.test(line.trim())) { elements.push(<hr key={key()} className="ai-hr" />); i++; continue; }
    if (line.includes('|') && lines[i + 1]?.includes('---')) {
      const headers = line.split('|').map(s => s.trim()).filter(Boolean); i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.includes('|')) { rows.push(lines[i]!.split('|').map(s => s.trim()).filter(Boolean)); i++; }
      elements.push(<div key={key()} className="ai-table-wrapper"><table className="ai-table"><thead><tr>{headers.map((h, hi) => <th key={hi}>{inline(h)}</th>)}</tr></thead><tbody>{rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci}>{inline(c)}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    if (/^[-*•] /.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*•] /.test(lines[i]!)) { items.push(<li key={i}>{inline(lines[i]!.replace(/^[-*•] /, ''))}</li>); i++; }
      elements.push(<ul key={key()} className="ai-ul">{items}</ul>); continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i]!)) { items.push(<li key={i}>{inline(lines[i]!.replace(/^\d+\. /, ''))}</li>); i++; }
      elements.push(<ol key={key()} className="ai-ol">{items}</ol>); continue;
    }
    if (!line.trim()) { i++; continue; }
    elements.push(<p key={key()} className="ai-p">{inline(line)}</p>); i++;
  }
  return <>{elements}</>;
}

// ─────────────────────────────────────────────
// MODEL SELECTOR
// ─────────────────────────────────────────────

function ModelSelector({ selected, onChange }: { selected: string; onChange: (id: string) => void }) {
  return (
    <div className="ai-model-selector">
      {MODEL_OPTIONS.map((m: ModelOption) => (
        <button
          key={m.id}
          className={`ai-model-opt ${selected === m.id ? 'ai-model-opt--active' : ''}`}
          onClick={() => onChange(m.id)}
        >
          <div className="ai-model-opt-label">{m.label}</div>
          <div className="ai-model-opt-desc">{m.description}</div>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// LOAD PROGRESS BAR
// ─────────────────────────────────────────────

function LoadProgressBar({ progress }: { progress: LoadProgress }) {
  const isFromCache = progress.fromCache;
  return (
    <div className="ai-load-wrap">
      <div className="ai-load-icon">🦙</div>
      <div className="ai-load-label">
        {progress.phase === 'ready'
          ? 'Llama 3.2 ready!'
          : isFromCache
            ? 'Restoring from local cache…'
            : 'Downloading Llama 3.2…'}
      </div>
      <div className="ai-load-sub">{progress.text}</div>
      <div className="ai-load-bar-track">
        <div
          className={`ai-load-bar-fill ${progress.phase === 'ready' ? 'ai-load-bar-fill--done' : ''}`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <div className="ai-load-pct">{progress.percent}%</div>
      {!isFromCache && progress.phase === 'fetching' && (
        <div className="ai-load-note">
          Downloaded once · Cached in your browser · Works offline after
        </div>
      )}
      {isFromCache && progress.phase !== 'ready' && (
        <div className="ai-load-note">
          Loading from local cache · No internet required
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ENABLE AI PANEL  (shown only on FIRST-EVER load)
// ─────────────────────────────────────────────

function EnableAiPanel({
  selectedModel, onModelChange, onEnable, unsupportedReason,
}: {
  selectedModel: string;
  onModelChange: (id: string) => void;
  onEnable: () => void;
  unsupportedReason?: string;
}) {
  if (unsupportedReason) {
    return (
      <div className="ai-enable-panel">
        <div className="ai-enable-icon">⚠️</div>
        <div className="ai-enable-title">WebGPU not available</div>
        <div className="ai-enable-desc">{unsupportedReason}</div>
        <div className="ai-enable-fallback">Using fast TF-IDF matching — no model required.</div>
      </div>
    );
  }
  return (
    <div className="ai-enable-panel">
      <div className="ai-enable-icon">🦙</div>
      <div className="ai-enable-title">Run Llama 3.2 in your browser</div>
      <div className="ai-enable-desc">
        Powered by WebGPU · No server · No API key · Works offline after first download
      </div>
      <ModelSelector selected={selectedModel} onChange={onModelChange} />
      <button className="ai-enable-btn" onClick={onEnable}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Download &amp; Enable {MODEL_OPTIONS.find((m: ModelOption) => m.id === selectedModel)?.label ?? 'Model'}
      </button>
      <div className="ai-enable-note">One-time download · Cached forever · Ask now for instant answers</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────

function MessageBubble({ message, onRelatedClick }: {
  message: ChatMessage;
  onRelatedClick: (q: string) => void;
}) {
  const isUser = message.role === 'user';
  const catMeta = message.category ? CATEGORY_META[message.category as keyof typeof CATEGORY_META] : null;

  return (
    <div className={`ai-msg ai-msg--${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="ai-msg-avatar" aria-hidden="true">
          {message.usedLlm ? '🦙' : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM9 11a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm6 0a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1z"/>
            </svg>
          )}
        </div>
      )}
      <div className="ai-msg-body">
        {catMeta && !isUser && (
          <div className="ai-msg-category" style={{ color: catMeta.color }}>
            <span>{catMeta.emoji}</span>
            <span>{catMeta.label}</span>
            {message.usedLlm && <span className="ai-llm-badge">Llama 3.2</span>}
          </div>
        )}
        {message.usedLlm && !catMeta && !isUser && (
          <div className="ai-msg-category" style={{ color: '#6366f1' }}>
            <span>🦙</span>
            <span className="ai-llm-badge">Llama 3.2</span>
          </div>
        )}
        <div className="ai-msg-content">
          {isUser
            ? <p className="ai-p">{message.content}</p>
            : renderMarkdown(message.content)
          }
          {message.streaming && <span className="ai-cursor" aria-hidden="true">▊</span>}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ useLlm }: { useLlm: boolean }) {
  return (
    <div className="ai-msg ai-msg--assistant">
      <div className="ai-msg-avatar">{useLlm ? '🦙' : '🤖'}</div>
      <div className="ai-msg-body">
        <div className="ai-typing">
          <span className="ai-typing-dot" /><span className="ai-typing-dot" /><span className="ai-typing-dot" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN WIDGET
// ─────────────────────────────────────────────

export function AiChatWidget() {
  // ── Restore open state from localStorage ──────────────────────
  const [open, setOpen] = React.useState<boolean>(() => loadOpenState());

  // ── Restore messages from localStorage ────────────────────────
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => loadMessages());

  const [input, setInput]         = React.useState('');
  const [thinking, setThinking]   = React.useState(false);
  const [pulse, setPulse]         = React.useState(() => !anyModelCached());
  const [modelState, setModelState] = React.useState<ModelState>({ status: 'idle' });
  const [showPanel, setShowPanel] = React.useState(false);

  // ── Derive the best model to use ──────────────────────────────
  // Use last-used model if it's cached, otherwise use the default
  const [selectedModel, setSelectedModel] = React.useState<string>(() => {
    const lastId = getLastUsedModelId();
    return isModelCachedLocally(lastId) ? lastId : DEFAULT_MODEL_ID;
  });

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef       = React.useRef<HTMLTextAreaElement>(null);
  const chatId         = React.useId();

  // ── Persist messages to localStorage (debounced 400ms) ────────
  React.useEffect(() => {
    const t = setTimeout(() => saveMessages(messages), 400);
    return () => clearTimeout(t);
  }, [messages]);

  // ── Persist open/closed state ─────────────────────────────────
  React.useEffect(() => {
    saveOpenState(open);
    if (open) setPulse(false);
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  // ── Auto-scroll to bottom ─────────────────────────────────────
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // ── Greeting — only if no persisted messages ──────────────────
  React.useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: `Hi! 👋 I'm the **Tekivex AI Support Assistant**.

I can answer any question about our six products — the GridStorm, Tekivex UI, and Quantum Vault libraries, plus our hosted web apps Pyntra, Analytics Studio, and DataFlow.

${anyModelCached() ? '🦙 **Llama 3.2 is cached** in your browser — restoring AI engine…' : 'Tip: Enable **Llama 3.2** for conversational AI, or ask now for instant answers.'}`,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-restore model from cache when chat opens ─────────────
  // If the user previously downloaded the model, load it silently
  // without showing any panel. Works fully offline.
  React.useEffect(() => {
    if (!open) return;
    if (modelState.status !== 'idle') return;

    const cachedModelId = MODEL_OPTIONS.find((m) => isModelCachedLocally(m.id))?.id;
    if (!cachedModelId) return; // Never downloaded — wait for user to click

    // Auto-restore from cache — no UI panel, just quiet background loading
    setModelState({ status: 'loading', progress: { percent: 0, text: 'Restoring from local cache…', phase: 'fetching', fromCache: true } });

    loadModel(cachedModelId, (p) => {
      setModelState({ status: 'loading', progress: p });
    }).then(() => {
      setSelectedModel(cachedModelId);
      setModelState({ status: 'ready', modelId: cachedModelId });
    }).catch((err) => {
      // Cache may be corrupted — fall back silently to TF-IDF
      console.warn('[Tekivex AI] Cache restore failed, falling back to TF-IDF:', err);
      setModelState({ status: 'idle' });
    });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────
  // ENABLE AI (first-time download)
  // ─────────────────────────────────────────────
  const handleEnableAi = React.useCallback(async () => {
    setModelState({ status: 'checking' });
    const supported = await isWebGpuSupported();

    if (!supported) {
      setModelState({ status: 'unsupported', reason: 'Your browser does not support WebGPU. Try Chrome 113+ or Edge 113+ on desktop.' });
      setShowPanel(true);
      return;
    }

    setModelState({ status: 'loading', progress: { percent: 0, text: 'Starting download…', phase: 'fetching', fromCache: false } });
    setShowPanel(true);

    try {
      await loadModel(selectedModel, (p) => {
        setModelState({ status: 'loading', progress: p });
      });
      setModelState({ status: 'ready', modelId: selectedModel });
      setShowPanel(false);
      setMessages((prev) => [...prev, {
        id: `sys-${Date.now()}`,
        role: 'assistant',
        content: `🦙 **Llama 3.2 is ready!** The model is now cached in your browser — it will load instantly next time, even offline.`,
        usedLlm: true,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setModelState({ status: 'error', message: err instanceof Error ? err.message : 'Failed to load model' });
    }
  }, [selectedModel]);

  // ─────────────────────────────────────────────
  // SEND MESSAGE
  // ─────────────────────────────────────────────
  const sendMessage = React.useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    const llmReady = isModelLoaded();

    if (llmReady) {
      // ── LLM path: streaming with full conversation history ────
      // Build history from ALL persisted messages (not just current session)
      // so Llama maintains context across page reloads too
      const historyForLlm = messages
        .filter((m) => m.id !== 'greeting' && !m.id.startsWith('sys-') && !m.streaming)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', streaming: true, usedLlm: true, timestamp: new Date().toISOString() },
      ]);
      setThinking(false);

      await askLlama(trimmed, historyForLlm, {
        onToken: (_token, fullText) => {
          setMessages((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, content: fullText } : m)
          );
        },
        onDone: (fullText) => {
          setMessages((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, content: fullText, streaming: false } : m)
          );
        },
        onError: (err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `Sorry, something went wrong: ${err.message}`, streaming: false }
                : m
            )
          );
        },
      });
    } else {
      // ── TF-IDF path: instant fallback ─────────────────────────
      const delay = 60 + Math.random() * 120;
      setTimeout(() => {
        const resp = ask(trimmed);
        setThinking(false);
        setMessages((prev) => [...prev, {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: resp.answer,
          usedLlm: false,
          category: resp.category,
          timestamp: new Date().toISOString(),
        }]);
      }, delay);
    }
  }, [messages, thinking]);

  const handleSubmit  = (e: React.FormEvent)                     => { e.preventDefault(); sendMessage(input); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleClear = () => {
    setMessages([]);
    saveMessages([]);
    setShowPanel(false);
    setTimeout(() => setMessages([{
      id: 'greeting-' + Date.now(),
      role: 'assistant',
      content: `Hi! 👋 Conversation cleared. How can I help you today?`,
      timestamp: new Date().toISOString(),
    }]), 50);
  };

  // ─────────────────────────────────────────────
  // DERIVED STATE
  // ─────────────────────────────────────────────
  const llmReady         = modelState.status === 'ready';
  const llmLoading       = modelState.status === 'loading' || modelState.status === 'checking';
  const isAutoRestoring  = llmLoading && (modelState.status === 'loading') && modelState.progress.fromCache;
  const showStarters     = messages.filter(m => m.role === 'user').length === 0 && !showPanel;
  const neverDownloaded  = !anyModelCached();

  return (
    <>
      {/* ── Floating button ─────────────────────────────────── */}
      <button
        className={`ai-fab ${pulse ? 'ai-fab--pulse' : ''} ${open ? 'ai-fab--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close AI Support' : 'Open AI Support'}
        aria-expanded={open}
        aria-controls={chatId}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <>
            <span style={{ fontSize: 20 }}>🦙</span>
            <span className="ai-fab-label">AI Support</span>
          </>
        )}
      </button>

      {/* ── Chat panel — always mounted, CSS controls visibility ── */}
      <div
        id={chatId}
        className={`ai-chat-panel ${open ? 'ai-chat-panel--open' : ''}`}
        role="dialog"
        aria-label="Tekivex AI Support"
        aria-modal="true"
      >
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-info">
            <div className="ai-chat-avatar" style={{ fontSize: 18 }}>
              {llmReady ? '🦙' : '🤖'}
            </div>
            <div>
              <div className="ai-chat-title">Tekivex AI Support</div>
              <div className="ai-chat-subtitle">
                {llmReady ? (
                  <><span className="ai-status-dot ai-status-dot--llm" />Llama 3.2 · Running locally · Offline ready</>
                ) : isAutoRestoring ? (
                  <><span className="ai-status-dot ai-status-dot--loading" />Restoring from cache…</>
                ) : llmLoading ? (
                  <><span className="ai-status-dot ai-status-dot--loading" />Downloading Llama 3.2…</>
                ) : (
                  <><span className="ai-status-dot" />Instant Q&amp;A · {neverDownloaded ? 'Enable Llama 3.2 for AI' : 'AI cached · loading…'}</>
                )}
              </div>
            </div>
          </div>
          <div className="ai-chat-header-actions">
            {/* Show "Enable AI" button only if model was NEVER downloaded */}
            {!llmReady && !llmLoading && neverDownloaded && (
              <button className="ai-enable-mini-btn" onClick={() => { setShowPanel(v => !v); if (!showPanel) handleEnableAi(); }}>
                🦙 Enable AI
              </button>
            )}
            <button className="ai-icon-btn" onClick={handleClear} title="Clear conversation" aria-label="Clear">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
            </button>
            <button className="ai-icon-btn" onClick={() => setOpen(false)} title="Minimise" aria-label="Minimise chat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Auto-restore progress bar — shown as slim banner, not full overlay */}
        {isAutoRestoring && modelState.status === 'loading' && (
          <div className="ai-restore-banner">
            <div className="ai-restore-bar" style={{ width: `${modelState.progress.percent}%` }} />
            <span className="ai-restore-label">Restoring Llama 3.2 from cache ({modelState.progress.percent}%)</span>
          </div>
        )}

        {/* First-time download overlay */}
        {showPanel && !isAutoRestoring && (
          <div className="ai-panel-overlay">
            {(modelState.status === 'loading' || modelState.status === 'checking') && (
              <LoadProgressBar progress={
                modelState.status === 'loading'
                  ? modelState.progress
                  : { percent: 0, text: 'Checking WebGPU support…', phase: 'fetching' }
              } />
            )}
            {modelState.status === 'error' && (
              <div className="ai-load-wrap">
                <div className="ai-load-icon">❌</div>
                <div className="ai-load-label">Failed to load model</div>
                <div className="ai-load-sub">{modelState.message}</div>
                <button className="ai-enable-btn" onClick={handleEnableAi} style={{ marginTop: 12 }}>Retry</button>
                <button className="ai-dismiss-btn" onClick={() => setShowPanel(false)}>Continue with instant answers</button>
              </div>
            )}
            {modelState.status === 'unsupported' && (
              <EnableAiPanel
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                onEnable={handleEnableAi}
                unsupportedReason={modelState.reason}
              />
            )}
            {modelState.status === 'idle' && (
              <EnableAiPanel
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                onEnable={handleEnableAi}
              />
            )}
          </div>
        )}

        {/* Messages */}
        {!showPanel && (
          <div className="ai-chat-messages" aria-live="polite" aria-atomic="false">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onRelatedClick={sendMessage} />
            ))}
            {thinking && <TypingIndicator useLlm={llmReady} />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Starter questions */}
        {showStarters && !showPanel && (
          <div className="ai-starters">
            {STARTER_QUESTIONS.slice(0, 4).map((q) => (
              <button key={q} className="ai-starter-btn" onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        {!showPanel && (
          <form className="ai-chat-input-row" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={llmReady ? 'Ask Llama 3.2 anything…' : 'Ask anything about Tekivex…'}
              rows={1}
              aria-label="Type your question"
            />
            <button type="submit" className="ai-send-btn" disabled={!input.trim() || thinking} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        )}

        <div className="ai-chat-footer">
          {llmReady
            ? '🦙 Llama 3.2 · Offline ready · History saved · No data leaves your browser'
            : 'Tekivex AI · History saved · No data sent to any server'}
        </div>
      </div>
    </>
  );
}
