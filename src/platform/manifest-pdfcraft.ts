import type { ProductManifest } from './types';

const PDFCRAFT_URL = 'https://editable-pdf.onrender.com';
const PDFCRAFT_GITHUB = 'https://github.com/novaai0401-ui/tekivex-issue-report/issues';

export const pdfcraftManifest: ProductManifest = {
  id: 'pdfcraft',
  name: 'PDFCraft',
  tagline: 'Craft PDFs in any browser, with any UI library',
  githubUrl: PDFCRAFT_GITHUB,
  description:
    'Client-side PDF editor with React headless hooks and a bring-your-own UI adapter. ' +
    'Fill and add form fields, sign and stamp, annotate, redact, and edit encrypted PDFs — ' +
    'all entirely in the browser with zero third-party PDF dependencies.',
  version: '1.0.0',
  status: 'ga',
  tier: 'enterprise',
  color: '#ef4444',
  accentColor: 'rgba(239, 68, 68, 0.1)',
  iconName: 'file-pdf',
  homePath: '/product/pdfcraft',
  docsRoot: PDFCRAFT_URL,
  primaryDemoPath: PDFCRAFT_URL,
  stats: [
    { value: '7',       label: 'Packages' },
    { value: 'AES-256', label: 'Encryption' },
    { value: 'BYO UI',  label: 'Adapter' },
    { value: 'Zero',    label: 'PDF deps' },
  ],
  keyFeatures: [
    'Form filling — text, multiline, date, number, checkbox, radio, dropdown, listbox',
    'Add new fields via drag-to-draw rectangle interface',
    'Sign & stamp with signature pad and image embedding',
    'Annotate — highlight, draw, eraser, redact, crop, shapes',
    'Encrypted PDF support — RC4, AES-128, AES-256',
    'Bring-your-own UI — Material UI, Tekivex UI, or custom adapter',
  ],
  quickLinks: [
    { label: 'Live Demo', path: PDFCRAFT_URL, external: true, isNew: true },
  ],
  tags: ['PDF', 'Forms', 'Annotations', 'AES-256', 'React', 'Headless'],
  seo: {
    title: 'PDFCraft — Browser-Native PDF Editor with Headless React Hooks | Tekivex',
    description:
      'Client-side PDF editor with React headless hooks and a bring-your-own UI adapter. ' +
      'Form filling, signing, annotation, redaction, and AES-256 encrypted PDFs — entirely in ' +
      'the browser with zero third-party PDF dependencies.',
    keywords: [
      'PDF editor in browser',
      'React PDF editor',
      'PDF form filler',
      'PDF annotation library',
      'PDF signature',
      'AES-256 PDF',
      'encrypted PDF editor',
      'headless PDF hooks',
      'client-side PDF',
      'PDFCraft',
    ],
    jsonLdType: 'SoftwareApplication',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
  },
};
