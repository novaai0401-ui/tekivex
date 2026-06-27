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
  /** Contact email. */
  email: string;
  /** External profiles for schema.org `sameAs`. */
  sameAs: string[];
}

export const AUTHORS: Record<string, Author> = {
  'chandan-kumar': {
    id: 'chandan-kumar',
    name: 'Chandan Kumar',
    role: 'Tech Lead & AVP, Full-Stack Engineering',
    bio:
      'Chandan Kumar is a full-stack engineering lead with 11+ years building React and Node.js enterprise platforms in the financial-services sector. He writes about frontend architecture, performance, and developer experience.',
    url: 'https://www.linkedin.com/in/chandankumar007',
    email: 'novaai0401@gmail.com',
    sameAs: [
      'https://www.linkedin.com/in/chandankumar007',
      'https://twitter.com/BharatTechPath',
    ],
  },
  'seema-almas-shaikh': {
    id: 'seema-almas-shaikh',
    name: 'Seema Almas Shaikh',
    role: 'Full-Stack Developer — ReactJS, NodeJS',
    bio:
      'Seema Almas Shaikh is a full-stack developer with 11+ years of experience specializing in ReactJS, Redux, and Node.js. She focuses on scalable UI architecture, accessibility, and design systems.',
    url: 'https://www.linkedin.com/in/seema-almas-shaikh',
    email: 'novaai0401@gmail.com',
    sameAs: [
      'https://www.linkedin.com/in/seema-almas-shaikh',
      'https://twitter.com/BharatTechPath',
    ],
  },
};

export function getAuthor(id: string): Author | undefined {
  return AUTHORS[id];
}
