// ─── Platform Product Registry ───
// Registers all products known to the Tekivex platform shell.
//
// HOW TO ADD A NEW PRODUCT:
//   1. Create   src/platform/manifest-<product>.ts  (implement ProductManifest)
//   2. Import   it below and add to PRODUCT_MANIFESTS
//   3. Done — the launcher, nav, and routing pick it up automatically.

import type { ProductManifest } from './types';
import { gridstormManifest } from './manifest-gridstorm';
import { tekivexUiManifest } from './manifest-tekivex-ui';
import { quantumVaultManifest } from './manifest-quantum-vault';
import { pyntraManifest } from './manifest-pyntra';
import { analyticsStudioManifest } from './manifest-analytics-studio';
import { dataFlowManifest } from './manifest-dataflow';

/** Ordered list — determines display order in launcher + nav */
const PRODUCT_MANIFESTS: ProductManifest[] = [
  // Developer libraries (published on npm)
  gridstormManifest,        // Data Grid (npm: gridstorm)
  tekivexUiManifest,        // UI Component Library (npm: tekivex-ui)
  quantumVaultManifest,     // Post-Quantum Tokens (npm: @sigvault/sdk)
  // Hosted web apps (use them live — nothing to install)
  pyntraManifest,           // Browser PDF editor — pyntra.tekivex.com
  analyticsStudioManifest,  // Browser BI app — analytics.tekivex.com
  dataFlowManifest,         // Real-time streaming dashboard — dataflow.tekivex.com
];

export function getAllProducts(): readonly ProductManifest[] {
  return PRODUCT_MANIFESTS;
}

export function getProduct(id: string): ProductManifest | undefined {
  return PRODUCT_MANIFESTS.find(p => p.id === id);
}

export function getLaunchedProducts(): readonly ProductManifest[] {
  return PRODUCT_MANIFESTS.filter(p => p.status !== 'coming-soon');
}

export function getComingSoonProducts(): readonly ProductManifest[] {
  return PRODUCT_MANIFESTS.filter(p => p.status === 'coming-soon');
}

/** Derive active product id from a hash route */
export function getActiveProductId(route: string): string | null {
  if (route.startsWith('/product/')) {
    const id = route.slice('/product/'.length).split('/')[0];
    return id ? id : null;
  }
  // Platform home — no active product
  return null;
}
