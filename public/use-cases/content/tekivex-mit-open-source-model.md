Every product in the Tekivex Platform ships under the same license: MIT. Not "MIT for the community edition," not "MIT until you hit a usage threshold," not "source-available with a clause that converts to open source in four years." Plain MIT, for [GridStorm](/product/gridstorm), [Pyntra](/product/pyntra), [Analytics Studio](/product/analytics-studio), [DataFlow](/product/dataflow), [Quantum Vault](/product/quantum-vault), and [Tekivex UI](/product/tekivex-ui) alike.

That decision shapes everything about how teams adopt and budget for these tools, so it is worth being precise about what the license actually grants, what it asks in return, and why we deliberately avoided the enterprise-tier model that dominates developer tooling. This is not a manifesto. It is an honest account of a licensing choice and its consequences — including the parts that are genuinely hard, like sustainability.

If you are an engineering lead evaluating whether to build on Tekivex, the license is not a footnote. It determines whether a procurement review is a half-day or a half-quarter, whether your costs scale with headcount, and whether you can patch a bug yourself when you need to.

## What the MIT license actually permits

The MIT license is one of the shortest and most permissive licenses in wide use. The operative grant reads, in full:

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following condition:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND...
```

Read that carefully, because the permissions are broad and the obligation is small. You may:

- **Use it commercially.** Ship it inside a product you sell. No royalty, no usage report.
- **Modify it.** Fork it, patch it, rewrite half of it. You are not required to publish your changes.
- **Redistribute it.** Bundle it, repackage it, ship it to customers.
- **Sublicense and relicense your own work.** Your proprietary application built on Tekivex stays proprietary.
- **Use it privately.** Internal tools never see daylight; that is fine.

There is exactly one condition: retain the copyright notice and the permission notice in copies or substantial portions of the software. In practice that means leaving the `LICENSE` file in the package — which package managers do for you automatically. The other clause to understand is the disclaimer: the software is provided "as is," with no warranty and no liability. Permissive licenses trade legal guarantees for freedom, and MIT is explicit about that trade.

## Why no enterprise tier, paywall, or per-seat fees

The common alternative is the open-core model: a free base layer with the genuinely useful features — SSO, audit logs, advanced grid features, role-based access — held back for a paid tier. It is a reasonable business model, and many excellent companies run it well. We chose not to.

The reason is that the tiered model puts a tax on exactly the moments when a tool becomes load-bearing. The features you reach for as your application matures — the ones that justify standardizing on a library — are the ones most likely to sit behind the paywall. You discover the real cost after you have already committed. And per-seat pricing means your bill grows with your engineering team, which is a strange incentive: the more you invest in your own product, the more you pay your dependency vendor.

MIT removes that dynamic entirely. There is no feature gate to discover, no seat count to negotiate, no annual true-up. The whole product is in front of you on day one.

## What this means for the teams adopting Tekivex

The practical effects show up well before any code is written.

| Concern | With an MIT model | With open-core / source-available |
| --- | --- | --- |
| Commercial use | Unrestricted | Often gated by tier or revenue threshold |
| Modify the source | Yes, freely | Sometimes restricted on paid components |
| Per-seat / usage fees | None | Common |
| Read & fork the full source | Yes, all of it | Core only; enterprise modules may be closed |
| License audit risk | Effectively none | Real; tracking seats and tiers is overhead |
| Relicensing / "rug-pull" risk | None — MIT is irrevocable for released versions | Higher; terms have changed under teams before |

Two of these deserve emphasis. First, **license audits**: with MIT there is nothing to audit. You are not tracking which developers touched which package, and procurement does not need a contract to let you `npm install`. Second, **relicensing risk**. A maintainer can change the license on *future* releases of any project — that is true everywhere. But MIT is irrevocable for the versions already published under it. Code you adopt today under MIT stays MIT for that version forever; you can fork from that point if a future direction does not suit you. Several well-known projects have relicensed to source-available terms like the BSL, stranding teams that had built on the open promise. The permissive license is your insurance against that.

You can also simply read the code. When a grid misbehaves at the edge of what virtual scrolling supports, or a PDF renders a font oddly, you open the source — all of it — and you can patch and vendor a fix without waiting on a vendor's roadmap.

```bash
# Adopt a published package the ordinary way
npm install tekivex-ui

# Or vendor and patch it yourself — MIT lets you
git clone https://github.com/tekivex/gridstorm
# make your change, build, and point your app at the local build
```

A proprietary application's own manifest stays exactly as restrictive as you want:

```json
{
  "name": "acme-internal-ops",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "tekivex-ui": "^x",
    "@tekivex/gridstorm": "^x"
  }
}
```

Your MIT dependencies do not make your product MIT. That is the difference between a permissive license and a copyleft one like the GPL — there is no obligation to open-source your work.

## The honest part: sustainability

The obvious question about a fully-permissive, no-paywall model is how it sustains itself. We will not pretend the answer is automatic — it is the genuine hard problem of this approach, and any company claiming otherwise is hand-waving.

Permissive open source is sustained through means that do not depend on restricting the software: professional services and support contracts for teams that want them, sponsorship and funding from organizations that depend on the tools, and an ecosystem where adoption itself creates value. The model works because the cost of *withholding* features (a smaller, more frustrated user base) is real, and because broad adoption of permissively-licensed infrastructure has repeatedly proven durable — React, Vue, Svelte, and most of the toolchain you already rely on are permissively licensed. What we owe in return is to be transparent that sustainability is an ongoing commitment, not a solved problem.

## Key takeaways

- **MIT grants almost everything** — commercial use, modification, redistribution, sublicensing, private use — with one obligation: keep the copyright and permission notice. The trade-off is no warranty.
- **No enterprise tier, no paywall, no per-seat fees.** The full product is available from day one; your costs do not scale with headcount.
- **Low adoption friction.** No license audits, no procurement contract to `npm install`, no feature you discover is gated only after you have committed.
- **No lock-in or rug-pull on released versions.** MIT is irrevocable for code already published under it; you can always fork.
- **Your application stays yours.** Permissive, not copyleft — building on Tekivex does not force you to open-source your own work.

The MIT choice is a bet that the most valuable thing a developer-tools company can do is remove obstacles between a team and the code. You can see how the individual products combine in [The Tekivex Stack](/use-cases/tekivex-stack-how-products-fit), or browse the rest of the [use-case library](/use-cases). The license is the same wherever you start: free to use, free to read, free to change, and yours to depend on without surprises.
