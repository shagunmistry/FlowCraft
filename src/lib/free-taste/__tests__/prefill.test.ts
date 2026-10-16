import { describe, expect, it } from 'vitest'
import {
  PREFILL_MAX_CHARS,
  buildTryItHref,
  freeTasteTypeToDiagramType,
  parsePrefill,
  templateTypeToFreeTaste,
} from '../prefill'

describe('prefill', () => {
  it('maps template types, defaulting unknown ones to flowchart', () => {
    expect(templateTypeToFreeTaste('sequenceDiagram')).toBe('sequence')
    expect(templateTypeToFreeTaste('gantt')).toBe('flowchart')
  })

  it('round-trips a built href through parsePrefill', () => {
    const href = buildTryItHref({
      title: 'Code review',
      description: 'How a PR gets reviewed & merged',
      templateTypeId: 'stateDiagram',
      src: 'template',
    })
    expect(href.endsWith('#try')).toBe(true)
    const search = href.slice(1, href.indexOf('#'))
    expect(parsePrefill(search)).toEqual({
      prompt: 'Code review: How a PR gets reviewed & merged',
      type: 'state',
      src: 'template',
    })
  })

  it('caps prompt length and rejects bad type and src', () => {
    const long = 'x'.repeat(PREFILL_MAX_CHARS + 50)
    const p = parsePrefill(`?prompt=${long}&type=evil&src=Bad Src!`)
    expect(p?.prompt.length).toBe(PREFILL_MAX_CHARS)
    expect(p?.type).toBe('flowchart')
    expect(p?.src).toBe('direct')
  })

  it('returns null without a prompt', () => {
    expect(parsePrefill('?type=class')).toBeNull()
  })

  it('maps free-taste types to saved diagram types', () => {
    expect(freeTasteTypeToDiagramType('er')).toBe('entityRelationshipDiagram')
    expect(freeTasteTypeToDiagramType('nope')).toBeNull()
  })
})
