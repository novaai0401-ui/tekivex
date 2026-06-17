Streaming data is only useful if someone — or something — notices when it goes wrong. A latency metric that quietly triples, a sensor that flatlines, a transaction volume that spikes to ten times its normal level: these are the moments that matter, and they are buried in a torrent of normal-looking numbers flowing past faster than any human can watch. The job of anomaly detection is to surface the few events worth reacting to and stay quiet about the rest.

This article shows how to detect anomalies on live streams with [DataFlow](/product/dataflow): simple thresholds, rolling statistics like moving averages and z-scores, debouncing so alerts do not flood the UI, and wiring those alerts into React. The math stays approachable — every technique here is a few arithmetic operations per event — but we will keep it correct, because an anomaly detector that is subtly wrong is worse than none at all.

DataFlow is in beta and the APIs are illustrative. The detection logic, though, is plain statistics you could implement by hand; DataFlow's value is running it incrementally over a live stream and routing the results into your UI cleanly.

## Thresholds: the simplest detector

The most basic anomaly is a value crossing a fixed line. If CPU usage exceeds 90%, or a queue depth drops below zero, you want to know. Static thresholds are cheap, obvious, and easy to reason about — and they are the right tool when you genuinely know the bounds in advance.

```ts
import { createWebSocketSource, detect } from '@tekivex/dataflow';

const metrics = createWebSocketSource<Metric>({
  url: 'wss://telemetry.example.com',
  parse: (raw) => JSON.parse(raw) as Metric,
});

const cpuAlerts = metrics.pipe(
  detect.threshold({
    value: (m) => m.cpu,
    above: 90,          // fire when cpu > 90
    below: 0,           // ...or below 0 (impossible value => bad data)
  })
);
```

The limitation is also obvious: a fixed threshold knows nothing about context. A value of 80 might be perfectly normal at peak hours and deeply abnormal at 3am. For anything whose "normal" drifts over time, you need statistics that adapt to recent history.

## Rolling statistics: moving average and standard deviation

The standard adaptive approach is to compare each new value against the recent behavior of the stream itself. Two quantities do most of the work: the **moving average** (what is typical lately) and the **standard deviation** (how much it normally varies). Together they let you ask the real question — *is this value surprising given how this stream usually behaves?*

A z-score answers that precisely. For a value `x`, with rolling mean `μ` and rolling standard deviation `σ`:

```
z = (x − μ) / σ
```

A z-score of 0 means the value sits exactly at the average. A z-score of 3 means it is three standard deviations above the mean — under roughly normal conditions, that happens well under 1% of the time, so it is a reasonable line for "unusual." The beauty is that the threshold is now relative: as the stream's baseline shifts, `μ` and `σ` shift with it, and the detector keeps making sense.

Computing this over a live stream means maintaining the statistics incrementally over a sliding window rather than recomputing from scratch each time:

```ts
const latencyAlerts = metrics.pipe(
  detect.zscore({
    value: (m) => m.latencyMs,
    window: 200,        // last 200 samples form the baseline
    threshold: 3,       // fire when |z| > 3
    direction: 'both',  // spikes and drops; use 'above' for spikes only
  })
);

latencyAlerts.subscribe((alert) => {
  console.log(`anomaly: ${alert.value}ms, z=${alert.z.toFixed(2)}`);
});
```

A practical caution on the math: standard deviation can be near zero for a stream that has been flat, which makes the z-score blow up on the first tiny wiggle. DataFlow guards against this with a minimum-variance floor, but it is worth understanding *why* the guard exists — division by a vanishing `σ` turns trivial noise into screaming alerts. The window size is the other tuning knob: a short window reacts fast but is jumpy; a long window is stable but slow to notice a genuine regime change.

| Technique | Adapts to baseline? | Cost per event | Best for |
| --- | --- | --- | --- |
| Static threshold | No | O(1) | Hard limits known in advance |
| Moving average band | Yes | O(1) amortized | Smooth, slowly-drifting signals |
| Z-score (rolling stddev) | Yes | O(1) amortized | Spikes and drops on noisy signals |

## Debouncing: keeping alerts sane

A detector that fires on every qualifying event is unusable. When latency spikes, it does not cross the line once — it stays high for a few seconds, producing dozens of identical alerts. The fix is to debounce: treat a cluster of detections as a single event, and only re-alert once the signal has returned to normal and crossed back out again.

```ts
const stableAlerts = latencyAlerts.pipe(
  detect.debounce({
    cooldown: 5_000,    // suppress repeats for 5s after firing
    resetWhen: (a) => Math.abs(a.z) < 1, // re-arm once back near normal
  })
);
```

Two parameters do the work. The `cooldown` collapses a burst into one alert. The `resetWhen` predicate decides when the system is "back to normal," so a sustained problem does not get permanently silenced after the first alert — once the signal recovers and degrades again, you get a fresh alert. Tuning these is mostly about matching alert volume to what a human can actually act on.

## Wiring alerts into the UI

The point of detection is to change what the user sees. Because alerts are just another stream, the same React hooks that consume live data consume alerts. A common pattern is to keep a bounded list of recent alerts and surface the most severe ones prominently.

```tsx
import { useStream } from '@tekivex/dataflow/react';

function AlertBanner() {
  const recent = useStream(stableAlerts, {
    select: (list, a) => [a, ...list].slice(0, 20),
    initial: [] as Alert[],
    coalesce: 'frame',
  });

  const active = recent.filter((a) => Date.now() - a.at < 30_000);
  if (active.length === 0) return null;

  return (
    <div role="alert" className="alert-banner">
      {active.map((a) => (
        <div key={a.id} data-severity={a.z > 4 ? 'critical' : 'warning'}>
          {a.metric}: {a.value} (z={a.z.toFixed(1)})
        </div>
      ))}
    </div>
  );
}
```

For dashboards where anomalies should be visible *in context* — a flagged row in a live table, a highlighted point on a chart — feed the same alert stream into your data grid. DataFlow pairs naturally with [GridStorm](/product/gridstorm) for this: detection annotates the offending row, and the grid flashes or colors it without re-rendering the whole table. And because every alert is timestamped, you can record the session and replay it later to confirm the detector fired exactly when it should — see [backpressure and time-travel replay](/use-cases/dataflow-backpressure-time-travel-replay) for how recording works.

## When to use anomaly detection on streams

Use a static threshold when you know the bounds and they do not move. Reach for rolling statistics — moving averages and z-scores — when "normal" drifts and you need the detector to drift with it. Always debounce before alerting a human, or you will train them to ignore the banner. And remember the failure modes: a near-zero standard deviation inflates z-scores, and a poorly chosen window either misses slow problems or cries wolf at every blip.

The throughline across DataFlow is that the engine maintains a real model of the stream rather than piping bytes into the DOM. That model is what makes incremental statistics cheap, what lets you debounce coherently, and what connects detection back to the [real-time rendering](/use-cases/dataflow-realtime-streaming-react) patterns the rest of your UI is built on. The full feature set is on the [DataFlow product page](/product/dataflow), and related patterns live in the [use-cases hub](/use-cases).
