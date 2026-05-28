import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConsentProvider, CONSENT_KEY } from '../../consent/ConsentProvider';
import { AdSlot } from '../AdSlot';
import { ADSENSE_CLIENT } from '../../consent/ScriptLoader';

function renderSlot(props: Parameters<typeof AdSlot>[0]) {
  return render(
    <ConsentProvider>
      <AdSlot {...props} />
    </ConsentProvider>,
  );
}

describe('AdSlot', () => {
  beforeEach(() => {
    localStorage.clear();
    delete (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle;
    vi.unstubAllEnvs();
  });

  it('renders nothing when consent is undecided', () => {
    const { container } = renderSlot({ slot: '111' });
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when consent is denied', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    const { container } = renderSlot({ slot: '111' });
    expect(container.firstChild).toBeNull();
  });

  it('renders the dev placeholder when accepted in DEV mode', () => {
    vi.stubEnv('DEV', true);
    localStorage.setItem(CONSENT_KEY, 'accepted');
    renderSlot({ slot: '999' });
    const placeholder = screen.getByTestId('ad-slot-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder.textContent).toContain('999');
  });

  it('renders the real <ins> tag in production with correct ad-client + slot', () => {
    vi.stubEnv('DEV', false);
    localStorage.setItem(CONSENT_KEY, 'accepted');
    renderSlot({ slot: '424242', format: 'rectangle' });
    const ins = screen.getByTestId('ad-slot-ins');
    expect(ins).toBeInTheDocument();
    expect(ins.getAttribute('data-ad-client')).toBe(ADSENSE_CLIENT);
    expect(ins.getAttribute('data-ad-slot')).toBe('424242');
    expect(ins.getAttribute('data-ad-format')).toBe('rectangle');
    expect(ins.getAttribute('data-full-width-responsive')).toBe('true');
  });

  it('pushes once to the adsbygoogle queue when rendered in production', () => {
    vi.stubEnv('DEV', false);
    localStorage.setItem(CONSENT_KEY, 'accepted');
    const w = window as Window & { adsbygoogle?: unknown[] };
    w.adsbygoogle = [];
    renderSlot({ slot: '5555' });
    expect(Array.isArray(w.adsbygoogle)).toBe(true);
    expect((w.adsbygoogle as unknown[]).length).toBe(1);
  });

  it('does not push to adsbygoogle when consent is denied', () => {
    vi.stubEnv('DEV', false);
    localStorage.setItem(CONSENT_KEY, 'denied');
    const w = window as Window & { adsbygoogle?: unknown[] };
    w.adsbygoogle = [];
    renderSlot({ slot: '5555' });
    expect((w.adsbygoogle as unknown[]).length).toBe(0);
  });
});
