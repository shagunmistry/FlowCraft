import { sha256 } from './sha256'

export function leadingZeroBits(digest: Uint8Array): number {
  let bits = 0
  for (const byte of digest) {
    if (byte === 0) {
      bits += 8
      continue
    }
    return bits + Math.clz32(byte) - 24
  }
  return bits
}

/**
 * Find a decimal-string nonce such that sha256("{challenge}:{nonce}") has at
 * least `bits` leading zero bits — mirrors verify_pow in
 * flowcraft-api/src/v2/free_taste_pow.py. Returns null if `maxIter` is hit.
 */
export function solvePow(
  challenge: string,
  bits: number,
  maxIter = 50_000_000,
): string | null {
  const enc = new TextEncoder()
  for (let n = 0; n < maxIter; n++) {
    const nonce = String(n)
    if (leadingZeroBits(sha256(enc.encode(`${challenge}:${nonce}`))) >= bits) {
      return nonce
    }
  }
  return null
}
