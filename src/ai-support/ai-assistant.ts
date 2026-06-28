/**
 * Tekivex AI Assistant — Zero-API, client-side Q&A engine
 *
 * Uses TF-IDF scoring + keyword overlap + intent classification
 * to match user questions to the knowledge base without any API calls.
 */

import { KNOWLEDGE_BASE, type KbEntry, type Category } from './knowledge-base';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface MatchResult {
  entry: KbEntry;
  score: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface AssistantResponse {
  answer: string;
  category: Category;
  confidence: 'high' | 'medium' | 'low';
  relatedQuestions: string[];
  entryId: string;
}

// ─────────────────────────────────────────────
// TEXT UTILITIES
// ─────────────────────────────────────────────

/** Tokenize text into lowercase words, removing punctuation */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/** Simple stop words to ignore in TF-IDF scoring */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up',
  'about', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'and', 'but', 'or', 'nor', 'so', 'yet', 'both',
  'either', 'neither', 'not', 'only', 'same', 'than', 'too', 'very',
  'just', 'how', 'what', 'when', 'where', 'who', 'which', 'that',
  'this', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our',
  'you', 'your', 'he', 'she', 'it', 'they', 'them', 'their', 'its',
  'tell', 'me', 'please', 'help', 'know', 'show', 'give', 'find',
  'want', 'use', 'get', 'make', 'work', 'go', 'see', 'look',
]);

function getSignificantTokens(text: string): string[] {
  return tokenize(text).filter((t) => !STOP_WORDS.has(t) && t.length > 2);
}

// ─────────────────────────────────────────────
// TF-IDF INDEX
// ─────────────────────────────────────────────

interface EntryDoc {
  id: string;
  tokens: string[];
  tf: Map<string, number>;
}

let _index: EntryDoc[] | null = null;
let _idf: Map<string, number> | null = null;

