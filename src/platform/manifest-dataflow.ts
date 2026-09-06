import type { ProductManifest } from './types';

// DataFlow is a hosted, browser-based real-time streaming dashboard. Users open
// the live app and watch streaming data directly — there is nothing to install.
const DATAFLOW_URL = 'https://www.tekivex.com/dataflow/stocks';

export const dataFlowManifest: ProductManifest = {
  id: 'dataflow',
  name: 'DataFlow',
  tagline: 'Watch live, streaming data dashboards in your browser',
  description:
    'DataFlow is a free, browser-based real-time streaming dashboard. Open the live app to watch ' +
    'high-frequency data update in place — with directional change highlighting, anomaly alerts, ' +
    'and time-travel replay. Everything runs in the browser; there is nothing to install.',
  version: '0.3.0',
  status: 'beta',
  tier: 'platform',
  color: '#22c55e',
  accentColor: 'rgba(34, 197, 94, 0.1)',
  iconName: 'trending-up',
  homePath: '/product/dataflow',
  docsRoot: null,
  primaryDemoPath: DATAFLOW_URL,
  playgroundPath: DATAFLOW_URL,
  githubUrl: null,
  stats: [
    { value: 'Real-time', label: 'Live updates' },
    { value: '<10ms',     label: 'Update latency' },
    { value: 'Anomaly',   label: 'Alerting built in' },
    { value: 'Replay',    label: 'Time-travel' },
  ],
  keyFeatures: [
    'Live streaming feeds update in place (WebSocket / SSE)',
    'Directional change tracking (↑↓) with colour flash highlighting',
    'Backpressure control so fast streams never freeze the view',
    'Anomaly alerting — Z-score, IQR, MAD, and static thresholds',
    'Time-travel replay — record, seek, and play back at variable speed',
    'Multi-stream join and merge across live sources',
  ],
  quickLinks: [
    { label: 'Launch DataFlow', path: DATAFLOW_URL, external: true, isNew: true },
  ],
  tags: ['Streaming', 'Real-time', 'Dashboards', 'Anomaly', 'Browser app'],
  seo: {
    title: 'DataFlow — Real-Time Streaming Data Dashboards | Tekivex',
    description:
      'DataFlow is a free, browser-based real-time streaming dashboard — live feeds, directional ' +
      'highlighting, anomaly alerts, and time-travel replay. Nothing to install.',
    keywords: [
      'real-time data dashboard',
      'live streaming dashboard',
      'WebSocket dashboard',
      'SSE streaming app',
      'real-time analytics',
      'anomaly detection dashboard',
      'time-travel replay',
      'DataFlow',
    ],
    jsonLdType: 'WebApplication',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
  },
};
