import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  ConsentProvider,
  useConsent,
  CONSENT_KEY,
  CONSENT_CHANGE_EVENT,
} from '../ConsentProvider';

function Probe() {
  const { status, accept, reject, reset } = useConsent();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <button onClick={accept}>accept</button>
      <button onClick={reject}>reject</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

describe('ConsentProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts as undecided when nothing is stored', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    expect(screen.getByTestId('status').textContent).toBe('undecided');
  });

  it('hydrates from stored "accepted"', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    expect(screen.getByTestId('status').textContent).toBe('accepted');
  });

  it('hydrates from stored "denied"', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    expect(screen.getByTestId('status').textContent).toBe('denied');
  });

  it('accept() persists and updates status', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    act(() => {
      screen.getByText('accept').click();
    });
    expect(screen.getByTestId('status').textContent).toBe('accepted');
    expect(localStorage.getItem(CONSENT_KEY)).toBe('accepted');
  });

  it('reject() persists and updates status', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    act(() => {
      screen.getByText('reject').click();
    });
    expect(screen.getByTestId('status').textContent).toBe('denied');
    expect(localStorage.getItem(CONSENT_KEY)).toBe('denied');
  });

  it('reset() clears storage and returns to undecided', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    act(() => {
      screen.getByText('reset').click();
    });
    expect(screen.getByTestId('status').textContent).toBe('undecided');
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem(CONSENT_KEY, 'maybe');
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    expect(screen.getByTestId('status').textContent).toBe('undecided');
  });

  it('reacts to the consent-change event so multiple providers stay in sync', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    act(() => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    });
    expect(screen.getByTestId('status').textContent).toBe('accepted');
  });
});
