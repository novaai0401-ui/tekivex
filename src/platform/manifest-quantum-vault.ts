import type { ProductManifest } from './types';

const QV_GITHUB = 'https://github.com/novaai0401-ui/tekivex-issue-report/issues';

export const quantumVaultManifest: ProductManifest = {
  id: 'quantum-vault',
  name: 'Quantum Vault',
  tagline: 'Sovereign post-quantum tokens for the Q-Day era',
  githubUrl: QV_GITHUB,
  description:
    'Issue, store, and validate post-quantum cryptographic tokens using NIST-standardised ' +
    'algorithms. Designed for sovereign identity, signed credentials, and quantum-resistant ' +
    'secrets management — ready before Q-Day breaks today\'s public-key cryptography.',
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
    { value: 'PQC',        label: 'NIST Standard' },
    { value: 'Kyber',      label: 'KEM' },
    { value: 'Dilithium',  label: 'Signatures' },
    { value: 'Self-host',  label: 'Sovereign' },
  ],
  keyFeatures: [
    'Post-quantum tokens — CRYSTALS-Kyber + Dilithium',
    'Sovereign deployment — self-hosted, no third-party trust',
    'Quantum-resistant ahead of Q-Day',
    'Token issuance, validation, and rotation primitives',
    'Built on the NIST PQC standards (FIPS 203 / 204)',
  ],
  quickLinks: [],
  tags: ['Post-Quantum', 'PQC', 'NIST', 'Cryptography', 'Tokens', 'Security'],
  seo: {
    title: 'Quantum Vault — Sovereign Post-Quantum Tokens | Tekivex',
    description:
      'Quantum-resistant token issuance and verification using NIST-standardised CRYSTALS-Kyber ' +
      'and Dilithium. Self-hosted, sovereign, ready before Q-Day. Part of the Tekivex platform.',
    keywords: [
      'post-quantum cryptography',
      'PQC',
      'CRYSTALS-Kyber',
      'CRYSTALS-Dilithium',
      'quantum-resistant tokens',
      'sovereign identity',
      'NIST PQC',
      'Q-Day',
      'cryptographic tokens',
      'Quantum Vault',
    ],
    jsonLdType: 'SoftwareApplication',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'All',
  },
};
