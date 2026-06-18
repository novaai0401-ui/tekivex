Real-time data is deceptively hard in React. The transport part — opening a WebSocket, subscribing to Server-Sent Events — is a few lines of code. The hard part is everything downstream: keeping the connection alive across flaky networks, mapping a firehose of messages into React state without triggering a re-render on every byte, and making sure a burst of 500 updates in a second does not lock up the main thread. Most teams discover these problems only after the happy-path demo works and the production feed starts misbehaving.

This article shows how to wire real-time streams into a React UI with [DataFlow](/product/dataflow), Tekivex's streaming engine for the browser. We will connect both WebSocket and SSE sources, handle the connection lifecycle with automatic reconnection, map an incoming stream onto React state cleanly, and render high-frequency updates efficiently using batching and refs so the UI stays smooth under load.

DataFlow is currently in beta. The APIs below are illustrative of how the engine is designed to be used; the core idea throughout is to decouple the *rate at which data arrives* from the *rate at which React renders*.

## Connecting a WebSocket or SSE source

DataFlow models a source as a long-lived object you create once and subscribe to. Both transports expose the same subscription surface, so the rest of your code does not need to know whether bytes are arriving over a socket or an event stream.

```ts
import { createWebSocketSource, createSSESource } from '@tekivex/dataflow';

// WebSocket: bidirectional, good for high-frequency two-way feeds
const quotes = createWebSocketSource<Quote>({
  url: 'wss://feed.example.com/quotes',
  parse: (raw) => JSON.parse(raw) as Quote,
  protocols: ['v2.quotes'],
});

// SSE: unidirectional server push, simpler and HTTP-friendly
const events = createSSESource<SystemEvent>({
  url: '/api/events',
  parse: (raw) => JSON.parse(raw) as SystemEvent,
  withCredentials: true,
});
```

The `parse` function runs once per message, off your component tree, and is the right place to validate or reshape payloads before they ever touch React. If `parse` throws, DataFlow routes the error to the source's error channel rather than crashing the subscriber.

Choosing between the two transports usually comes down to direction and infrastructure:

| Concern | WebSocket | Server-Sent Events |
| --- | --- | --- |
| Direction | Bidirectional | Server to client only |
| Protocol | `ws://` / `wss://` upgrade | Plain HTTP |
| Auto-reconnect | Manual (DataFlow adds it) | Built into the browser, plus DataFlow's backoff |
| Binary frames | Yes | Text only |
| Proxy / CDN friendliness | Sometimes awkward | Usually transparent |

If you only push from the server and want maximum compatibility with proxies and corporate firewalls, SSE is the lower-friction choice. If you need to send messages back on the same channel or carry binary frames, use WebSocket.

## Connection lifecycle and auto-reconnect

A naive socket reconnect loop is the source of a surprising number of production incidents: it hammers the server during an outage, double-subscribes after a flap, or silently dies and never recovers. DataFlow treats the lifecycle as a first-class state machine — `connecting`, `open`, `reconnecting`, `closed` — and exposes it so the UI can reflect connection health honestly.

```ts
const quotes = createWebSocketSource<Quote>({
  url: 'wss://feed.example.com/quotes',
  parse: (raw) => JSON.parse(raw) as Quote,
  reconnect: {
    maxRetries: Infinity,
    backoff: 'exponential', // 500ms, 1s, 2s, 4s ... capped
    maxDelay: 30_000,
    jitter: true,           // spread reconnects across clients
  },
});

quotes.on('status', (status) => {
  console.log('connection is now', status); // 'reconnecting' etc.
});
```

Two details matter here. Exponential backoff with **jitter** prevents the thundering-herd problem where every client reconnects in lockstep the instant a server recovers and immediately knocks it over again. And because reconnection is internal, your React subscription does not need to be torn down and rebuilt — DataFlow re-establishes the transport underneath a stable subscription, so you keep receiving messages once the link is restored without re-running effect cleanup.

## Mapping a stream onto React state

The connection between a DataFlow source and React is a hook. The important design decision is what the hook gives you: not "the latest message" raw, but a *projection* of the stream that you control. You decide whether you want the most recent value, a bounded window of recent values, or an aggregate.

