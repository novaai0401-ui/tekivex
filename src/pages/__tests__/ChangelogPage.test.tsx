import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChangelogPage } from '../ChangelogPage';
import { CHANGELOG } from '../../content/changelog';

describe('ChangelogPage', () => {
  it('renders every changelog entry with a machine-readable date', () => {
    render(<ChangelogPage />);
    for (const e of CHANGELOG) {
      expect(screen.getByRole('heading', { name: e.title })).toBeInTheDocument();
      const time = document.querySelector(`time[datetime="${e.date}"]`);
      expect(time).not.toBeNull();
    }
  });

  it('is ordered newest-first', () => {
    const dates = CHANGELOG.map((e) => e.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it('renders each change item under its entry', () => {
    render(<ChangelogPage />);
    const totalItems = CHANGELOG.reduce((n, e) => n + e.items.length, 0);
    // Tag labels (New/Improved/Fixed) mark each item.
    const tags = document.querySelectorAll('.cl-tag');
    expect(tags.length).toBe(totalItems);
  });
});
