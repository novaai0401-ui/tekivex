import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ScriptLoader, GTAG_ID, ADSENSE_CLIENT } from '../ScriptLoader';

describe('ScriptLoader (deprecated)', () => {
  it('renders nothing — scripts now load from index.html', () => {
    const { container } = render(<ScriptLoader />);
    expect(container.firstChild).toBeNull();
  });

  it('still exports the well-known constants', () => {
    expect(GTAG_ID).toMatch(/^G-/);
    expect(ADSENSE_CLIENT).toBe('ca-pub-4630229006617891');
  });
});
