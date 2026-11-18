import { describe, it, expect } from 'vitest';
import { ALLOW, advisoryId, judge } from './audit-deps.mjs';

const advisory = (id, severity = 'high', extra = {}) => ({
  source: 1000, title: `flaw ${id}`, url: `https://github.com/advisories/${id}`, severity, range: '<=1.0.0', ...extra,
});
/** The shape of `npm audit --json`: one entry per package, `via` holding advisories or package names. */
const report = (vulns) => ({ vulnerabilities: vulns });

const PICO = 'GHSA-fc5q-39xc-vjpf';
const allow = [{ id: PICO, package: 'picomatch', until: '2027-01-31', reason: 'test' }];
const on = (d) => new Date(`${d}T12:00:00Z`);

describe('advisoryId', () => {
  it('reads the id from an advisory URL', () => {
    expect(advisoryId('https://github.com/advisories/GHSA-fc5q-39xc-vjpf')).toBe(PICO);
    expect(advisoryId('https://example.com/x')).toBeNull();
    expect(advisoryId(undefined)).toBeNull();
  });
});

describe('judge', () => {
  it('accepts the listed advisory and the packages that only depend on it', () => {
    const r = report({
      picomatch: { severity: 'high', via: [advisory(PICO)] },
      vite: { severity: 'high', via: ['picomatch', 'tinyglobby'] },
      vitest: { severity: 'high', via: ['picomatch'] },
    });
    const out = judge(r, allow, on('2026-11-18'));
    expect(out.failing).toEqual([]);
    expect(out.accepted.map((a) => a.id)).toEqual([PICO]);
    expect(out.unused).toEqual([]);
  });

  it('still fails on any other high or critical advisory', () => {
    const r = report({
      picomatch: { severity: 'high', via: [advisory(PICO)] },
      lodash: { severity: 'critical', via: [advisory('GHSA-aaaa-bbbb-cccc', 'critical')] },
    });
    const out = judge(r, allow, on('2026-11-18'));
    expect(out.failing.map((f) => f.id)).toEqual(['GHSA-aaaa-bbbb-cccc']);
  });

  it('does not let the listed advisory excuse a different package', () => {
    const r = report({ 'other-glob': { severity: 'high', via: [advisory(PICO)] } });
    expect(judge(r, allow, on('2026-11-18')).failing).toHaveLength(1);
  });

  it('fails once the entry has expired', () => {
    const r = report({ picomatch: { severity: 'high', via: [advisory(PICO)] } });
    const out = judge(r, allow, on('2027-02-01'));
    expect(out.failing.map((f) => f.id)).toEqual([PICO]);
    expect(out.expired.map((e) => e.until)).toEqual(['2027-01-31']);
    // The last day is still accepted.
    expect(judge(r, allow, on('2027-01-31')).failing).toEqual([]);
  });

  it('ignores moderate and low advisories, as npm audit --audit-level=high does', () => {
    const r = report({ tiny: { severity: 'moderate', via: [advisory('GHSA-dddd-eeee-ffff', 'moderate'), advisory('GHSA-gggg-hhhh-iiii', 'low')] } });
    expect(judge(r, allow, on('2026-11-18')).failing).toEqual([]);
  });

  it('says when an entry is no longer needed, without failing', () => {
    const out = judge(report({}), allow, on('2026-11-18'));
    expect(out.failing).toEqual([]);
    expect(out.unused).toEqual([PICO]);
  });

  it('handles an empty or missing report', () => {
    expect(judge({}, allow, on('2026-11-18')).failing).toEqual([]);
    expect(judge(undefined, allow, on('2026-11-18')).failing).toEqual([]);
  });
});

describe('the allow list itself', () => {
  it('has a reason and a date no more than six months ahead for every entry', () => {
    for (const a of ALLOW) {
      expect(a.id).toMatch(/^GHSA-/);
      expect(a.package).toBeTruthy();
      expect(a.reason.length).toBeGreaterThan(60);
      expect(a.until).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const months = (Date.parse(a.until) - Date.parse('2026-11-18')) / (30 * 864e5);
      expect(months).toBeLessThanOrEqual(6);
    }
  });
});
