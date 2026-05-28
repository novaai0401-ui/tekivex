import React from 'react';
import { CATEGORY_META } from './registry';
import { useProgress } from './useProgress';
import { Link } from '../App';

export function TutorialLanding() {
  const { visited } = useProgress();

  return (
    <div className="hub-container" style={{ paddingTop: 48, paddingBottom: 64 }}>
      {/* Hero */}
      <div className="tx-hero" style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="tx-hero-pill">
          <span className="tx-hero-dot" />
          <span>Learn &middot; Build &middot; Master</span>
        </div>
        <h1 className="tx-hero-title">
          <span className="tx-gradient-text">Tutorials &amp; Guides</span>
        </h1>
        <p className="tx-hero-tagline" style={{ maxWidth: 700, margin: '0 auto' }}>
          From system design fundamentals to AI agent architectures — 70 in-depth tutorials
          with flow diagrams, code examples, and visual explanations. Free, always.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="tutorial-landing-grid">
        {CATEGORY_META.map(cat => {
          const completedCount = [...visited].filter(k => k.startsWith(cat.id + '/')).length;
          const pct = Math.round((completedCount / cat.topicCount) * 100);

          return (
            <Link key={cat.id} to={`/tutorials/${cat.id}`} className="tutorial-category-card"
               style={{ '--cat-color': cat.color } as React.CSSProperties}>
              <div className="tutorial-category-icon" style={{ color: cat.color }}>
                {ICON_MAP[cat.icon] || '▦'}
              </div>
              <h3 className="tutorial-category-title">{cat.title}</h3>
              <p className="tutorial-category-desc">{cat.description}</p>
              <div className="tutorial-category-meta">
                <span>{cat.topicCount} topics</span>
                {completedCount > 0 && (
                  <span className="tutorial-category-progress">{pct}% done</span>
                )}
              </div>
              {/* Progress bar */}
              {completedCount > 0 && (
                <div className="tutorial-progress-bar" style={{ marginTop: 8 }}>
                  <div className="tutorial-progress-fill" style={{ width: `${pct}%`, background: cat.color }} />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Stats */}
      <div className="tutorial-landing-stats">
        <div className="tutorial-landing-stat">
          <span className="tutorial-landing-stat-val">70</span>
          <span className="tutorial-landing-stat-label">Topics</span>
        </div>
        <div className="tutorial-landing-stat">
          <span className="tutorial-landing-stat-val">5</span>
          <span className="tutorial-landing-stat-label">Categories</span>
        </div>
        <div className="tutorial-landing-stat">
          <span className="tutorial-landing-stat-val">100+</span>
          <span className="tutorial-landing-stat-label">Code Examples</span>
        </div>
        <div className="tutorial-landing-stat">
          <span className="tutorial-landing-stat-val">50+</span>
          <span className="tutorial-landing-stat-label">Flow Diagrams</span>
        </div>
      </div>
    </div>
  );
}

// Simple text-based icons (no dependency)
const ICON_MAP: Record<string, string> = {
  server: '⚙',
  layers: '◈',
  layout: '⬡',
  database: '⛃',
  cpu: '⬢',
};
