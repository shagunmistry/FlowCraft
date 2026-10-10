import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { sha256 } from '../sha256'
import { leadingZeroBits, solvePow } from '../pow'

const nodeSha = (b: Uint8Array) =>
  new Uint8Array(createHash('sha256').update(b).digest())

describe('sha256', () => {
  it.each([0, 3, 55, 56, 64, 300])('matches node crypto for %i bytes', (n) => {
    const data = new Uint8Array(n).map((_, i) => (i * 7 + 3) & 0xff)
    expect(Array.from(sha256(data))).toEqual(Array.from(nodeSha(data)))
  })
})

describe('leadingZeroBits', () => {
  it('counts across bytes', () => {
    expect(leadingZeroBits(new Uint8Array([0, 0b00010000]))).toBe(11)
    expect(leadingZeroBits(new Uint8Array([0xff]))).toBe(0)
    expect(leadingZeroBits(new Uint8Array([0, 0]))).toBe(16)
  })
})

describe('solvePow', () => {
  it('finds a nonce the server-side check accepts', () => {
    const challenge = 'eyJuIjoiYWJjIiwidCI6MX0.deadbeef'
    const nonce = solvePow(challenge, 12)
    expect(nonce).not.toBeNull()
    const d = nodeSha(new TextEncoder().encode(`${challenge}:${nonce}`))
    expect(leadingZeroBits(d)).toBeGreaterThanOrEqual(12)
  })
  it('returns null when the iteration budget is too small', () => {
    expect(solvePow('x.y', 30, 10)).toBeNull()
  })
})
