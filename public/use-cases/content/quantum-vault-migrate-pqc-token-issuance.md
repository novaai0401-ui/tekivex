Migrating token issuance to post-quantum cryptography is not a library swap you can ship in an afternoon. Your tokens are verified by services you do not control on a schedule you do not own, the credentials already in circulation have lifetimes that outlast any single deploy, and post-quantum signatures are large enough to break assumptions baked into headers, caches, and storage columns. A naive "change the signing algorithm" rollout breaks verification for every consumer that has not upgraded yet.

This article is a migration playbook: how to move from RSA/ECDSA-signed, JWT-style tokens to post-quantum signatures using Quantum Vault, without a flag day. The core technique is a **hybrid, dual-signature transition** that keeps classical verification working while post-quantum verification rolls out, governed by **crypto-agility** so the next migration is cheaper than this one.

We assume you currently issue tokens signed with RS256 or ES256 and verify them across multiple services, some of which you cannot upgrade simultaneously. That is the realistic enterprise starting point, and it is the one this playbook is written for.

## Why you cannot just flip the algorithm

A token's value is that an independent verifier can validate it. The moment you change the signing algorithm to ML-DSA, every verifier still expecting ES256 rejects the new tokens — or worse, fails open. Three constraints make a single-step cutover unsafe:

- **Verifier lag.** Consumers upgrade on their own timelines. Some are third parties or embedded clients you ship to customers.
- **Token lifetime.** Tokens and refresh tokens issued before the cutover must remain verifiable until they expire.
- **Size shifts.** An ML-DSA-87 signature is roughly 4,627 bytes; an ES256 signature is ~64 bytes. Anything that assumed small tokens — HTTP header limits, cookie size, varchar columns, proxy buffers — needs auditing first.

The answer is to make the transition *additive*: add post-quantum capability alongside the classical path, migrate verifiers, then retire the classical path.

## What you actually gain over JWT

Before the mechanics, it helps to fix the target. Quantum Vault is not a drop-in JWT clone with a bigger signature — it changes several properties at once. Measured against a conventional RS256/ES256 JWT:

| Property | Classical JWT (RS256/ES256) | Quantum Vault |
| --- | --- | --- |
| Quantum-safe signature | No (RSA / ECDSA) | Yes — ML-DSA-87, FIPS 204 |
| Payload confidentiality | None (claims are base64, readable) | XChaCha20-Poly1305 (claims encrypted) |
| Replay protection | App-level (jti / nonce stores) | Built-in HYDRA mutation chain |
| Signature size | ~64–256 bytes | ~4,627 bytes (ML-DSA-87) |

The size column is the cost; the other three are the reason to migrate.

## The dual-issuer (hybrid) transition

The safe way to cut over is *additive*: keep your existing JWT issuer running and stand up a Quantum Vault issuer alongside it, so both classical and post-quantum tokens are in circulation during the transition. A verifier that understands only ES256 keeps validating the JWTs it always has; an upgraded verifier additionally accepts Quantum Vault tokens. This preserves backward compatibility while moving the trust anchor forward.

> Quantum Vault ships on npm as `@sigvault/sdk`. Install it with `npm install @sigvault/sdk` and run it alongside your existing JWT library.

```ts
import { generateKeypair, MutationChain, issueToken } from '@sigvault/sdk'

// New post-quantum issuer, run alongside the existing ES256 JWT issuer
const { signingKey, verifyingKey, encryptKey } = generateKeypair()
const chain = new MutationChain()

const { tokenHex } = issueToken({
  signingKeySeed: signingKey,
  encryptKey,
  chain,
  claims: { sub: 'svc-billing', role: 'invoices:read' },
  ttl: 900,
})
```

On the verification side, you control policy at the application layer: during the compatibility window a service accepts either a classical JWT or a Quantum Vault token, then tightens to require the post-quantum token once every verifier is upgraded.

```ts
import { verifyToken, MutationChain } from '@sigvault/sdk'

// Phase 2–3: try the post-quantum token, fall back to the classical JWT
function verifyEither(raw: string) {
  try {
    return verifyToken({
      token: raw,
      verifyingKey,
      encryptKey,
      chain: new MutationChain(chain.state),
    }).claims
  } catch {
    return verifyClassicJwt(raw) // existing ES256 path, retired in Phase 4
  }
}
```

