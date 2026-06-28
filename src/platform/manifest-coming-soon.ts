import type { ProductManifest } from '../platform/types';

const DATAFLOW_URL    = 'https://dataflow.tekivex.com';
const DATAFLOW_GITHUB = 'https://github.com/novaai0401-ui/tekivex-issue-report/issues';

export const dataFlowManifest: ProductManifest = {
  id: 'dataflow',
  name: 'DataFlow',
  tagline: 'Real-Time Streaming Data Platform',
  description:
    'Zero-dependency streaming engine for live data feeds — WebSocket, SSE, HTTP polling, ' +
    'and simulated scenarios out of the box. Batched backpressure control, cell change ' +
    'direction tracking, multi-method anomaly detection (Z-score, IQR, MAD), schema ' +
    'auto-inference, time-travel replay, and multi-stream join. React, Vue 3, and Svelte 5 ' +
    'adapters included. Free for commercial use.',
  version: '0.3.0',
  status: 'beta',
  tier: 'open-source',
  color: '#22c55e',
  accentColor: 'rgba(34, 197, 94, 0.1)',
  iconName: 'trending-up',
  homePath: '/product/dataflow',
  docsRoot: `${DATAFLOW_GITHUB}#readme`,
  primaryDemoPath: DATAFLOW_URL,
  playgroundPath: DATAFLOW_URL,
  githubUrl: DATAFLOW_GITHUB,
  stats: [
    { value: 'Beta',   label: 'Status' },
    { value: '5+',     label: 'Adapters' },
    { value: '<10ms',  label: 'Update latency' },
    { value: '4',      label: 'Live demos' },
  ],
  keyFeatures: [
    'WebSocket / SSE / HTTP polling / simulated adapters',
    'Batched rAF backpressure — configurable fps, oldest/newest/sample drop strategies',
    'Cell change direction tracking (↑↓) with colour flash',
    'Anomaly alerting — Z-score, IQR, MAD, and static threshold methods',
    'Schema auto-inference from live row samples',
    'Time-travel replay — record, seek, variable-speed playback',
    'Multi-stream join (inner / left / outer) and N-stream merge',
    'React hooks, Vue 3 composables, and Svelte 5 store factory',
  ],
  quickLinks: [
    { label: 'Live Demo',  path: DATAFLOW_URL,                          external: true, isNew: true },
    { label: 'README',     path: `${DATAFLOW_GITHUB}#readme`,           external: true },
    { label: 'Financial',  path: `${DATAFLOW_URL}`,                     external: true },
  ],
  tags: ['Beta', 'Free', 'Streaming', 'Real-time', 'WebSocket', 'React', 'Vue', 'Svelte', 'Anomaly'],
  seo: {
    title: 'DataFlow — Real-Time Streaming Data Platform | Tekivex',
    description:
      'Zero-dependency streaming engine with WebSocket, SSE, and simulated adapters. ' +
      'Anomaly detection, time-travel replay, schema inference, and React/Vue/Svelte adapters. Free for commercial use.',
    keywords: [
      'real-time data streaming',
      'WebSocket data grid',
      'live data visualization',
      'SSE streaming platform',
      'real-time analytics',
      'streaming data software',
      'anomaly detection',
      'DataFlow Tekivex',
      'time-travel replay',
    ],
    jsonLdType: 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
  },
};
