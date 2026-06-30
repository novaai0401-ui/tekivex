import type { ProductManifest } from './types';

// Pyntra is a hosted, browser-based PDF editor. Users open the app and edit
// PDFs directly — there is nothing to install and no library to import.
const PYNTRA_URL = 'https://pyntra.tekivex.com';

export const pyntraManifest: ProductManifest = {
  id: 'pyntra',
  name: 'Pyntra',
  tagline: 'Edit, fill, sign & annotate PDFs right in your browser',
  description:
    'Pyntra is a free, browser-based PDF editor — open it and work with your documents directly. ' +
    'Fill and add form fields, sign and stamp, annotate, redact, and open encrypted PDFs. ' +
    'Everything runs in your browser: your files are never uploaded to a server, and there is ' +
    'nothing to install.',
  version: '1.0.0',
  status: 'beta',
  tier: 'platform',
  color: '#ef4444',
  accentColor: 'rgba(239, 68, 68, 0.1)',
  iconName: 'file-pdf',
  homePath: '/product/pyntra',
  docsRoot: null,
  primaryDemoPath: PYNTRA_URL,
  playgroundPath: PYNTRA_URL,
  githubUrl: null,
  stats: [
    { value: 'In-browser', label: 'Runs client-side' },
    { value: 'AES-256',    label: 'Opens encrypted PDFs' },
    { value: 'No upload',  label: 'Files stay private' },
    { value: 'Free',       label: 'No account needed' },
  ],
  keyFeatures: [
    'Form filling — text, multiline, date, number, checkbox, radio, dropdown, listbox',
    'Add new fields with a drag-to-draw interface',
    'Sign & stamp with a signature pad and image embedding',
    'Annotate — highlight, draw, eraser, redact, crop, shapes',
    'Opens encrypted PDFs (RC4, AES-128, AES-256)',
    'Runs entirely in the browser — your documents are never uploaded',
  ],
  quickLinks: [
    { label: 'Launch Pyntra', path: PYNTRA_URL, external: true, isNew: true },
  ],
  tags: ['PDF', 'Forms', 'Annotations', 'Signing', 'Browser app', 'Private'],
  seo: {
    title: 'Pyntra — Free Browser-Based PDF Editor | Tekivex',
    description:
      'Pyntra is a free, browser-based PDF editor — fill forms, sign, annotate, redact, and open ' +
      'encrypted PDFs. Everything runs client-side, your files are never uploaded. Nothing to install.',
    keywords: [
      'online PDF editor',
      'browser PDF editor',
      'free PDF editor',
      'fill PDF forms online',
      'sign PDF online',
      'annotate PDF',
      'redact PDF',
      'encrypted PDF editor',
      'private PDF editor',
      'Pyntra',
    ],
    jsonLdType: 'WebApplication',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
  },
};