function buildIndex(): void {
  const docs: EntryDoc[] = KNOWLEDGE_BASE.map((entry) => {
    const text = [
      ...entry.questions,
      entry.answer,
      ...entry.tags,
      entry.category,
    ].join(' ');
    const tokens = getSignificantTokens(text);
    const tf = new Map<string, number>();
    for (const t of tokens) {
      tf.set(t, (tf.get(t) ?? 0) + 1);
    }
    // Normalize TF
    for (const [k, v] of tf) {
      tf.set(k, v / tokens.length);
    }
    return { id: entry.id, tokens, tf };
  });

  // Compute IDF
  const N = docs.length;
  const df = new Map<string, number>();
  for (const doc of docs) {
    const seen = new Set(doc.tokens);
    for (const t of seen) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  const idf = new Map<string, number>();
  for (const [term, count] of df) {
    idf.set(term, Math.log(N / count) + 1);
  }

  _index = docs;
  _idf = idf;
}

function getIndex(): { docs: EntryDoc[]; idf: Map<string, number> } {
  if (!_index || !_idf) buildIndex();
  return { docs: _index!, idf: _idf! };
}

// ─────────────────────────────────────────────
// SCORING
// ─────────────────────────────────────────────

/** Compute cosine similarity between query tokens and a document */
function scoreTfIdf(queryTokens: string[], doc: EntryDoc, idf: Map<string, number>): number {
  let score = 0;
  for (const t of queryTokens) {
    const tf = doc.tf.get(t) ?? 0;
    const idfVal = idf.get(t) ?? 0;
    score += tf * idfVal;
  }
  return score;
}

/** Exact / partial question phrase match bonus */
function scoreQuestionMatch(query: string, entry: KbEntry): number {
  const q = query.toLowerCase().trim();
  let best = 0;
  for (const question of entry.questions) {
    const qLower = question.toLowerCase();
    if (qLower === q) { best = Math.max(best, 10); continue; }
    if (qLower.includes(q) || q.includes(qLower)) { best = Math.max(best, 5); continue; }

    // Word overlap
    const qWords = new Set(getSignificantTokens(q));
    const eWords = new Set(getSignificantTokens(qLower));
    const intersection = [...qWords].filter((w) => eWords.has(w)).length;
    const union = new Set([...qWords, ...eWords]).size;
    if (union > 0) best = Math.max(best, 3 * (intersection / union));
  }
  return best;
}

/** Tag keyword bonus */
function scoreTagMatch(queryTokens: string[], entry: KbEntry): number {
  const tagTokens = new Set(entry.tags.map((t) => t.toLowerCase()));
  let hits = 0;
  for (const t of queryTokens) {
    if (tagTokens.has(t)) hits++;
  }
  return hits * 0.8;
}

/** Category intent detection — boost entries that match detected category intent */
function detectCategoryIntent(query: string): Category | null {
  const q = query.toLowerCase();
  if (/gridstorm|data grid|react grid|table component/.test(q)) return 'gridstorm';
  if (/tekivex ui|component library|components|accessible|wcag|a11y/.test(q)) return 'tekivex-ui';
  if (/quantum vault|post-quantum|post quantum|token|ml-dsa|xchacha|cryptograph/.test(q)) return 'quantum-vault';
  if (/pric|cost|free|licens|money|pay|subscri/.test(q)) return 'pricing';
  if (/start|begin|install|setup|quickstart|new to/.test(q)) return 'getting-started';
  if (/error|broken|not working|issue|bug|slow|fix|trouble/.test(q)) return 'troubleshooting';
  return null;
}

// ─────────────────────────────────────────────
// MAIN SEARCH
// ─────────────────────────────────────────────

export function findBestMatch(query: string): MatchResult | null {
  if (!query.trim()) return null;

  const { docs, idf } = getIndex();
  const queryTokens = getSignificantTokens(query);
  const detectedCategory = detectCategoryIntent(query);

  const scored: Array<{ entry: KbEntry; score: number }> = KNOWLEDGE_BASE.map((entry, i) => {
    const doc = docs[i]!;
    let score = 0;
    score += scoreTfIdf(queryTokens, doc, idf) * 1.5;
    score += scoreQuestionMatch(query, entry);
    score += scoreTagMatch(queryTokens, entry);

    // Category intent boost
    if (detectedCategory && entry.category === detectedCategory) {
      score += 1.5;
    }

    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best || best.score < 0.05) return null;

  const confidence: MatchResult['confidence'] =
    best.score > 5 ? 'high' :
    best.score > 1.5 ? 'medium' :
    'low';

  return { entry: best.entry, score: best.score, confidence };
}

export function findTopMatches(query: string, n = 3): MatchResult[] {
  if (!query.trim()) return [];

  const { docs, idf } = getIndex();
  const queryTokens = getSignificantTokens(query);
  const detectedCategory = detectCategoryIntent(query);

  const scored: Array<{ entry: KbEntry; score: number }> = KNOWLEDGE_BASE.map((entry, i) => {
    const doc = docs[i]!;
    let score = 0;
    score += scoreTfIdf(queryTokens, doc, idf) * 1.5;
    score += scoreQuestionMatch(query, entry);
    score += scoreTagMatch(queryTokens, entry);
    if (detectedCategory && entry.category === detectedCategory) score += 1.5;
    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((s) => ({
      entry: s.entry,
      score: s.score,
      confidence: (s.score > 5 ? 'high' : s.score > 1.5 ? 'medium' : 'low') as MatchResult['confidence'],
    }));
}

// ─────────────────────────────────────────────
// RELATED QUESTIONS
// ─────────────────────────────────────────────

function getRelatedQuestions(entry: KbEntry, count = 3): string[] {
  // Find entries in the same category, exclude current
  const sameCategory = KNOWLEDGE_BASE.filter(
    (e) => e.id !== entry.id && (e.category === entry.category || e.tags.some((t) => entry.tags.includes(t)))
  );

  // Pick `count` varied questions
  const picked: string[] = [];
  for (const e of sameCategory) {
    if (picked.length >= count) break;
    const q = e.questions[0];
    if (q) picked.push(q);
  }
  return picked;
}

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────

export function ask(query: string): AssistantResponse {
  const result = findBestMatch(query);

  if (!result) {
    return {
      answer: `I couldn't find a specific answer to your question. Here's how to get help:

- 📖 **Documentation:** [gridstorm.tekivex.com/#/docs](https://gridstorm.tekivex.com/#/docs)
- 🐛 **Report an Issue:** [github.com/novaai0401-ui/tekivex-issue-report/issues](https://github.com/novaai0401-ui/tekivex-issue-report/issues)
- 💼 **Enterprise:** enterprise@tekivex.com

Try rephrasing your question, or ask about:
- "What is GridStorm?"
- "How do I install GridStorm?"
- "What products does Tekivex offer?"`,
      category: 'general',
      confidence: 'low',
      relatedQuestions: [
        'What is GridStorm?',
        'How do I install GridStorm?',
        'What products does Tekivex offer?',
      ],
      entryId: 'fallback',
    };
  }

  return {
    answer: result.entry.answer,
    category: result.entry.category,
    confidence: result.confidence,
    relatedQuestions: getRelatedQuestions(result.entry),
    entryId: result.entry.id,
  };
}
