import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  FreeTasteExpiredError,
  FreeTasteGenerationError,
  FreeTasteQuotaError,
  FreeTasteUnavailableError,
  fetchChallenge,
  generateFree,
} from '../client'
import { getDeviceId } from '../device'

const json = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }))
const args = {
  prompt: 'login flow',
  type: 'flowchart',
  challenge: 'c.s',
  nonce: '7',
  deviceId: 'device-12345',
}

afterEach(() => vi.unstubAllGlobals())

describe('fetchChallenge', () => {
  it('returns challenge and difficulty', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(200, { challenge: 'c.s', difficulty: 18, expires: 1 })))
    expect(await fetchChallenge()).toEqual({ challenge: 'c.s', difficulty: 18 })
  })
  it('maps 503 and network errors to unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(503, { detail: 'free_taste_disabled' })))
    await expect(fetchChallenge()).rejects.toBeInstanceOf(FreeTasteUnavailableError)
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('net'))))
    await expect(fetchChallenge()).rejects.toBeInstanceOf(FreeTasteUnavailableError)
  })
})

describe('generateFree', () => {
  it('returns mermaid code and remaining', async () => {
    const f = vi.fn(() => json(200, { mermaid_code: 'graph TD;A-->B', remaining: 4 }))
    vi.stubGlobal('fetch', f)
    expect(await generateFree(args)).toEqual({ mermaidCode: 'graph TD;A-->B', remaining: 4 })
    const body = JSON.parse((f.mock.calls[0] as any)[1].body)
    expect(body).toMatchObject({
      device_id: 'device-12345',
      challenge_token: 'c.s',
      pow_nonce: '7',
      description: 'login flow',
      type: 'flowchart',
    })
  })
  it('429 -> quota error with remaining', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(429, { detail: { reason: 'device', remaining: 0 } })))
    await expect(generateFree(args)).rejects.toMatchObject({ name: 'FreeTasteQuotaError', remaining: 0 })
    await expect(generateFree(args)).rejects.toBeInstanceOf(FreeTasteQuotaError)
  })
  it('400 expired challenge -> expired error', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(400, { detail: 'invalid_or_expired_challenge' })))
    await expect(generateFree(args)).rejects.toBeInstanceOf(FreeTasteExpiredError)
  })
  it('502 and other 4xx -> generation error; 503 / network -> unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(502, { detail: 'generation_failed' })))
    await expect(generateFree(args)).rejects.toBeInstanceOf(FreeTasteGenerationError)
    vi.stubGlobal('fetch', vi.fn(() => json(503, {})))
    await expect(generateFree(args)).rejects.toBeInstanceOf(FreeTasteUnavailableError)
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('net'))))
    await expect(generateFree(args)).rejects.toBeInstanceOf(FreeTasteUnavailableError)
  })
})

describe('getDeviceId', () => {
  it('is stable when storage works', () => {
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    })
    const a = getDeviceId()
    expect(a.length).toBeGreaterThanOrEqual(8)
    expect(getDeviceId()).toBe(a)
  })
  it('still returns an id when localStorage throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('denied') },
      setItem: () => { throw new Error('denied') },
    })
    expect(getDeviceId().length).toBeGreaterThanOrEqual(8)
  })
})
