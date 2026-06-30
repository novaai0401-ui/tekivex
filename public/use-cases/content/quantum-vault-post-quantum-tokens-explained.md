Most of the security tokens running in production today — session tokens, API access tokens, signed JWTs, federation assertions — rest on a single assumption: that factoring large integers or solving the elliptic-curve discrete-log problem is computationally infeasible. That assumption has held for decades. It will not hold against a sufficiently large quantum computer, and that changes the threat model for anything you sign or encrypt today and expect to remain confidential or trustworthy tomorrow.

Post-quantum cryptography (PQC) is the set of algorithms designed to resist attacks from both classical and quantum adversaries. Quantum Vault issues, stores, and validates tokens built on these algorithms, anchored on the digital-signature family NIST standardised in 2024. This article explains what PQC actually is, why the threat is real even before a quantum computer exists, how lattice-based primitives like Kyber and Dilithium work at a high level, and what a "post-quantum token" means inside Quantum Vault.

The goal is to give you an accurate mental model, not marketing. Quantum computers do not break RSA today. But the migration is a multi-year exercise, and the data you protect now may need to stay protected long after Q-Day.

## What "post-quantum" actually means

Two quantum algorithms drive the concern. **Shor's algorithm** can factor integers and compute discrete logarithms in polynomial time on a large fault-tolerant quantum computer — that directly breaks RSA, Diffie-Hellman, and elliptic-curve cryptography. **Grover's algorithm** gives a quadratic speedup against unstructured search, which weakens symmetric ciphers and hashes but is handled simply by doubling key sizes (AES-256 stays comfortable).

So the asymmetric layer is the problem. Post-quantum cryptography replaces the vulnerable public-key primitives with ones based on mathematical problems that have no known efficient quantum attack — primarily structured lattice problems. PQC runs on classical hardware you already own; "post-quantum" describes the adversary it resists, not the computer it runs on.

It is worth being precise about timelines. No publicly known quantum computer can break 2048-bit RSA. Estimates for when one might exist range widely. The point of migrating now is not that the sky is falling — it is that the cost of waiting is asymmetric, as the next section explains.

## Q-Day and harvest-now, decrypt-later

"Q-Day" is shorthand for the hypothetical day a cryptographically-relevant quantum computer (CRQC) can break the public-key algorithms in widespread use. We do not know when it arrives, and that uncertainty is precisely the risk.

The threat that makes this urgent is **harvest-now, decrypt-later** (HNDL). An adversary does not need a quantum computer today to attack you today. They need only to capture and store your encrypted traffic and signed material now, then decrypt or forge it once a CRQC becomes available. Anything with a long confidentiality lifetime — health records, state secrets, financial data, long-lived credentials — is exposed the moment it crosses the wire, even if the break is a decade away.

Signatures and tokens face a related but distinct problem. A token signed with ECDSA is only as trustworthy as the assumption that nobody can recover the signing key. Long-lived tokens, refresh tokens, and especially the keys behind them become forgeable retroactively once the underlying problem is solved. The defensive math is simple:

| Question | Implication |
| --- | --- |
| How long must this data stay confidential? | Add that to the migration window |
| How long until a CRQC plausibly exists? | Unknown — treat as "could be sooner than the data lifetime" |
| Is the data being captured in transit today? | If yes, HNDL applies now |

If the confidentiality lifetime plus the migration time exceeds time-to-Q-Day, you are already late. That is the case for a surprising amount of enterprise data.

## Kyber (ML-KEM): establishing shared secrets

CRYSTALS-Kyber, standardised as **ML-KEM in FIPS 203**, is a key encapsulation mechanism (KEM). A KEM is the post-quantum replacement for the key-exchange role that RSA encryption and Diffie-Hellman play today. Its security rests on the Module Learning With Errors (Module-LWE) problem over lattices. It belongs to the same NIST lattice family as the signature scheme below, and is worth understanding as part of the PQC landscape — though, as the next sections make clear, it is not the primitive Quantum Vault relies on to protect token payloads.

A KEM has three operations rather than a classic encrypt/decrypt pair: the recipient generates a keypair and publishes the public key; the sender *encapsulates* against that public key, producing a ciphertext plus a shared secret; the recipient *decapsulates* the ciphertext to recover the same shared secret. The shared secret is never sent over the wire — only the ciphertext is. Both parties derive the same symmetric key, which then protects the actual payload with a fast symmetric cipher.

Quantum Vault does not use a KEM for token confidentiality. Where a token carries confidential claims, Quantum Vault protects them directly with **XChaCha20-Poly1305**, a fast symmetric authenticated cipher (AEAD), keyed from material both parties already hold — so there is no key encapsulation step in the token path at all.

## Dilithium (ML-DSA): proving authenticity

CRYSTALS-Dilithium, standardised as **ML-DSA in FIPS 204**, is a digital signature scheme. Signatures are what make a token *trustworthy*: they let a verifier confirm a token was issued by the holder of the signing key and has not been tampered with. ML-DSA is the post-quantum replacement for RSA and ECDSA signatures and is also lattice-based. This is the primitive at the core of Quantum Vault: every token is signed with **ML-DSA-87 (Dilithium-5)** under FIPS 204. (Falcon-512 is also available where a smaller signature matters more than the larger ML-DSA security margin.)

```ts
import { generateKeypair, MutationChain, issueToken, verifyToken } from '@sigvault/sdk'

const { signingKey, verifyingKey, encryptKey } = generateKeypair()
const chain = new MutationChain()

const { tokenHex } = issueToken({
  signingKeySeed: signingKey,
  encryptKey,
  chain,
  claims: { sub: 'user-123', role: 'read' },
  ttl: 3600,
})

const result = verifyToken({
  token: tokenHex,
  verifyingKey,
  encryptKey,
  chain: new MutationChain(chain.state),
})
// result.claims is populated only if the ML-DSA-87 signature checks out
```

