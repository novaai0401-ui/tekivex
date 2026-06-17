Most of the security tokens running in production today — session tokens, API access tokens, signed JWTs, federation assertions — rest on a single assumption: that factoring large integers or solving the elliptic-curve discrete-log problem is computationally infeasible. That assumption has held for decades. It will not hold against a sufficiently large quantum computer, and that changes the threat model for anything you sign or encrypt today and expect to remain confidential or trustworthy tomorrow.

Post-quantum cryptography (PQC) is the set of algorithms designed to resist attacks from both classical and quantum adversaries. Quantum Vault issues, stores, and validates tokens built on these algorithms, using the families NIST standardised in 2024. This article explains what PQC actually is, why the threat is real even before a quantum computer exists, how the two core primitives — Kyber and Dilithium — work at a high level, and what a "post-quantum token" means inside Quantum Vault.

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

CRYSTALS-Kyber, standardised as **ML-KEM in FIPS 203**, is a key encapsulation mechanism (KEM). A KEM is the post-quantum replacement for the key-exchange role that RSA encryption and Diffie-Hellman play today. Its security rests on the Module Learning With Errors (Module-LWE) problem over lattices.

The interaction has three operations rather than a classic encrypt/decrypt pair:

```ts
import { mlKem } from '@tekivex/quantum-vault'

// Recipient generates a keypair and publishes the public key
const { publicKey, secretKey } = await mlKem.generateKeyPair()

// Sender encapsulates: produces a ciphertext + a shared secret
const { ciphertext, sharedSecret } = await mlKem.encapsulate(publicKey)

// Recipient decapsulates the ciphertext to recover the SAME shared secret
const recovered = await mlKem.decapsulate(ciphertext, secretKey)
// recovered === sharedSecret  -> use it to key a symmetric cipher (AES-256-GCM)
```

The shared secret is never sent over the wire — only the ciphertext is. Both parties derive the same symmetric key, which then protects the actual payload with a fast classical cipher. This is the mechanism Quantum Vault uses when it needs to protect token material in transit or at rest against HNDL capture.

## Dilithium (ML-DSA): proving authenticity

CRYSTALS-Dilithium, standardised as **ML-DSA in FIPS 204**, is a digital signature scheme. Signatures are what make a token *trustworthy*: they let a verifier confirm a token was issued by the holder of the signing key and has not been tampered with. ML-DSA is the post-quantum replacement for RSA and ECDSA signatures and is also lattice-based.

```ts
import { mlDsa } from '@tekivex/quantum-vault'

const { publicKey, secretKey } = await mlDsa.generateKeyPair()

const message = new TextEncoder().encode('sub:1024;scope:read;exp:1718600000')
const signature = await mlDsa.sign(message, secretKey)

const valid = await mlDsa.verify(message, signature, publicKey)
// valid === true only if message + signature match the public key
```

The practical trade-off to internalise: post-quantum keys and signatures are *larger* than their classical equivalents. An ML-DSA signature is several kilobytes versus a few dozen bytes for ECDSA. This affects token size, header limits, and bandwidth, and it is the main thing that surprises teams during migration — covered in our [migration playbook](/use-cases/quantum-vault-migrate-pqc-token-issuance).

## What a post-quantum token is in Quantum Vault

A post-quantum token in Quantum Vault is a structured, self-describing credential whose authenticity is guaranteed by an ML-DSA signature and whose confidential portions, where present, are protected using an ML-KEM-derived key. Functionally it behaves like a signed token you already know — claims, expiry, issuer, audience — but the cryptographic core is quantum-resistant.

A Quantum Vault token therefore carries:

- **Claims** — the payload (subject, scope, expiry, issuer), identical in spirit to a JWT.
- **An ML-DSA signature** — proving the issuer signed exactly these claims.
- **Algorithm and key identifiers** — so verifiers know which standard and which key version to apply, enabling rotation and crypto-agility.

```ts
import { QuantumVault } from '@tekivex/quantum-vault'

const vault = new QuantumVault({ signingAlg: 'ML-DSA-65' })

const token = await vault.issue({
  sub: 'user-1024',
  scope: ['read', 'write'],
  exp: Math.floor(Date.now() / 1000) + 3600,
})

const result = await vault.verify(token)
if (result.valid) {
  console.log(result.claims.sub) // 'user-1024'
}
```

Because issuance, validation, and rotation all happen against keys you control, the design is suited to self-hosted and sovereign deployment — no third party ever holds your signing keys. We cover that model in [sovereign token verification](/use-cases/quantum-vault-sovereign-token-verification).

## Key takeaways

- Quantum computers do not break RSA today, but **harvest-now, decrypt-later** makes today's captured data a future liability, and signing keys can be forged retroactively once Q-Day arrives.
- PQC swaps the vulnerable asymmetric layer for **lattice-based** primitives that run on ordinary hardware. Symmetric crypto only needs larger keys.
- **Kyber / ML-KEM (FIPS 203)** establishes shared secrets; **Dilithium / ML-DSA (FIPS 204)** produces signatures that prove authenticity.
- A Quantum Vault post-quantum token is a familiar claims-based credential whose trust anchor is an ML-DSA signature, with algorithm identifiers built in for rotation.
- The main practical cost is **size**: PQ keys and signatures are larger, so plan token and transport budgets accordingly.

The migration to post-quantum tokens is not a single switch you flip — it is a transition you stage. Understanding the primitives is step one. If you want the deeper standardisation rationale, see [why NIST-standardised PQC matters](/use-cases/quantum-vault-why-nist-pqc-matters), browse related [use cases](/use-cases), or look at the [Quantum Vault product page](/product/quantum-vault) to start issuing tokens against keys you hold yourself.
