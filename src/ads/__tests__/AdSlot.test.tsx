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

  it('renders the dev placeholder when consent is undecided in DEV mode', () => {
    vi.stubEnv('DEV', true);
    renderSlot({ slot: '999' });
    const placeholder = screen.getByTestId('ad-slot-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder.textContent).toContain('999');
  });

  it('renders the dev placeholder when consent is denied in DEV mode', () => {
    vi.stubEnv('DEV', true);
    localStorage.setItem(CONSENT_KEY, 'denied');
    renderSlot({ slot: '999' });
    expect(screen.getByTestId('ad-slot-placeholder')).toBeInTheDocument();
  });

  it('renders the real <ins> in production with correct ad-client + slot', () => {
    vi.stubEnv('DEV', false);
    renderSlot({ slot: '424242', format: 'rectangle' });
    const ins = screen.getByTestId('ad-slot-ins');
    expect(ins).toBeInTheDocument();
    expect(ins.getAttribute('data-ad-client')).toBe(ADSENSE_CLIENT);
    expect(ins.getAttribute('data-ad-slot')).toBe('424242');
    expect(ins.getAttribute('data-ad-format')).toBe('rectangle');
    expect(ins.getAttribute('data-full-width-responsive')).toBe('true');
  });

  it('renders the <ins> even when consent is denied (Consent Mode v2 handles serving)', () => {
    vi.stubEnv('DEV', false);
    localStorage.setItem(CONSENT_KEY, 'denied');
    renderSlot({ slot: '424242' });
    expect(screen.getByTestId('ad-slot-ins')).toBeInTheDocument();
  });

  it('renders a visible "Advertisement" label above the <ins> (AdSense policy)', () => {
    vi.stubEnv('DEV', false);
    renderSlot({ slot: '424242' });
    expect(screen.getByTestId('ad-slot-label').textContent).toBe('Advertisement');
  });

  it('pushes once to the adsbygoogle queue when rendered in production', () => {
    vi.stubEnv('DEV', false);
    const w = window as Window & { adsbygoogle?: unknown[] };
    w.adsbygoogle = [];
    renderSlot({ slot: '5555' });
    expect((w.adsbygoogle as unknown[]).length).toBe(1);
  });

  it('pushes regardless of consent state (script load gated by Consent Mode v2)', () => {
    vi.stubEnv('DEV', false);
    localStorage.setItem(CONSENT_KEY, 'denied');
    const w = window as Window & { adsbygoogle?: unknown[] };
    w.adsbygoogle = [];
    renderSlot({ slot: '5555' });
    expect((w.adsbygoogle as unknown[]).length).toBe(1);
  });
});
