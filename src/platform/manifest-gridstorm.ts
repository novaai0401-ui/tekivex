import type { ProductManifest } from './types';

// GridStorm is deployed at its own Vercel URL.
// All demo and docs links are external to the grid-data deployment.
const GRIDSTORM_URL = 'https://gridstorm.tekivex.com';

const GRIDSTORM_GITHUB = 'https://github.com/007krcs/grid-data';
const GRIDSTORM_NPM = 'https://www.npmjs.com/package/gridstorm';

export const gridstormManifest: ProductManifest = {
  id: 'gridstorm',
  name: 'GridStorm',
  tagline: 'Enterprise Data Grid — 35 composable plugins',
  githubUrl: GRIDSTORM_GITHUB,
  playgroundPath: `${GRIDSTORM_URL}/playground/`,
  description:
    'Headless data grid engine with virtual scrolling, WCAG 2.1 AA accessibility, ' +
    '42 Excel-compatible formula functions, Excel copy/paste, and a full plugin ' +
    'ecosystem. Free for commercial use. No per-dev license fees.',
  version: '0.1.3',
  status: 'beta',
  tier: 'open-source',
  color: '#3b82f6',
  accentColor: 'rgba(59, 130, 246, 0.1)',
  iconName: 'grid',
  homePath: '/product/gridstorm',
  docsRoot: `${GRIDSTORM_URL}/#/docs`,
  primaryDemoPath: `${GRIDSTORM_URL}/feature-showcase/`,
  stats: [
    { value: '35',     label: 'Plugins' },
    { value: '100K+',  label: 'Rows @ 60fps' },
    { value: '42',     label: 'Excel functions' },
    { value: '<50KB',  label: 'Core bundle' },
  ],
  keyFeatures: [
    'Virtual scrolling — 100K+ rows at 60fps',
    'WCAG 2.1 AA accessibility (plugin-a11y)',
    '42 Excel-compatible formula functions',
    'Excel copy/paste with type coercion',
    'Headless + framework-agnostic (React, Vue, Svelte, Angular)',
    'Comprehensive automated test suite',
  ],
  quickLinks: [
    { label: 'npm — gridstorm',        path: GRIDSTORM_NPM, external: true },
    { label: 'Get Started',            path: `${GRIDSTORM_URL}/#/docs/getting-started/introduction`, external: true },
    { label: 'Feature Showcase',       path: `${GRIDSTORM_URL}/feature-showcase/`, external: true },
    { label: 'Plugin Reference',       path: `${GRIDSTORM_URL}/#/docs/plugins/plugin-system`, external: true },
    { label: 'Migration from AG Grid', path: `${GRIDSTORM_URL}/#/docs/guides/migration-from-ag-grid`, external: true },
    { label: 'Playground',             path: `${GRIDSTORM_URL}/playground/`, external: true, isNew: true },
  ],
  tags: ['Free', 'TypeScript', 'React', 'Vue', 'Svelte', 'Virtual Scroll', 'WCAG 2.1 AA'],
  seo: {
    title: 'GridStorm — Enterprise React Data Grid | Tekivex',
    description:
      'Free enterprise data grid with virtual scrolling (100K rows @ 60fps), ' +
      'WCAG 2.1 AA, 42 Excel formula functions, and 35 composable plugins. Free forever.',
    keywords: [
      'enterprise data grid',
      'react data grid',
      'free data table',
      'ag grid alternative',
      'virtual scrolling grid',
      'TypeScript data grid',
      'WCAG accessible grid',
      'excel formula data grid',
      'headless data grid',
      'GridStorm',
    ],
    jsonLdType: 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
  },
};
