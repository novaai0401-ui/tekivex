// ─── Article authors ────────────────────────────────────────────────────────
// Real, named authors with verifiable profiles. Attaching genuine human authors
// (name, role, expertise, and external profiles) to every guide is the core
// E-E-A-T signal search engines and content-quality reviewers look for — it is
// the difference between "anonymous content" and an accountable publication.

export interface Author {
  /** Stable id used to anchor articles to an author. */
  id: string;
  /** Display name / byline. */
  name: string;
  /** Role shown under the name. */
  role: string;
  /** One–two sentence bio establishing real expertise. */
  bio: string;
  /** Primary profile URL (used as the Person `url` in JSON-LD). */
  url: string;
  /** Shared editorial contact inbox — not the author's personal address. */
  email: string;
  /** External profiles for schema.org `sameAs`. */
  sameAs: string[];
}

export const AUTHORS: Record<string, Author> = {
  'chandan-kumar': {
    id: 'chandan-kumar',
    name: 'Chandan Kumar',
    role: 'Assistant Vice President, UI Lead & Technical Project Leadership',
    bio:
      'Chandan Kumar is a UI lead and technical project leader with 12+ years building React and Node.js enterprise platforms in the financial-services sector. He writes about frontend architecture, performance, AI innovation, and developer experience.',
    url: 'https://www.linkedin.com/in/chandankumar007',
    email: 'nishu_singh@tekivex.com',
    sameAs: [
      'https://www.linkedin.com/in/chandankumar007',
      'https://twitter.com/BharatTechPath',
    ],
  },
  'seema-almas-shaikh': {
    id: 'seema-almas-shaikh',
    name: 'Seema Almas Shaikh',
    role: 'Vice President, Technical Lead & Frontend Architect',
    bio:
      'Seema Almas Shaikh is a frontend architect and technical lead with 12+ years of experience in ReactJS, Redux, and micro-frontends. She focuses on scalable UI architecture, design systems, accessibility, and GenAI proofs of concept.',
    url: 'https://www.linkedin.com/in/seema-almas-shaikh',
    email: 'nishu_singh@tekivex.com',
    sameAs: [
      'https://www.linkedin.com/in/seema-almas-shaikh',
      'https://twitter.com/BharatTechPath',
    ],
  },
};

export function getAuthor(id: string): Author | undefined {
  return AUTHORS[id];
}
