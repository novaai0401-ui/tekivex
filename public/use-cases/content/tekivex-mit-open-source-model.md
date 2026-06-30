Every product in the Tekivex Platform ships the same way: free to use, with no paid tier. Not "free for the community edition," not "free until you hit a usage threshold," not "free for non-commercial use only." Genuinely free — for [GridStorm](/product/gridstorm), [Quantum Vault](/product/quantum-vault), and [Tekivex UI](/product/tekivex-ui) alike.

That decision shapes how teams adopt and budget for these tools, so it is worth being precise about what "free to use" actually grants, what it does not, and why we deliberately avoided the enterprise-tier model that dominates developer tooling. This is not a manifesto. It is an honest account of a pricing choice and its consequences — including the parts that are genuinely hard, like sustainability.

If you are an engineering lead evaluating whether to build on Tekivex, pricing is not a footnote. It determines whether a procurement review is a half-day or a half-quarter, and whether your costs scale with the size of your team.

## What "free to use" actually means here

Tekivex products are **free and open — MIT or Apache-2.0 — and free of charge for commercial and non-commercial use**. GridStorm and Tekivex UI are MIT-licensed; Quantum Vault (`@sigvault/sdk`) is Apache-2.0. Both are permissive, OSI-approved licenses. You can:

- **Use them commercially.** Ship them inside a product you sell. No royalty, no usage report, no revenue threshold.
- **Use them at any scale.** There is no per-seat, per-developer, or per-document fee — the price does not change as your team or usage grows.
- **Use them privately.** Internal tools and dashboards that never see daylight are fine.
- **Build proprietary products on top.** Your application stays entirely yours; under both MIT and Apache-2.0 nothing about using Tekivex obliges you to publish or share your own code.

What "free to use" does **not** mean is that there are no obligations at all: permissive licenses still ask you to retain the copyright and license notice, and Apache-2.0 additionally includes an explicit patent grant. But there is no copyleft, no per-seat fee, and the full source is published — you can read, fork, and self-patch any of these libraries. If reading and self-patching vendor source is a hard requirement for your team, that is exactly what these MIT and Apache-2.0 packages give you.

## Why no enterprise tier, paywall, or per-seat fees

The common alternative is the open-core or tiered model: a free base layer with the genuinely useful features — SSO, audit logs, advanced grid features, role-based access — held back for a paid tier. It is a reasonable business model, and many excellent companies run it well. We chose not to.

The reason is that the tiered model puts a tax on exactly the moments when a tool becomes load-bearing. The features you reach for as your application matures — the ones that justify standardizing on a library — are the ones most likely to sit behind the paywall. You discover the real cost after you have already committed. And per-seat pricing means your bill grows with your engineering team, which is a strange incentive: the more you invest in your own product, the more you pay your dependency vendor.

Offering the whole product free removes that dynamic entirely. There is no feature gate to discover, no seat count to negotiate, no annual true-up. Everything the product does is in front of you on day one.

## What this means for the teams adopting Tekivex

The practical effects show up well before any code is written.

| Concern | Tekivex (free to use) | Open-core / tiered vendors |
| --- | --- | --- |
| Commercial use | Unrestricted, no fee | Often gated by tier or revenue threshold |
| Per-seat / usage fees | None | Common |
| Feature gating | None — every feature is available | Best features often paid-only |
| Procurement overhead | Minimal — nothing to license or true-up | Contracts, seat tracking, renewals |
| Cost as your team grows | Flat (free) | Scales with headcount |

Two of these deserve emphasis. First, **procurement**: with a free, no-contract tool there is little to negotiate — no seat counts to track, no annual renewal to budget. Second, **cost predictability**: because there is no per-seat or usage fee, the cost does not balloon as your application succeeds and your team grows.

A fair question is lock-in. Because the source is public and permissively licensed, you can fork and self-maintain if you ever need to — that meaningfully reduces lock-in. The products are also built on open standards and framework-native primitives (React, Vue, Svelte adapters; standard crypto formats such as ML-DSA-87 and XChaCha20-Poly1305), so the data and patterns you build around stay portable regardless.

Your own application's manifest stays exactly as restrictive as you want:

```json
{
  "name": "acme-internal-ops",
  "license": "UNLICENSED",
  "private": true
}
```

Using a free Tekivex product does not change the license or ownership of your own product. There is no copyleft obligation; MIT and Apache-2.0 only ask that you retain their license and copyright notices, which does not extend to or encumber your own application code.

## The honest part: sustainability

The obvious question about a fully-free, no-paywall model is how it sustains itself. We will not pretend the answer is automatic — it is the genuine hard problem of this approach, and any company claiming otherwise is hand-waving.

A free-to-use model is sustained through means that do not depend on gating the software: optional professional services and support for teams that want a contract and an SLA, sponsorship from organizations that depend on the tools, and the simple fact that broad adoption creates opportunities a niche paid tool never gets. What we owe in return is to be transparent that sustainability is an ongoing commitment, not a solved problem — and to be clear about what the products are (free to use, permissively open-source under MIT or Apache-2.0) rather than dressing them up as something they are not.

## Key takeaways

- **Free to use, for everyone.** Commercial use, any scale, private use — no royalty, no per-seat fee, no revenue threshold.
- **No enterprise tier, no paywall.** Every feature is available from day one; your costs do not scale with headcount.
- **Open source, permissively licensed.** MIT (GridStorm, Tekivex UI) and Apache-2.0 (Quantum Vault) — the source is public, so you can read, fork, and self-patch.
- **Your application stays yours.** Using Tekivex imposes no license, attribution, or copyleft obligation on your own product.
- **Low procurement friction.** Nothing to license, audit, or true-up.

The free-to-use choice is a bet that the most valuable thing a developer-tools company can do is remove the obstacles — cost, contracts, seat counts — between a team and a working tool. You can see how the individual products combine in [The Tekivex Stack](/use-cases/tekivex-stack-how-products-fit), or browse the rest of the [use-case library](/use-cases). The pricing is the same wherever you start: free to use, with no surprises later.
