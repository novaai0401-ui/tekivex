import type { ProductManifest } from './types';

// Pyntra is Tekivex's hosted, in-browser studio for the things people actually
// send: festival & birthday cards, invitations, photo edits, short videos, and
// PDFs (fill / sign / redact). Everything runs on the user's device — nothing
// is uploaded, work autosaves locally, and there is nothing to install.
const PYNTRA_URL = 'https://pyntra.tekivex.com';

export const pyntraManifest: ProductManifest = {
  id: 'pyntra',
  name: 'Pyntra',
  tagline: 'Cards, invites, photos, video & PDFs — a private studio in your browser',
  description:
    'Pyntra is a free browser studio for the things people actually send: festival and birthday ' +
    'cards, invitations, photo edits, short videos, and PDFs — fill, sign, and redact. Everything ' +
    'runs on your device without uploading, your work autosaves on this device, and there is ' +
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
    { value: 'No upload',   label: 'Files stay on your device' },
    { value: 'Cards + Video', label: 'Design & short reels' },
    { value: 'PDF tools',   label: 'Fill, sign, redact' },
    { value: 'Free',        label: 'No install, no account' },
  ],
  keyFeatures: [
    'Greeting cards and invitations for birthdays, weddings and festivals',
    'Photo edit, collage, and scan-to-PDF',
    'Short video: captions, memory slideshow, and trim',
    'PDF: fill forms, sign, redact, and password-protect — still local',
    'Autosaves in the browser; clear it any time',
    'Optional AI copy for wishes/scripts sends only the text you type, after consent — never the file',
  ],
  quickLinks: [
    { label: 'Open Pyntra', path: PYNTRA_URL, external: true, isNew: true },
  ],
  tags: ['Cards', 'Invitations', 'Photos', 'Video', 'PDF', 'Private'],
  seo: {
    title: 'Pyntra — Cards, Invites, Photos, Video & PDF Studio in Your Browser | Tekivex',
    description:
      'Design wishes and invitations, edit photos and short videos, and fill or sign PDFs in the ' +
      'browser. Nothing is uploaded. Free to use.',
    keywords: [
      'greeting card maker',
      'birthday card maker',
      'festival card maker',
      'invitation maker',
      'photo editor online',
      'short video maker',
      'reels maker',
      'fill PDF form',
      'sign PDF online',
      'redact PDF',
      'private in-browser studio',
      'no upload',
      'Pyntra',
    ],
    jsonLdType: 'WebApplication',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
  },
};