The practical trade-off to internalise: post-quantum keys and signatures are *larger* than their classical equivalents. An ML-DSA-87 signature is roughly 4,627 bytes versus a few dozen bytes for ECDSA. This affects token size, header limits, and bandwidth, and it is the main thing that surprises teams during migration — covered in our [migration playbook](/use-cases/quantum-vault-migrate-pqc-token-issuance).

## Why standardised PQC, not roll-your-own

There is a strong instinct to treat "post-quantum" as a property you bolt on — pick a lattice scheme that looks resistant, implement it, ship it. That instinct is exactly wrong for cryptography. The difference between a primitive that survives and one that does not is rarely the idea; it is the years of public, adversarial scrutiny the idea survived. That is what standardisation buys, and it is why Quantum Vault tracks the NIST standards rather than shipping bespoke algorithms.

NIST ran an open, multi-round competition for post-quantum algorithms beginning in 2016. Candidates were submitted publicly, specified in full, and subjected to years of open cryptanalysis; several promising schemes were broken outright during the process — that is the process working as intended. In **August 2024** NIST published the first finalised standards (FIPS 203 and FIPS 204), drawn primarily from the lattice family. The value is not that NIST is an oracle; it is that the process concentrated worldwide cryptanalytic effort on a few candidates, so the survivors carry an evidentiary record no in-house scheme can match.

Lattice schemes also have subtle implementation pitfalls — constant-time arithmetic, correct error sampling, rejection sampling, side-channel resistance — where a small mistake silently destroys security without breaking functionality. A standard plus published test vectors is how you get those right:

| Property | Standardised (ML-KEM / ML-DSA) | Roll-your-own |
| --- | --- | --- |
| Public cryptanalysis | Years, global community | Effectively none |
| Known-answer test vectors | Published, verifiable | You write your own |
| Interoperability | Other vendors converge | Isolated |
| Compliance posture | Maps to FIPS, procurement | Hard to justify |
| Implementation guidance | Specified parameters & encodings | Improvised |

When a regulator or customer asks which algorithm you use, naming a published standard — for Quantum Vault, "FIPS 204 ML-DSA-87" — maps to procurement checklists and audit frameworks. "Our own lattice variant" does not.

## What a post-quantum token is in Quantum Vault

A post-quantum token in Quantum Vault is a structured, self-describing credential whose authenticity is guaranteed by an **ML-DSA-87 signature** and whose confidential claims, where present, are protected with **XChaCha20-Poly1305** symmetric encryption. Replay is prevented by a stateful **HYDRA mutation chain** that advances on every issuance. Functionally it behaves like a signed token you already know — claims, expiry, issuer — but the cryptographic core is quantum-resistant.

A Quantum Vault token therefore carries:

- **Claims** — the payload (subject, role, expiry), identical in spirit to a JWT, with confidential fields sealed under XChaCha20-Poly1305.
- **An ML-DSA-87 signature** — proving the issuer signed exactly these claims.
- **A mutation-chain position** — so a replayed token is detected and rejected by the verifier's chain state.

> Quantum Vault ships on npm as `@sigvault/sdk`. Install it with `npm install @sigvault/sdk`.

```ts
import { generateKeypair, MutationChain, issueToken, verifyToken } from '@sigvault/sdk'

const { signingKey, verifyingKey, encryptKey } = generateKeypair()
const chain = new MutationChain()

const { tokenHex } = issueToken({
  signingKeySeed: signingKey,
  encryptKey,
  chain,
  claims: { sub: 'user-1024', role: 'admin' },
  ttl: 3600,
})

const result = verifyToken({
  token: tokenHex,
  verifyingKey,
  encryptKey,
  chain: new MutationChain(chain.state),
})
console.log(result.claims.sub) // 'user-1024'
```

You can inspect a token's structure without verifying it using `inspectToken`, which is useful for debugging and tooling. Because issuance, validation, and rotation all happen against keys you control, the design is suited to self-hosted and sovereign deployment — no third party ever holds your signing keys. We cover that model in [sovereign token verification](/use-cases/quantum-vault-sovereign-token-verification).

## Key takeaways

- Quantum computers do not break RSA today, but **harvest-now, decrypt-later** makes today's captured data a future liability, and signing keys can be forged retroactively once Q-Day arrives.
- PQC swaps the vulnerable asymmetric layer for **lattice-based** primitives that run on ordinary hardware. Symmetric crypto only needs larger keys.
- In the broader PQC landscape, **Kyber / ML-KEM (FIPS 203)** establishes shared secrets; **Dilithium / ML-DSA (FIPS 204)** produces signatures that prove authenticity. Quantum Vault is built on the signature side.
- A Quantum Vault post-quantum token is a familiar claims-based credential whose trust anchor is an **ML-DSA-87** signature, with confidential claims sealed under **XChaCha20-Poly1305** and replay blocked by a **mutation chain**.
- The main practical cost is **size**: PQ keys and signatures are larger — an ML-DSA-87 signature is roughly 4,627 bytes — so plan token and transport budgets accordingly.
- Prefer **standardised** PQC (the most-attacked algorithm still standing) over bespoke schemes; Quantum Vault tracks the NIST FIPS 204 standard rather than shipping a homegrown lattice variant.

The migration to post-quantum tokens is not a single switch you flip — it is a transition you stage. Understanding the primitives is step one. For the staged rollout, see the [migration playbook](/use-cases/quantum-vault-migrate-pqc-token-issuance), browse related [use cases](/use-cases), or look at the [Quantum Vault product page](/product/quantum-vault) to start issuing tokens against keys you hold yourself.
