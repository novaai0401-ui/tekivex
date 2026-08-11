import type { ProductManifest } from '../platform/types';

const UI_URL    = 'https://ui.tekivex.com';
const UI_GITHUB = 'https://github.com/007krcs/tekivex-ui';
const UI_NPM    = 'https://www.npmjs.com/package/tekivex-ui';

export const tekivexUiManifest: ProductManifest = {
  id: 'tekivex-ui',
  name: 'Tekivex UI',
  tagline: 'Accessible Component Library for React, Vue & Svelte',
  description:
    'Production-ready UI component library built for real-world apps — buttons, forms, modals, ' +
    'tables, toasts, navigation, and layout primitives. Fully accessible (WCAG 2.1 AA), ' +
    'dark/light theme support via CSS custom properties, tree-shakeable ESM bundles, and ' +
    'zero runtime dependencies. React 18+, Vue 3, and Svelte 5 bindings included. Free for commercial use.',
  version: '0.1.0',
  status: 'preview',
  tier: 'open-source',
  color: '#f97316',
  accentColor: 'rgba(249, 115, 22, 0.1)',
  iconName: 'layers',
  homePath: '/product/tekivex-ui',
  docsRoot: `${UI_URL}/docs`,
  primaryDemoPath: UI_URL,
  playgroundPath: `${UI_URL}/playground`,
  githubUrl: UI_GITHUB,
  stats: [
    { value: '50+',     label: 'Components' },
    { value: '3',       label: 'Frameworks' },
    { value: 'AA',      label: 'WCAG level' },
    { value: '<8 kB',   label: 'Core bundle' },
  ],
  keyFeatures: [
    '50+ production-ready components — buttons, inputs, selects, modals, drawers, toasts',
    'Fully accessible — WCAG 2.1 AA compliant with ARIA roles and keyboard navigation',
    'Dark / light / high-contrast themes via CSS custom properties',
    'Tree-shakeable ESM — import only what you use, zero runtime dependencies',
    'React 18+, Vue 3, and Svelte 5 bindings with idiomatic APIs',
    'Headless primitives for full style customisation without overrides',
    'Composable layout system — Stack, Grid, Flex, Container, Divider',
    'Form toolkit — validation, error states, field groups, and controlled/uncontrolled modes',
  ],
  quickLinks: [
    { label: 'npm — tekivex-ui', path: UI_NPM,                  external: true },
    { label: 'Live Demo',     path: UI_URL,                     external: true, isNew: true },
    { label: 'Docs',          path: `${UI_URL}/docs`,           external: true },
    { label: 'Storybook',     path: `${UI_URL}/storybook`,      external: true },
  ],
  tags: ['Preview', 'Free', 'React', 'Vue', 'Svelte', 'Accessible', 'Themeable', 'TypeScript', 'Headless'],
  seo: {
    title: 'Tekivex UI — Accessible Component Library for React, Vue & Svelte | Tekivex',
    description:
      'Production-ready UI component library with 50+ accessible components, dark/light themes, ' +
      'tree-shakeable ESM bundles, and React/Vue/Svelte bindings. Free for commercial use.',
    keywords: [
      'UI component library',
      'React component library',
      'Vue component library',
      'Svelte components',
      'accessible UI kit',
      'enterprise UI components',
      'headless UI',
      'dark mode components',
      'Tekivex UI',
    ],
    jsonLdType: 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
  },
};
