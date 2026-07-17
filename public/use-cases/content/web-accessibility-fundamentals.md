Around one in six people lives with a significant disability, and virtually everyone experiences temporary or situational limits — a broken wrist, a bright sun on a phone screen, a video watched in a quiet room. Web accessibility is the practice of building interfaces that keep working across all of it. It has a reputation as a compliance chore bolted on before launch. In reality, most accessibility is a small set of habits applied while you build — and the same habits produce markup that's better for SEO, testing, and maintenance. This guide covers the fundamentals every developer should carry around, whatever the framework.

## The shape of the rules: WCAG, POUR, and "AA"

The reference document is the **Web Content Accessibility Guidelines (WCAG)**, maintained by the W3C. Its requirements hang on four principles — content must be **P**erceivable, **O**perable, **U**nderstandable, and **R**obust (POUR) — and each requirement carries a level: **A** (bare minimum), **AA** (the standard target), and **AAA** (aspirational for specific contexts).

When contracts, laws, or policies say "accessible," they almost always mean **WCAG 2.1 or 2.2 level AA**. This isn't optional in a growing share of the world: the Americans with Disabilities Act is applied to websites in US courts (thousands of lawsuits are filed each year), the European Accessibility Act took effect in June 2025 for consumer-facing digital services, and public-sector rules exist in most developed countries. But the more useful framing is practical: the fundamentals below cover the bulk of AA and, more importantly, the bulk of real user pain.

## Fundamental 1: Use the element that already does the job

The single highest-leverage habit is boring: prefer native HTML elements over rebuilt ones. A `<button>` is focusable, keyboard-activatable (Enter *and* Space), announced as a button by screen readers, and clickable — for free. A `<div onClick>` is none of those, and by the time you've added `tabindex`, key handlers, and a role, you've reimplemented a browser feature — usually incompletely.

The same goes for `<a>` for navigation, `<select>`, `<table>` for tabular data, and heading tags. Headings deserve special mention: screen reader users overwhelmingly navigate pages by jumping between headings, so `<h1>`–`<h3>` should form a real outline of the page, not be chosen for their font size (that's what CSS is for). Landmarks — `<nav>`, `<main>`, `<header>`, `<footer>` — give the same jump-navigation for page regions and cost nothing to add.

## Fundamental 2: Everything works with a keyboard

A significant population — people with motor impairments, screen reader users, power users with a broken mouse — operates entirely by keyboard. The requirements:

- **Every interactive element is reachable with Tab** and activates with Enter/Space.
- **Focus is visible.** The focus outline is how a keyboard user knows where they are. Deleting it with `outline: none` because a designer disliked it is the classic accessibility bug; if the default ring clashes with the design, *style* it, don't remove it.
- **Focus order follows visual order** — which happens naturally when the DOM order matches the layout.
- **No keyboard traps.** Modals are the notorious case, in both directions: focus should move into a dialog when it opens, stay within it while open, and return to the triggering element on close. (The native `<dialog>` element now handles much of this.)

The test costs five minutes: unplug your mouse and use your own feature. If you can't reach it, operate it, or *see where you are*, neither can anyone else.

## Fundamental 3: Forms that say what they mean

Forms are where accessibility failures cost users most directly. Three rules cover most of it:

- **Every input has a real label** — a `<label for="…">` programmatically tied to the field, not a floating piece of text nearby. Placeholder text is not a label: it vanishes on input, has poor contrast, and isn't reliably announced.
- **Errors are specific, textual, and associated with their field.** "Something went wrong" in red at the top helps no one; red alone as the error signal is invisible to color-blind users and to screen readers. Say what's wrong and where, and link the message to the input (`aria-describedby` does this).
- **Don't rely on color to carry any meaning** — this extends beyond forms. Roughly 1 in 12 men has a color-vision deficiency; "required fields are shown in red" or a red/green status dot needs a second channel: text, an icon, an underline.

## Fundamental 4: Text people can actually read

WCAG AA requires a contrast ratio of **4.5:1** for normal text (3:1 for large text) against its background. The light-grey-on-white aesthetic (`#999` on white is about 2.8:1) fails, and it fails hardest for the enormous population of low-vision and aging users — well beyond any "edge case." Contrast checkers are built into every browser's dev tools; checking a palette takes minutes and is best done at design time, when it's a color tweak rather than a redesign.

Alongside contrast: real text scales, images of text don't — users must be able to zoom to 200% without content breaking, which modern responsive layouts mostly get for free.

## Fundamental 5: Images and media carry their meaning in text

Every informative image needs an `alt` attribute describing *what the image communicates* — not "image of chart" but "Monthly sign-ups, rising from 200 in January to 1,400 in June." Decorative images take an explicitly empty `alt=""` so screen readers skip them; an image with *no* alt attribute gets its filename read aloud, which is worse than nothing. Videos need captions — which most viewers with no hearing impairment also use — and audio content needs transcripts.

## Fundamental 6: ARIA is a last resort, and dynamic content must announce itself

ARIA attributes (`role`, `aria-label`, `aria-expanded`, …) exist to describe widgets HTML has no native element for — tabs, comboboxes, trees. Two things every developer should know:

- **The first rule of ARIA is not to use it** when a native element exists. ARIA changes what a screen reader *says*, not how an element *behaves* — `role="button"` on a div announces "button" but provides no keyboard support, creating a promise the element doesn't keep. Audits consistently find pages with heavy ARIA use have *more* errors than pages with none.
- **Dynamic updates are invisible until you announce them.** In a single-page app, content that appears without a page load — toasts, validation messages, filtered result counts — goes unnoticed by screen readers unless placed in a **live region** (`aria-live="polite"`, or `role="status"`). One live region for status messages fixes a whole category of silent failures.

## How to test without becoming a specialist

A pragmatic pipeline, cheapest first:

1. **Automated checkers** (Lighthouse, axe) catch missing labels, contrast failures, broken ARIA — but only ~30–40% of real issues. A clean automated score is a floor, not a pass.
2. **The keyboard test** (five minutes, catches what automation can't): tab through the page, operate everything, watch the focus ring.
3. **A screen reader session** on your critical flow — VoiceOver ships with every Mac (⌘+F5), NVDA is free on Windows. The first session is disorienting and eye-opening in equal measure; nothing builds intuition faster.
4. **Zoom to 200%** and confirm nothing overlaps or disappears.

Run steps 1–2 continuously and steps 3–4 before releases, and you'll be ahead of the vast majority of the web — the annual WebAIM survey of the top million homepages still finds detectable WCAG failures on over 94% of them, mostly the *same five basics* this guide covers: contrast, alt text, labels, empty links and buttons.

Accessibility rewards exactly the things good engineers already value: semantic markup, native platform behavior, explicit error handling, and testing the way users actually use things. Start with the six fundamentals, verify with the keyboard, and treat every fix as permanent infrastructure — because unlike most features, accessible foundations rarely need to be built twice.
