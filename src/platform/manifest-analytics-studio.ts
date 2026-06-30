import type { ProductManifest } from './types';

// Analytics Studio is a hosted, browser-based BI app. Users open the app and
// build dashboards directly — there is nothing to install.
const ANALYTICS_URL = 'https://analytics.tekivex.com';

export const analyticsStudioManifest: ProductManifest = {
  id: 'analytics-studio',
  name: 'Analytics Studio',
  tagline: 'Build dashboards and explore data — right in your browser',
  description:
    'Analytics Studio is a free, browser-based business-intelligence app. Open it, bring your ' +
    'data, and build pivot tables, 26+ interactive charts, KPI dashboards, and run SQL queries — ' +
    'all in the browser, with no backend to set up and nothing to install.',
  version: '0.2.0',
  status: 'beta',
  tier: 'platform',
  color: '#06b6d4',
  accentColor: 'rgba(6, 182, 212, 0.1)',
  iconName: 'bar-chart',
  homePath: '/product/analytics-studio',
  docsRoot: null,
  primaryDemoPath: ANALYTICS_URL,
  playgroundPath: ANALYTICS_URL,
  githubUrl: null,
  stats: [
    { value: '26+',        label: 'Chart types' },
    { value: 'SQL',        label: 'In-browser query' },
    { value: 'KPI',        label: 'Dashboards' },
    { value: 'No backend', label: 'Runs client-side' },
  ],
  keyFeatures: [
    'Drag-and-drop pivot builder — group, aggregate, and filter visually',
    '26+ chart types: bar, line, scatter, radar, heatmap, treemap, sankey & more',
    'In-browser SQL — SELECT / WHERE / GROUP BY / JOIN, no server required',
    'KPI dashboards with auto-thresholds and alert rules',
    'Scheduled report designer — export to PDF / Excel',
    'Natural-language query parser (no API key required)',
    'Responsive layout — works on desktop, tablet, and mobile',
  ],
  quickLinks: [
    { label: 'Launch Analytics Studio', path: ANALYTICS_URL, external: true, isNew: true },
  ],
  tags: ['Analytics', 'BI', 'Charts', 'SQL', 'Pivot', 'KPI', 'Browser app'],
  seo: {
    title: 'Analytics Studio — Free Browser-Based BI & Dashboards | Tekivex',
    description:
      'Analytics Studio is a free, browser-based BI app — build pivot tables, 26+ charts, KPI ' +
      'dashboards, and run in-browser SQL. No backend, nothing to install.',
    keywords: [
      'online BI tool',
      'browser analytics app',
      'free dashboard builder',
      'KPI dashboard',
      'pivot table builder',
      'in-browser SQL',
      'data visualization tool',
      'no-code analytics',
      'Analytics Studio',
    ],
    jsonLdType: 'WebApplication',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
  },
};
