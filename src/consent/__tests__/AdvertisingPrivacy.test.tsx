import { describe, it, expect, afterEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { AdvertisingPrivacy } from '../AdvertisingPrivacy';

afterEach(() => { delete window.googlefc; });
describe('AdvertisingPrivacy', () => {
  it('does not claim a Google message is available before the API is ready', () => {
    render(<AdvertisingPrivacy />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('reopens through the Google readiness queue after an explicit click', () => {
    const revoke = vi.fn();
    window.googlefc = { callbackQueue: [], showRevocationMessage: revoke };
    render(<AdvertisingPrivacy />);
    act(() => window.googlefc!.callbackQueue[0].CONSENT_API_READY());
    act(() => screen.getByRole('button').click());
    expect(revoke).not.toHaveBeenCalled();
    act(() => window.googlefc!.callbackQueue[1].CONSENT_API_READY());
    expect(revoke).toHaveBeenCalledOnce();
  });
  it('reports a message failure without claiming consent was changed', () => {
    window.googlefc = { callbackQueue: [], showRevocationMessage: () => { throw new Error('unavailable'); } };
    render(<AdvertisingPrivacy />);
    act(() => window.googlefc!.callbackQueue[0].CONSENT_API_READY());
    act(() => screen.getByRole('button').click());
    act(() => window.googlefc!.callbackQueue[1].CONSENT_API_READY());
    expect(screen.getByRole('status')).toHaveTextContent('could not reopen');
  });
});
