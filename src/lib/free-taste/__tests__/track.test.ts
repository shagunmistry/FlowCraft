import { beforeEach, describe, expect, it, vi } from 'vitest'

const calls: unknown[][] = []
let boom = false
const trackMock = Object.assign(
  (...a: unknown[]) => {
    if (boom) throw new Error('blocked by adblock')
    calls.push(a)
  },
  { reset: () => { calls.length = 0; boom = false } },
)
vi.mock('@vercel/analytics', () => ({ track: (...a: unknown[]) => trackMock(...a) }))

import { promptLenBucket, trackTryIt } from '../track'

beforeEach(() => trackMock.reset())

describe('trackTryIt', () => {
  it('forwards the event name and primitive props', () => {
    trackTryIt('try_it_succeeded', { type: 'flowchart', remaining: 4, secs: 12 })
    expect(calls).toEqual([['try_it_succeeded', { type: 'flowchart', remaining: 4, secs: 12 }]])
  })
  it('drops undefined/null/object props so the payload stays valid', () => {
    trackTryIt('try_it_failed', { type: 'er', kind: undefined, x: null, o: {} } as any)
    expect(calls).toEqual([['try_it_failed', { type: 'er' }]])
  })
  it('sends no props object when there are none', () => {
    trackTryIt('try_it_shown')
    expect(calls).toEqual([['try_it_shown', undefined]])
  })
  it('never throws if analytics throws', () => {
    boom = true
    expect(() => trackTryIt('try_it_shown')).not.toThrow()
  })
})

describe('promptLenBucket', () => {
  it.each([
    [0, '0-19'],
    [19, '0-19'],
    [20, '20-79'],
    [79, '20-79'],
    [80, '80-299'],
    [299, '80-299'],
    [300, '300+'],
  ])('%i chars -> %s', (n, b) => expect(promptLenBucket(n)).toBe(b))
})
