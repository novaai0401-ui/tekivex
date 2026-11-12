import type { ProductManifest } from './types';

// Pyntra is Tekivex's document app. It opens PDFs and office files in the
// browser and works on them on the user's own device: read, fix, hide (redact
// and protect) and prove (compare, accessibility, PDF/A). It also carries
// Blackout, a short daily redaction game. Its pages are part of this site,
// under /pyntra (see apps.lock.json and scripts/fetch-apps.mjs).
const PYNTRA_URL = 'https://www.tekivex.com/pyntra/app/';
const PYNTRA_HOME = 'https://www.tekivex.com/pyntra/welcome';

export const pyntraManifest: ProductManifest = {
  id: 'pyntra',
  name: 'Pyntra',
  tagline: 'Read, fix, redact and check documents — on your own device',
  description:
    'Pyntra is a free document app that runs in your browser. Open a PDF or an office file and ' +
    'read it, fix it, hide what should not be seen, and check it before you send it. The file ' +
    'stays on your device: nothing is uploaded and there is nothing to install. It also has ' +
    'Blackout, a two-minute daily redaction game.',
  version: '2.0.0',
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
    { value: 'No upload',  label: 'Files stay on your device' },
    { value: '4 jobs',     label: 'Read, fix, hide, prove' },
    { value: 'AES-256',    label: 'Password protection' },
    { value: 'Free',       label: 'No install, no account' },
  ],
  keyFeatures: [
    'Read: Contract X-ray lists the clauses worth a second look in a lease, offer or policy; also open office files, pull out tables, translate text',
    'Fix: convert between formats, compress, fill and add form fields, watermark, flatten',
    'Hide: redact text for good and check nothing is left underneath, find personal details, protect with an AES-256 password',
    'Prove: make a proof certificate that shows a file has not changed, compare two versions, run an accessibility report, save as PDF/A',
    'Privacy check: switch your connection off and watch it still work, so you do not have to take "nothing is uploaded" on trust',
    'Blackout: a daily two-minute game where you uncover the hidden words of a contract',
    'Your work is saved in this browser only, and you can clear it at any time',
  ],
  quickLinks: [
    { label: 'Open Pyntra', path: PYNTRA_URL, external: true, isNew: true },
    { label: "Play today's Blackout", path: `${PYNTRA_URL}?play=today`, external: true, isNew: true },
    { label: 'Check a proof certificate', path: 'https://www.tekivex.com/pyntra/verify', external: true, isNew: true },
    { label: 'What Pyntra does', path: PYNTRA_HOME, external: true },
    { label: 'Guides', path: 'https://www.tekivex.com/pyntra/guides', external: true },
  ],
  tags: ['PDF', 'Documents', 'Redaction', 'Private', 'Browser app'],
  seo: {
    title: 'Pyntra — Read, Fix, Redact and Check Documents in Your Browser | Tekivex',
    description:
      'Open a PDF or office file and read, convert, redact, password-protect and compare it in ' +
      'the browser. The file stays on your device. Free to use.',
    keywords: [
      'redact PDF',
      'password protect PDF',
      'fill PDF form',
      'convert PDF',
      'compress PDF',
      'compare PDF versions',
      'PDF accessibility check',
      'PDF/A',
      'private PDF editor',
      'no upload',
      'Pyntra',
    ],
    jsonLdType: 'WebApplication',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
  },
};
