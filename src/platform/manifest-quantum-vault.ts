import type { ProductManifest } from './types';

const QV_GITHUB = 'https://github.com/novaai0401-ui/quantum-vault';
const QV_NPM = 'https://www.npmjs.com/package/@sigvault/sdk';

export const quantumVaultManifest: ProductManifest = {
  id: 'quantum-vault',
  name: 'Quantum Vault',
  tagline: 'Sovereign post-quantum tokens for the Q-Day era',
  githubUrl: QV_GITHUB,
  description:
    'Issue, validate, and rotate post-quantum cryptographic tokens using NIST-standardised ' +
    'ML-DSA-87 (Dilithium-5 / FIPS 204) signatures with XChaCha20-Poly1305 encrypted payloads. ' +
    'Designed for sovereign identity, signed credentials, and quantum-resistant secrets ' +
    'management — ready before Q-Day breaks today\'s public-key cryptography. Ships on npm as @sigvault/sdk.',
  version: '0.1.0',
  status: 'beta',
  tier: 'enterprise',
  color: '#8b5cf6',
  accentColor: 'rgba(139, 92, 246, 0.1)',
  iconName: 'shield',
  homePath: '/product/quantum-vault',
  docsRoot: null,
  primaryDemoPath: null,
  stats: [
    { value: 'FIPS 204',   label: 'NIST Standard' },
    { value: 'ML-DSA-87',  label: 'Signatures' },
    { value: 'XChaCha20',  label: 'Encryption' },
    { value: 'Self-host',  label: 'Sovereign' },
  ],
  keyFeatures: [
    'Post-quantum signatures — CRYSTALS-Dilithium (ML-DSA-87, FIPS 204)',
    'Encrypted payloads — XChaCha20-Poly1305 authenticated encryption',
    'Replay protection — stateful HYDRA mutation chain',
    'Sovereign deployment — self-hosted, no third-party trust',
    'Token issuance, validation, and rotation primitives — pure JS (@sigvault/sdk)',
  ],
  quickLinks: [
    { label: 'npm — @sigvault/sdk', path: QV_NPM,    external: true },
    { label: 'Source on GitHub',    path: QV_GITHUB, external: true },
  ],
  tags: ['Post-Quantum', 'PQC', 'NIST', 'Cryptography', 'Tokens', 'Security'],
  seo: {
    title: 'Quantum Vault — Sovereign Post-Quantum Tokens | Tekivex',
    description:
      'Quantum-resistant token issuance and verification using NIST-standardised CRYSTALS-Dilithium ' +
      '(ML-DSA-87, FIPS 204) with XChaCha20-Poly1305 payloads. Self-hosted, sovereign, ready before Q-Day. Ships as @sigvault/sdk.',
    keywords: [
      'post-quantum cryptography',
      'PQC',
      'CRYSTALS-Dilithium',
      'ML-DSA-87',
      'FIPS 204',
      'quantum-resistant tokens',
      'sovereign identity',
      'NIST PQC',
      'Q-Day',
      'Quantum Vault',
    ],
    jsonLdType: 'SoftwareApplication',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'All',
  },
};
