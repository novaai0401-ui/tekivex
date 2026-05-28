import React, { useState, useEffect } from 'react';
import type { TutorialCategory } from './types';
import { loadCategory, findTopic, getFirstTopic, getAdjacentTopics } from './registry';
import { TutorialSidebar } from './TutorialSidebar';
import { TutorialContent } from './TutorialContent';
import { Link } from '../App';
import { useProgress } from './useProgress';
import { navigate } from '../App';

interface TutorialLayoutProps {
  categoryId: string;
  topicSlug: string | null;
}

export function TutorialLayout({ categoryId, topicSlug }: TutorialLayoutProps) {
  const [category, setCategory] = useState<TutorialCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const { visited, markVisited } = useProgress();

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadCategory(categoryId).then(cat => {
      if (cat) {
        setCategory(cat);
      } else {
        setError(`Category "${categoryId}" not found.`);
      }
      setLoading(false);
    }).catch((err: unknown) => {
      setError(`Failed to load category "${categoryId}": ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    });
  }, [categoryId]);

  // Resolve the active topic
  const activeTopic = category
    ? (topicSlug ? findTopic(category, topicSlug) : getFirstTopic(category))
    : null;

  const activeSlug = activeTopic?.slug ?? '';

  // Mark as visited when topic changes
  useEffect(() => {
    if (activeTopic && category) {
      markVisited(category.id, activeTopic.slug);
    }
  }, [activeTopic?.slug, category?.id]);

  // Fetch markdown content when topic has a contentFile
  useEffect(() => {
    if (activeTopic?.contentFile) {
      setMarkdownContent(null);
      fetch(`/tutorials/content/${activeTopic.contentFile}`)
        .then(res => res.text())
        .then(text => setMarkdownContent(text))
        .catch(() => setMarkdownContent(null));
    } else {
      setMarkdownContent(null);
    }
  }, [activeTopic?.contentFile]);

  const navigateTopic = (slug: string) => {
    navigate(`/tutorials/${categoryId}/${slug}`);
  };

  if (loading) {
    return (
      <div className="docs-page">
        <div className="docs-loading">
          <div className="docs-loading-spinner" />
          <span>Loading tutorials...</span>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="docs-page">
        <div className="docs-error">
          <h2>Tutorial Not Found</h2>
          <p>{error || 'Could not load this tutorial category.'}</p>
          <a href="/tutorials" className="btn-primary" style={{ marginTop: 16 }}>Back to Tutorials</a>
        </div>
      </div>
    );
  }

  if (!activeTopic) {
    return (
      <div className="docs-page">
        <div className="docs-error">
          <h2>Topic Not Found</h2>
          <p>The topic <code>{topicSlug}</code> does not exist in {category.title}.</p>
          <Link to={`/tutorials/${categoryId}`} className="btn-primary" style={{ marginTop: 16 }}>
            Go to {category.title}
          </Link>
        </div>
      </div>
    );
  }

  const { prev, next } = getAdjacentTopics(category, activeSlug);

  return (
    <div className="docs-page">
      <TutorialSidebar
        category={category}
        activeSlug={activeSlug}
        onNavigate={navigateTopic}
        visited={visited}
      />
      <TutorialContent
        topic={activeTopic}
        category={category}
        onNavigate={navigateTopic}
        prev={prev}
        next={next}
        markdownContent={markdownContent}
      />
    </div>
  );
}
