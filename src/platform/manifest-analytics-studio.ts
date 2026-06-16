import type { ProductManifest } from './types';

const ANALYTICS_DEMO_URL = 'https://analytics.tekivex.com';
const ANALYTICS_GITHUB    = 'https://github.com/novaai0401-ui/tekivex-issue-report/issues';

export const analyticsStudioManifest: ProductManifest = {
  id: 'analytics-studio',
  name: 'Analytics Studio',
  tagline: 'Visual Data Analytics & BI Platform',
  description:
    'Drag-and-drop analytics builder powered by GridStorm. Create pivot tables, ' +
    '26+ interactive charts, KPI dashboards, SQL queries, and scheduled reports — ' +
    'all in the browser, no backend required.',
  version: '0.2.0',
  status: 'beta',
  tier: 'enterprise',
  color: '#06b6d4',
  accentColor: 'rgba(6, 182, 212, 0.1)',
  iconName: 'bar-chart',
  homePath: '/product/analytics-studio',
  docsRoot: `${ANALYTICS_GITHUB}#readme`,
  primaryDemoPath: ANALYTICS_DEMO_URL,
  playgroundPath: `${ANALYTICS_DEMO_URL}`,
  githubUrl: ANALYTICS_GITHUB,
  stats: [
    { value: '26+',       label: 'Chart types' },
    { value: 'SQL',       label: 'In-browser query' },
    { value: 'KPI',       label: 'Dashboards' },
    { value: 'GridStorm', label: 'Powered by' },
  ],
  keyFeatures: [
    'Drag-and-drop pivot builder — group, aggregate, filter visually',
    '26+ chart types: bar, line, scatter, radar, heatmap, treemap, sankey & more',
    'In-browser SQL engine — SELECT / WHERE / GROUP BY / JOIN, no server',
    'KPI dashboard with auto-thresholds and alert rules',
    'Scheduled report designer — export PDF / Excel on a cron schedule',
    'Vue & Svelte adapters — embed analytics in any framework',
    'AI natural-language query parser (regex-based, zero API key)',
    'Full responsive layout — works on desktop, tablet, and mobile',
  ],
  quickLinks: [
    { label: 'Open Demo',  path: ANALYTICS_DEMO_URL,       external: true, isNew: true },
    { label: 'README',     path: `${ANALYTICS_GITHUB}#readme`, external: true },
  ],
  tags: ['Beta', 'Analytics', 'BI', 'Charts', 'SQL', 'Pivot', 'KPI', 'GridStorm'],
  seo: {
    title: 'Analytics Studio — Visual BI & Data Analytics | Tekivex',
    description:
      'Drag-and-drop analytics builder with 26+ chart types, in-browser SQL, ' +
      'pivot tables, KPI dashboards, and scheduled reports. Free. No backend required.',
    keywords: [
      'business intelligence software',
      'visual analytics platform',
      'drag drop BI tool',
      'KPI dashboard software',
      'pivot table builder',
      'in-browser SQL',
      'data visualization tool',
      'no-code analytics',
      'Analytics Studio Tekivex',
    ],
    jsonLdType: 'SoftwareApplication',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
  },
};
