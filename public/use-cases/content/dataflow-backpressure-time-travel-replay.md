There is a moment every team building a real-time UI eventually hits: the feed speeds up faster than the screen can keep up. A market opens, a sensor fleet comes online, a log stream spikes during an incident — and suddenly the browser is receiving more events per second than it can possibly render. Frames drop, input lags, memory climbs as a queue of unprocessed messages backs up. The data source does not slow down to wait for your UI; it is your job to manage the mismatch.

This article covers two related capabilities in [DataFlow](/product/dataflow) that address exactly this. The first is **backpressure** — strategies for handling more events than you can consume. The second is **time-travel replay** — recording the event stream so you can rewind, scrub, and replay state, which turns an ephemeral firehose into something you can debug and demo. Both rest on the same foundation: DataFlow keeps an explicit model of the stream rather than letting messages flow straight into React.

DataFlow is in beta; the APIs shown are illustrative of the engine's design. The principles, however, are transport-agnostic and apply to any high-frequency feed.

## Why high-frequency streams overwhelm UIs

The core problem is a rate mismatch between three clocks. The source emits at its own rate — potentially thousands of messages per second. React can usefully render about 60 times per second. And the human watching the screen can perceive far fewer distinct states than that. When you connect the source directly to `setState`, you implicitly ask React to render at the source's rate, which it cannot sustain.

Worse, the work compounds. Each unhandled message sits in memory. Each render that does happen competes with the next batch of messages for the main thread. The UI does not degrade gracefully — it falls off a cliff once the input rate crosses what the render pipeline can absorb. Backpressure is the discipline of deciding, *on purpose*, which data to keep and which to discard before it reaches React.

## Backpressure strategies

DataFlow lets you attach a backpressure policy to a source or a subscription. The policy governs what happens when messages arrive faster than the downstream consumer can flush them. Four strategies cover almost every real case:

- **throttle** — emit at most once per interval; ignore everything in between except the most recent. Best for values where only the latest matters (a price, a temperature, a progress percentage).
- **sample** — on a fixed timer, emit whatever the current value is. Similar to throttle but timer-driven rather than event-driven, giving a steady cadence regardless of input rate.
- **buffer** — collect messages into batches and flush the batch periodically. Best when every event matters and you process them in bulk (appending log lines, inserting grid rows).
- **drop-oldest** — keep a bounded queue; when it fills, evict the oldest entry to make room. Bounds memory while preferring fresh data.

```ts
import { createWebSocketSource, backpressure } from '@tekivex/dataflow';

const ticks = createWebSocketSource<Tick>({
  url: 'wss://feed.example.com/ticks',
  parse: (raw) => JSON.parse(raw) as Tick,
  backpressure: backpressure.throttle({ interval: 16 }), // ~one per frame
});

// A bounded buffer for a log view: keep order, cap memory.
const logs = createSSESource<LogLine>({
  url: '/api/logs',
  parse: (raw) => JSON.parse(raw) as LogLine,
  backpressure: backpressure.buffer({ flushEvery: 100, maxSize: 5000 }),
});
```

The right choice depends on whether you care about *every* event or only the *latest* one:

| Strategy | Keeps every event? | Memory | Best for |
| --- | --- | --- | --- |
| throttle | No | O(1) | Latest-value displays (price, gauge) |
| sample | No | O(1) | Steady-cadence readouts |
| buffer | Yes (until flush) | O(batch) | Logs, append-only feeds |
| drop-oldest | No (bounded loss) | O(capacity) | Fresh-data-wins under sustained overload |

A useful default for visual UIs is `throttle` at roughly one emit per animation frame (~16ms). The user cannot perceive faster updates anyway, so dropping intermediate values is free from their perspective and saves the render entirely. Reserve `buffer` for data where losing an event would be incorrect, not just cosmetic.

```ts
// Combine: parse off-thread, throttle to frame, project to state.
const view = ticks
  .pipe(backpressure.dropOldest({ capacity: 1000 }))
  .pipe(backpressure.throttle({ interval: 16 }));
```

## Time-travel replay: recording the stream

Because DataFlow already maintains an explicit model of the stream, it can also *record* it. The recorder captures each event with a timestamp into an in-memory (or persisted) event log. Once you have the log, the present state of your UI is no longer the only state you can show — you can reconstruct any earlier state by replaying the log up to a chosen point in time.

```ts
import { createRecorder } from '@tekivex/dataflow';

const recorder = createRecorder(ticks, {
  maxEvents: 50_000,      // ring buffer; oldest events roll off
  captureTimestamps: true,
});

recorder.start();
// ... later ...
const log = recorder.export(); // serializable array of timestamped events
```

The log is just data — timestamped events in order. That makes it portable. You can serialize it, attach it to a bug report, or ship it to a teammate who can replay the exact sequence that caused a problem, without needing access to the live feed.

## Rewinding and scrubbing state

Replay is most powerful when it is interactive. DataFlow's player takes a recorded log and the same reducer you use for live state, then lets you move a playhead through time. Scrubbing the playhead recomputes state by folding the log from the start up to that timestamp.

```tsx
import { useReplay } from '@tekivex/dataflow/react';

function ReplayPanel({ log }: { log: EventLog<Tick> }) {
  const { state, playhead, duration, seek, play, pause, rate } = useReplay(log, {
    select: (acc, t) => ({ ...acc, [t.symbol]: t.price }),
    initial: {} as Record<string, number>,
  });

  return (
    <div>
      <PriceTable prices={state} />
      <input
        type="range"
        min={0}
        max={duration}
        value={playhead}
        onChange={(e) => seek(Number(e.target.value))}
      />
      <button onClick={() => play()}>Play</button>
      <button onClick={() => pause()}>Pause</button>
      <button onClick={() => rate(4)}>4x</button>
    </div>
  );
}
```

Note that the replay reducer is the *same kind of `select` function* you use for live streaming. This is the key design property: live and replayed data flow through identical projection logic, so what you see during replay is genuinely what the UI showed live — not an approximation rendered by a separate code path.

### Why this matters for debugging and demos

Real-time bugs are notoriously hard to reproduce. By the time you notice the glitch, the events that caused it are gone. A recorded log changes the economics entirely — you capture the session, then rewind to the exact tick where the anomaly appeared and step through it frame by frame. The bug becomes deterministic.

For demos and tests, replay removes the dependency on a live source. You record a representative session once, commit the log as a fixture, and drive your UI from it in CI or on a conference stage where the real feed is unavailable or unpredictable. Combined with [anomaly detection](/use-cases/dataflow-anomaly-detection-streams), you can replay a known-bad sequence to verify your alerting fires exactly when it should.

## When to use backpressure and replay

Add backpressure the moment your input rate can exceed your render budget — which, for any genuinely real-time feed, is always. Pick `throttle` or `sample` for latest-value displays, `buffer` when every event counts, and `drop-oldest` to cap memory under sustained overload. Reach for recording and replay when you need to debug intermittent real-time behavior, ship reproducible bug reports, or drive demos and tests from a fixed session rather than a live one.

The unifying idea is that DataFlow never treats the stream as something that flows straight through to the DOM. It models the stream — which is what lets you slow it down when it is too fast, and rewind it when you need to look again. For the upstream connection patterns these build on, see [real-time streaming in React](/use-cases/dataflow-realtime-streaming-react); the full capability set is on the [DataFlow product page](/product/dataflow), with more patterns in the [use-cases hub](/use-cases).