The cost of running dual issuers is operational — two code paths and larger post-quantum tokens. Keep it as a transition state, not a permanent posture, unless your compliance regime mandates dual-stack indefinitely.

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

The mistake that makes this migration expensive is hard-coding `ES256` throughout the codebase the first time. The fix is **crypto-agility**: keep verification dispatch driven by a key registry rather than a single constant, so swapping algorithms or rotating keys is a registry update, not a refactor. Then the *next* migration — when a new standard or a key compromise forces a change — is a configuration update.

In practice you maintain a small map from key ID to the verifying material and the verification routine that key uses, and your verifier selects the right entry per token rather than calling one hard-wired path:

```ts
import { verifyToken, MutationChain } from '@sigvault/sdk'

// A registry keyed by key ID, mixing the legacy and post-quantum verifiers
const keyring = {
  'k-2024-es': (raw: string) => verifyClassicJwt(raw), // ES256, legacy
  'k-2026-ml': (raw: string) =>
    verifyToken({
      token: raw,
      verifyingKey,        // Quantum Vault ML-DSA-87 verifying key
      encryptKey,
      chain: new MutationChain(chain.state),
    }).claims,
}

// Dispatch on the key ID carried by the token (inspectToken can surface it)
const claims = keyring[keyIdFor(raw)](raw)
```

This is also how you handle key rotation independently of algorithm migration: add a new key ID, issue against it, keep the old verifying key in the registry until its tokens expire, then drop it. The rotation primitives and self-hosted key custody that back this are covered in [sovereign token verification](/use-cases/quantum-vault-sovereign-token-verification).

## Operational gotchas to plan for

A few practical issues surface in real migrations and are cheaper to anticipate than to debug under load:

- **Header and cookie limits.** Hybrid tokens can exceed typical 8 KB header buffers. Audit reverse proxies and frameworks; consider by-reference tokens for the largest payloads.
- **Storage widths.** Database columns sized for classical tokens will truncate PQ tokens. Migrate schemas in Phase 1.
- **Clock and expiry.** Larger tokens do not change expiry logic, but the long Phase 3 window means you must keep classical verification healthy longer than instinct suggests.
- **Performance.** ML-DSA-87 signing and verification are fast (Quantum Vault is pure JS with no native dependencies), but benchmark in your environment under realistic concurrency before committing throughput SLAs.
- **Mutation-chain state.** Quantum Vault's replay protection is a stateful HYDRA mutation chain. In a serverless or multi-instance issuer, advance and persist the chain through a shared atomic counter (see the serverless `issueTokenAt` flow) so concurrent issuers never reuse a chain position.

If the underlying primitives behind these signatures are unfamiliar, our [post-quantum tokens explainer](/use-cases/quantum-vault-post-quantum-tokens-explained) covers ML-DSA-87 signatures, XChaCha20-Poly1305 payload encryption, and the mutation chain at a working level.

## When to start this migration

- **Start now if** your tokens or the data they protect have a long confidentiality or trust lifetime — harvest-now, decrypt-later means captured material and recoverable signing keys are a future liability today.
- **Start now if** you ship credentials to clients or third parties you cannot upgrade on demand, because Phase 3 will be long and you want it underway.
- **Sequence carefully if** you have hard header or storage size limits — do the size audit (Phase 1) before issuing a single hybrid token.
- **Adopt crypto-agility regardless of timeline**, because it is the part of this work that pays off in every future migration, not just this one.

The migration to post-quantum token issuance is fundamentally a compatibility problem solved by additive, staged change: issue both signatures, upgrade verifiers, then retire the old anchor — all governed by tokens that declare their own algorithm so the next change is cheap. For the primitives and standards rationale behind ML-DSA, see [post-quantum tokens explained](/use-cases/quantum-vault-post-quantum-tokens-explained), explore related [use cases](/use-cases), or start on the [Quantum Vault product page](/product/quantum-vault).
