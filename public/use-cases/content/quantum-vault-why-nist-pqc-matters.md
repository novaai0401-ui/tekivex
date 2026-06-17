There is a strong instinct among engineers to treat "post-quantum" as a property you can bolt on — pick a lattice scheme that looks resistant, implement it, ship it. That instinct is exactly wrong for cryptography. The history of the field is a graveyard of clever schemes broken years after deployment, and the difference between a primitive that survives and one that does not is rarely the idea; it is the years of public, adversarial scrutiny the idea survived. That is what standardisation buys, and it is why Quantum Vault tracks the NIST standards rather than shipping bespoke algorithms.

This article explains the NIST post-quantum cryptography standardisation process, what **FIPS 203 (ML-KEM)** and **FIPS 204 (ML-DSA)** actually are, why "standardised" matters far more than "novel" in cryptography, and how Quantum Vault stays aligned with the standards as they evolve. If you take one thing away: in cryptography, you want the most-attacked algorithm that is still standing, not the cleverest one nobody has tried to break.

The stakes are concrete. The algorithms chosen here will protect data and credentials for the next two decades, and migration is slow enough that getting the foundation right matters more than getting it fast.

## The NIST PQC competition

NIST ran an open, multi-round competition for post-quantum algorithms beginning in 2016. The format mattered as much as the outcome. Candidate algorithms were submitted publicly, specified in full, and subjected to years of open cryptanalysis by the global research community. Schemes that looked promising were attacked; several were broken outright during the process — including some that reached late rounds before a devastating classical attack surfaced. That is the process working as intended: better to break a candidate during evaluation than after global deployment.

After several rounds, NIST selected an initial set of algorithms to standardise, drawn primarily from the lattice-based family for general-purpose use. In **August 2024**, NIST published the first finalised standards as Federal Information Processing Standards. The competition's value is not that NIST is an oracle; it is that the process concentrated worldwide cryptanalytic effort on a small set of candidates, so the survivors carry an unusually strong evidentiary record.

## FIPS 203: ML-KEM (from Kyber)

**FIPS 203** standardises ML-KEM — the Module-Lattice-based Key-Encapsulation Mechanism, derived from CRYSTALS-Kyber. A KEM is the post-quantum tool for establishing a shared secret over an untrusted channel, the role RSA key transport and Diffie-Hellman play in classical systems. Its security rests on the Module Learning With Errors problem, for which no efficient quantum attack is known.

ML-KEM is specified at parameter sets targeting different security levels, commonly referenced as ML-KEM-512, -768, and -1024, trading key/ciphertext size against security margin. In Quantum Vault, ML-KEM protects confidential token material against harvest-now, decrypt-later capture — the attacker who records ciphertext today hoping to decrypt it post-Q-Day gains nothing.

```ts
import { mlKem } from '@tekivex/quantum-vault'

// FIPS 203 parameter set selected explicitly — agility, not a magic default
const kem = mlKem.withParams('ML-KEM-768')

const { publicKey, secretKey } = await kem.generateKeyPair()
const { ciphertext, sharedSecret } = await kem.encapsulate(publicKey)
const recovered = await kem.decapsulate(ciphertext, secretKey)
// recovered === sharedSecret -> derive an AES-256-GCM key from it
```

## FIPS 204: ML-DSA (from Dilithium)

**FIPS 204** standardises ML-DSA — the Module-Lattice-based Digital Signature Algorithm, derived from CRYSTALS-Dilithium. Signatures are what make a token *trustworthy*: a verifier confirms the token was produced by the holder of the signing key and has not been altered. ML-DSA replaces RSA and ECDSA signatures and, like ML-KEM, is lattice-based.

It is specified at parameter sets often referenced as ML-DSA-44, -65, and -87, again trading signature size for security margin. The practical headline is size: ML-DSA signatures are kilobytes, not the tens of bytes of ECDSA, which is the dominant engineering consideration when you put them in tokens.

```ts
import { mlDsa } from '@tekivex/quantum-vault'

const dsa = mlDsa.withParams('ML-DSA-65') // FIPS 204
const { publicKey, secretKey } = await dsa.generateKeyPair()

const claims = new TextEncoder().encode('sub:svc-1;exp:1718600000')
const signature = await dsa.sign(claims, secretKey)
const valid = await dsa.verify(claims, signature, publicKey)
```

