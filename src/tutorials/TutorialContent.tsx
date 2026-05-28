import React, { useCallback } from 'react';
import type { ContentBlock, TutorialTopic, TutorialCategory } from './types';
import { CodeBlock } from './CodeBlock';
import { FlowDiagram, ComparisonCard } from './FlowDiagram';
import { MarkdownRenderer } from './MarkdownRenderer';
import { navigate } from '../App';
import { AdSlot } from '../ads/AdSlot';
import { isThinTopic } from './thinTopics';

// ─── ContentBlock Renderer ───

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
      return <Tag id={block.id}>{block.text}</Tag>;
    }
    case 'paragraph':
      return <p dangerouslySetInnerHTML={{ __html: block.html }} />;
    case 'code':
      return <CodeBlock code={block.code} language={block.language} title={block.title} />;
    case 'list':
      return block.ordered ? (
        <ol>{block.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ol>
      ) : (
        <ul>{block.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>
      );
    case 'callout':
      return (
        <div className={`callout callout-${block.variant}`}>
          <p dangerouslySetInnerHTML={{ __html: block.html }} />
        </div>
      );
    case 'table':
      return (
        <div className="table-wrapper">
          <table>
            <thead><tr>{block.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: cell }} />)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'diagram':
      return (
        <figure className="tutorial-diagram-wrap">
          <div dangerouslySetInnerHTML={{ __html: block.svg }} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'flow':
      return <FlowDiagram steps={block.steps} />;
    case 'comparison':
      return <ComparisonCard left={block.left} right={block.right} />;
    case 'divider':
      return <hr />;
    default:
      return null;
  }
}

// ─── Difficulty Badge ───
function DifficultyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    beginner: '#22c55e',
    intermediate: '#f59e0b',
    advanced: '#ef4444',
  };
  return (
    <span className="tutorial-difficulty" style={{ color: colors[level], borderColor: colors[level] + '60' }}>
      {level}
    </span>
  );
}

// ─── Share Button ───
function ShareButton({ categoryId, slug }: { categoryId: string; slug: string }) {
  const [copied, setCopied] = React.useState(false);
  const url = `https://tekivex.com/#/tutorials/${categoryId}/${slug}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [url]);

  return (
    <div className="tutorial-share">
      <button className="tutorial-share-btn" onClick={handleCopy} title="Copy link to share">
        {copied ? 'Link copied!' : 'Share'}
      </button>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
         target="_blank" rel="noopener noreferrer" className="tutorial-share-social" title="Share on X">
        X
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
         target="_blank" rel="noopener noreferrer" className="tutorial-share-social" title="Share on LinkedIn">
        in
      </a>
    </div>
  );
}

// ─── Table of Contents ───
function TableOfContents({ content }: { content: ContentBlock[] }) {
  const headings = content.filter(b => b.type === 'heading' && (b as any).level <= 3) as Array<{ type: 'heading'; level: number; text: string; id?: string }>;
  if (headings.length < 3) return null;

  return (
    <nav className="tutorial-toc">
      <div className="tutorial-toc-title">On this page</div>
      {headings.map((h, i) => (
        <a key={i} href={`#${h.id || h.text.toLowerCase().replace(/\s+/g, '-')}`}
           className={`tutorial-toc-item tutorial-toc-${h.level}`}>
          {h.text}
        </a>
      ))}
    </nav>
  );
}

// ─── Main Content Component ───
interface TutorialContentProps {
  topic: TutorialTopic;
  category: TutorialCategory;
  onNavigate: (slug: string) => void;
  prev: TutorialTopic | null;
  next: TutorialTopic | null;
  markdownContent?: string | null;
}

export function TutorialContent({ topic, category, onNavigate, prev, next, markdownContent }: TutorialContentProps) {
  const topicPath = `/tutorials/${category.id}/${topic.slug}`;
  const showAd = !isThinTopic(topicPath);
  return (
    <div className="docs-main">
      <div className="tutorial-content-wrap">
        <div className="docs-content">
          {/* Breadcrumb */}
          <nav className="tutorial-breadcrumb">
            <a href="/tutorials" onClick={(e) => { e.preventDefault(); navigate('/tutorials'); }}>Tutorials</a>
            <span className="tutorial-breadcrumb-sep">/</span>
            <a href={`/tutorials/${category.id}`}
               onClick={(e) => { e.preventDefault(); navigate(`/tutorials/${category.id}`); }}>
              {category.title}
            </a>
            <span className="tutorial-breadcrumb-sep">/</span>
            <span>{topic.title}</span>
          </nav>

          {/* Header */}
          <h1>{topic.title}</h1>
          <div className="tutorial-meta">
            <DifficultyBadge level={topic.difficulty} />
            <span className="tutorial-reading-time">{topic.estimatedMinutes} min read</span>
            <ShareButton categoryId={category.id} slug={topic.slug} />
          </div>

          {/* Content Blocks or Markdown */}
          {markdownContent != null
            ? <MarkdownRenderer markdown={markdownContent} />
            : (topic.content ?? []).map((block, i) => (
                <RenderBlock key={i} block={block} />
              ))
          }

          {/* Sponsored — appears below the article body, but only on
              articles substantive enough to satisfy AdSense policy. */}
          {showAd && (
            <AdSlot slot="8131722172" label="Sponsored — supports free tutorials" className="ad-slot--article" />
          )}

          {/* Prev / Next Navigation */}
          <div className="tutorial-prev-next">
            {prev ? (
              <button className="tutorial-nav-btn tutorial-nav-prev"
                      onClick={() => onNavigate(prev.slug)}>
                <span className="tutorial-nav-label">Previous</span>
                <span className="tutorial-nav-title">{prev.title}</span>
              </button>
            ) : <div />}
            {next ? (
              <button className="tutorial-nav-btn tutorial-nav-next"
                      onClick={() => onNavigate(next.slug)}>
                <span className="tutorial-nav-label">Next</span>
                <span className="tutorial-nav-title">{next.title}</span>
              </button>
            ) : <div />}
          </div>
        </div>

        {/* Right-rail TOC */}
        <TableOfContents content={topic.content ?? []} />
      </div>
    </div>
  );
}