```tsx
import { useStream } from '@tekivex/dataflow/react';

function QuotePanel() {
  // Keep only the latest value per symbol, projected into a map.
  const bySymbol = useStream(quotes, {
    select: (state, quote) => ({ ...state, [quote.symbol]: quote }),
    initial: {} as Record<string, Quote>,
  });

  return (
    <ul>
      {Object.values(bySymbol).map((q) => (
        <li key={q.symbol}>{q.symbol}: {q.price.toFixed(2)}</li>
      ))}
    </ul>
  );
}
```

The `select` reducer folds each incoming message into a derived state, much like a streaming `reduce`. This keeps unbounded data bounded: a feed that emits millions of ticks over a session still only ever holds one value per symbol in memory. If you instead want a rolling buffer — say, the last 200 events for a log view — return a sliced array from the reducer.

## Rendering high-frequency updates without re-render storms

This is where most real-time React UIs fall over. If every message calls `setState`, a feed at 500 messages per second asks React to render 500 times per second. React cannot, and should not, do that — the human eye tops out around 60 frames per second, so 90% of those renders are invisible work that still costs you main-thread time.

DataFlow's answer is to **coalesce updates to the frame**. The hook accumulates incoming messages and flushes the projected state at most once per animation frame using `requestAnimationFrame`. Two hundred ticks that land between frames collapse into a single render carrying the final state.

```tsx
function HighFrequencyTape() {
  const tape = useStream(trades, {
    select: (rows, t) => [t, ...rows].slice(0, 100),
    initial: [] as Trade[],
    coalesce: 'frame', // flush at most once per rAF
  });

  return <Tape rows={tape} />;
}
```

For the very hottest paths — a price that animates inside a chart, a counter that updates faster than you would ever want to reconcile — you can bypass React's render cycle entirely and write through a ref:

```tsx
function LivePrice({ symbol }: { symbol: string }) {
  const elRef = useRef<HTMLSpanElement>(null);

  useStreamEffect(quotes, (quote) => {
    if (quote.symbol === symbol && elRef.current) {
      // Imperative DOM write — no setState, no reconciliation.
      elRef.current.textContent = quote.price.toFixed(2);
    }
  });

  return <span ref={elRef} />;
}
```

This is the same technique high-performance grids use: let the value change in the DOM without asking the component tree to re-render. Reserve `useStream` with `setState` for structural changes (rows added or removed) and use the ref pattern for in-place value updates. When you need both — a high-volume grid fed by a live source — DataFlow pairs naturally with [GridStorm](/product/gridstorm), which addresses cell updates by row id so an off-screen change costs almost nothing.

## Cleaning up and avoiding leaks

Every subscription must be disposed when the component unmounts. The hooks handle this for you, but if you subscribe imperatively, return the unsubscribe function from your effect:

```tsx
useEffect(() => {
  const sub = quotes.subscribe((q) => { /* ... */ });
  return () => sub.unsubscribe();
}, []);
```

A source created at module scope (as in the examples above) is shared across all components that subscribe to it — DataFlow reference-counts subscribers and keeps a single transport open, rather than opening one socket per component. This is usually what you want for a global feed.

## When to use DataFlow for streaming

Reach for this approach when your UI consumes a *continuous* feed rather than discrete request/response calls, when update frequency is high enough that naive `setState` causes jank, or when you need a uniform way to handle WebSocket and SSE sources behind one API. If you are simply polling an endpoint every few seconds, plain `fetch` in an effect is fine and DataFlow is overkill.

The mental model worth carrying away: a stream's arrival rate and your render rate are two different numbers, and your job is to bridge them deliberately. Parse off the tree, coalesce to the frame, and drop down to refs for the hottest values. From there you can layer on the engine's other capabilities — see [backpressure and time-travel replay](/use-cases/dataflow-backpressure-time-travel-replay) for surviving genuine overload, and [anomaly detection](/use-cases/dataflow-anomaly-detection-streams) for reacting to the data itself. The full feature set lives on the [DataFlow product page](/product/dataflow), and you can browse related patterns in the [use-cases hub](/use-cases).