The two standards are complementary: ML-KEM keeps secrets confidential, ML-DSA proves authenticity. A complete post-quantum token system needs both, which is why Quantum Vault implements both. For a primitive-level walkthrough, see [post-quantum tokens explained](/use-cases/quantum-vault-post-quantum-tokens-explained).

## Why standardisation beats rolling your own

"Don't roll your own crypto" is a cliché because it is true, and post-quantum crypto makes it more true, not less. Lattice schemes have subtle implementation pitfalls — constant-time arithmetic, correct error sampling, rejection sampling, side-channel resistance — where a small mistake silently destroys security without breaking functionality. The reasons to prefer a standard are concrete:

| Property | Standardised (ML-KEM / ML-DSA) | Roll-your-own |
| --- | --- | --- |
| Public cryptanalysis | Years, global community | Effectively none |
| Known-answer test vectors | Published, verifiable | You write your own |
| Interoperability | Other vendors converge | Isolated |
| Compliance posture | Maps to FIPS, procurement | Hard to justify |
| Implementation guidance | Specified parameters & encodings | Improvised |

Standardisation also gives you **interoperability** and **compliance**. When a regulator or customer asks which algorithms you use, "FIPS 203 ML-KEM-768 and FIPS 204 ML-DSA-65" is an answer that maps to procurement checklists and audit frameworks. "Our own lattice variant" is not. And because every conforming implementation publishes the same test vectors, you can verify your deployment produces standard-conformant output rather than something that merely looks plausible.

## How Quantum Vault tracks the standards

Quantum Vault's commitment is to implement the NIST standards faithfully and to remain agile as they evolve. The standardisation process is ongoing — NIST continues to evaluate additional algorithms (for example, signature schemes built on different mathematical foundations to diversify away from a single problem family). A credible PQC product cannot pin itself to one algorithm forever.

That is why Quantum Vault embeds algorithm and parameter-set identifiers in every token rather than hard-coding a single scheme. When a new standard lands, or when a parameter set should be retired, the change is a configuration and key-rotation exercise, not a rewrite:

```ts
import { QuantumVault } from '@tekivex/quantum-vault'

const vault = new QuantumVault({
  // Standards referenced by name; swapping them is a config change
  signingAlg: 'ML-DSA-65', // FIPS 204
  kemAlg: 'ML-KEM-768',    // FIPS 203
})

// Tokens self-describe their algorithm, so verifiers stay forward-compatible
const token = await vault.issue({ sub: 'svc-1', exp: nextHour() })
const { alg } = await vault.verify(token)
console.log(alg) // 'ML-DSA-65'
```

This crypto-agility is the same mechanism that makes algorithm migration tractable, covered in the [migration playbook](/use-cases/quantum-vault-migrate-pqc-token-issuance), and it pairs naturally with self-hosted key custody in [sovereign token verification](/use-cases/quantum-vault-sovereign-token-verification).

Quantum Vault is in beta, and we are explicit that PQC standards and implementations are still maturing. Tracking the standards — rather than a frozen snapshot or a bespoke scheme — is how we keep that maturation an upgrade path instead of a breaking change.

## Key takeaways

- NIST's open, adversarial competition concentrated global cryptanalysis on a few candidates; the survivors carry an evidentiary record no in-house scheme can match.
- **FIPS 203 (ML-KEM)** standardises key encapsulation from Kyber; **FIPS 204 (ML-DSA)** standardises signatures from Dilithium. Both are lattice-based and were finalised in August 2024.
- Standardisation delivers cryptanalysis, test vectors, interoperability, and compliance — none of which a roll-your-own scheme provides.
- The expensive, error-prone parts of PQC are implementation details (constant-time, sampling, side channels); a standard plus published test vectors is how you get them right.
- Quantum Vault implements both standards and keeps algorithms identifier-driven so evolving standards are an upgrade, not a rewrite.

Choosing standardised PQC is the conservative, defensible choice — exactly what you want for infrastructure protecting two decades of data. Explore the related [use cases](/use-cases), read how the primitives work in [post-quantum tokens explained](/use-cases/quantum-vault-post-quantum-tokens-explained), or start on the [Quantum Vault product page](/product/quantum-vault).
