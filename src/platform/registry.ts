// ─── Platform Product Registry ───
// Registers all products known to the Tekivex platform shell.
//
// HOW TO ADD A NEW PRODUCT:
//   1. Create   src/platform/manifest-<product>.ts  (implement ProductManifest)
//   2. Import   it below and add to PRODUCT_MANIFESTS
//   3. Done — the launcher, nav, and routing pick it up automatically.

import type { ProductManifest } from './types';
import { gridstormManifest } from './manifest-gridstorm';
import { pyntraManifest } from './manifest-pyntra';
import { analyticsStudioManifest } from './manifest-analytics-studio';
import { dataFlowManifest } from './manifest-coming-soon';
import { tekivexUiManifest } from './manifest-tekivex-ui';
import { quantumVaultManifest } from './manifest-quantum-vault';

/** Ordered list — determines display order in launcher + nav */
const PRODUCT_MANIFESTS: ProductManifest[] = [
  gridstormManifest,        // GA   — Data Grid
  pyntraManifest,           // GA   — Browser PDF Editor
  analyticsStudioManifest,  // Beta — Analytics Studio
  dataFlowManifest,         // Beta — Real-time Streaming
  quantumVaultManifest,     // Beta — Post-Quantum Tokens
  tekivexUiManifest,        // Preview — UI Component Library
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
