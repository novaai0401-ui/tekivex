Migrating token issuance to post-quantum cryptography is not a library swap you can ship in an afternoon. Your tokens are verified by services you do not control on a schedule you do not own, the credentials already in circulation have lifetimes that outlast any single deploy, and post-quantum signatures are large enough to break assumptions baked into headers, caches, and storage columns. A naive "change the signing algorithm" rollout breaks verification for every consumer that has not upgraded yet.

This article is a migration playbook: how to move from RSA/ECDSA-signed, JWT-style tokens to post-quantum signatures using Quantum Vault, without a flag day. The core technique is a **hybrid, dual-signature transition** that keeps classical verification working while post-quantum verification rolls out, governed by **crypto-agility** so the next migration is cheaper than this one.

We assume you currently issue tokens signed with RS256 or ES256 and verify them across multiple services, some of which you cannot upgrade simultaneously. That is the realistic enterprise starting point, and it is the one this playbook is written for.

## Why you cannot just flip the algorithm

A token's value is that an independent verifier can validate it. The moment you change the signing algorithm to ML-DSA, every verifier still expecting ES256 rejects the new tokens — or worse, fails open. Three constraints make a single-step cutover unsafe:

- **Verifier lag.** Consumers upgrade on their own timelines. Some are third parties or embedded clients you ship to customers.
- **Token lifetime.** Tokens and refresh tokens issued before the cutover must remain verifiable until they expire.
- **Size shifts.** An ML-DSA signature is several kilobytes; an ES256 signature is ~64 bytes. Anything that assumed small tokens — HTTP header limits, cookie size, varchar columns, proxy buffers — needs auditing first.

The answer is to make the transition *additive*: add post-quantum capability alongside the classical path, migrate verifiers, then retire the classical path.

## The dual-signature (hybrid) model

Hybrid signing attaches **both** a classical and a post-quantum signature to the same token. A verifier that understands only ES256 checks the classical signature and ignores the rest; an upgraded verifier checks the post-quantum signature (or both). This preserves backward compatibility while moving the trust anchor forward.

```ts
import { QuantumVault } from '@tekivex/quantum-vault'

const vault = new QuantumVault({
  hybrid: {
    classical: 'ES256',      // existing trust anchor
    postQuantum: 'ML-DSA-65', // FIPS 204 signature
  },
})

// Issues a token carrying BOTH signatures
const token = await vault.issue({
  sub: 'svc-billing',
  scope: ['invoices:read'],
  exp: Math.floor(Date.now() / 1000) + 900,
})
```

On the verification side, you control policy: accept either signature during the transition, then tighten to require the post-quantum one once every verifier is upgraded.

```ts
// Phase 2: accept either (compatibility window)
await vault.verify(token, { require: 'any' })

// Phase 4: require the post-quantum signature, classical now advisory
await vault.verify(token, { require: 'post-quantum' })
```

The cost of hybrid mode is token size — you are carrying two signatures. Keep it as a transition state, not a permanent posture, unless your compliance regime mandates dual-stack indefinitely.

## A phased rollout

Treat the migration as four phases with explicit exit criteria. Do not advance until the previous phase's criteria are met across all consumers.

| Phase | Issuer behaviour | Verifier behaviour | Exit criterion |
| --- | --- | --- | --- |
| 1. Inventory | Classical only | Classical only | Every token type, verifier, and size constraint catalogued |
| 2. Dual-issue | Hybrid (both sigs) | Classical, PQ optional | All issuers emit hybrid tokens |
| 3. Verifier upgrade | Hybrid | Accept either | 100% of verifiers can validate PQ |
| 4. Retire classical | PQ only | Require PQ | No classical-only verifiers remain |

Phase 1 is the one teams skip and regret. Before any code changes, enumerate where tokens flow, who verifies them, what the maximum token size each path tolerates is, and how long the longest-lived token survives. The longest token lifetime sets the minimum duration of Phase 3 — you cannot retire the classical path until the last classically-signed token has expired.

## Crypto-agility: don't hard-code the algorithm

The mistake that makes this migration expensive is hard-coding `ES256` throughout the codebase the first time. The fix is **crypto-agility**: tokens declare which algorithm and key version produced them, and verification dispatches on that declaration. Then the *next* migration — when a new standard or a key compromise forces a change — is a configuration update, not a refactor.

Quantum Vault embeds an algorithm identifier and a key ID in every token header. Verification resolves the right public key from a keyring rather than a single constant:

```ts
const vault = new QuantumVault({
  keyring: {
    'k-2024-es': { alg: 'ES256', publicKey: legacyPub },
    'k-2026-ml': { alg: 'ML-DSA-65', publicKey: pqPub },
  },
  defaultSigningKey: 'k-2026-ml',
})

// Verifier reads `kid` from the token and selects the matching key automatically
const result = await vault.verify(token)
console.log(result.alg, result.kid) // 'ML-DSA-65', 'k-2026-ml'
```

This is also how you handle key rotation independently of algorithm migration: add a new key ID, issue against it, keep the old public key in the ring until its tokens expire, then drop it. The rotation primitives and self-hosted key custody that back this are covered in [sovereign token verification](/use-cases/quantum-vault-sovereign-token-verification).

## Operational gotchas to plan for

A few practical issues surface in real migrations and are cheaper to anticipate than to debug under load:

- **Header and cookie limits.** Hybrid tokens can exceed typical 8 KB header buffers. Audit reverse proxies and frameworks; consider by-reference tokens for the largest payloads.
- **Storage widths.** Database columns sized for classical tokens will truncate PQ tokens. Migrate schemas in Phase 1.
- **Clock and expiry.** Larger tokens do not change expiry logic, but the long Phase 3 window means you must keep classical verification healthy longer than instinct suggests.
- **Performance.** ML-DSA signing and verification are fast, but benchmark in your environment under realistic concurrency before committing throughput SLAs.

If the underlying primitives behind these signatures are unfamiliar, our [post-quantum tokens explainer](/use-cases/quantum-vault-post-quantum-tokens-explained) covers Kyber and Dilithium at a working level.

## When to start this migration

- **Start now if** your tokens or the data they protect have a long confidentiality or trust lifetime — harvest-now, decrypt-later means captured material and recoverable signing keys are a future liability today.
- **Start now if** you ship credentials to clients or third parties you cannot upgrade on demand, because Phase 3 will be long and you want it underway.
- **Sequence carefully if** you have hard header or storage size limits — do the size audit (Phase 1) before issuing a single hybrid token.
- **Adopt crypto-agility regardless of timeline**, because it is the part of this work that pays off in every future migration, not just this one.

The migration to post-quantum token issuance is fundamentally a compatibility problem solved by additive, staged change: issue both signatures, upgrade verifiers, then retire the old anchor — all governed by tokens that declare their own algorithm so the next change is cheap. For the primitives and standards rationale behind ML-DSA, see [post-quantum tokens explained](/use-cases/quantum-vault-post-quantum-tokens-explained), explore related [use cases](/use-cases), or start on the [Quantum Vault product page](/product/quantum-vault).
