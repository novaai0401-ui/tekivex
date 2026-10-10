import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { ProductHomePage } from '../ProductHomePage';
import { getAllProducts } from '../../platform/registry';
import { PlatformProvider } from '../../platform/PlatformProvider';

afterEach(cleanup);

describe('product pages', () => {
  // Product pages describe Tekivex's own software; they are not publisher
  // content and must never carry an ad unit.
  it.each(getAllProducts().map((p) => p.id))('renders no ad unit on /product/%s', (id) => {
    const { container } = render(
      <PlatformProvider activeProductId={id}>
        <ProductHomePage productId={id} />
      </PlatformProvider>,
    );
    expect(container.textContent).toContain(getAllProducts().find((p) => p.id === id)!.name);
    expect(container.querySelector('.ad-slot, ins.adsbygoogle')).toBeNull();
  });
});
