import { FREE_TASTE_TYPES, type FreeTasteType } from './client'

/** Max prompt length carried in a URL (the generator input allows far more). */
export const PREFILL_MAX_CHARS = 300

// Template type ids (src/lib/templates/types.ts) to the free-taste types.
const TEMPLATE_TO_FREE: Record<string, FreeTasteType> = {
  flowchart: 'flowchart',
  sequenceDiagram: 'sequence',
  classDiagram: 'class',
  stateDiagram: 'state',
  entityRelationshipDiagram: 'er',
  mindmaps: 'mindmap',
}

export function templateTypeToFreeTaste(templateTypeId: string): FreeTasteType {
  return TEMPLATE_TO_FREE[templateTypeId] ?? 'flowchart'
}

/** Landing-page URL that opens the try-it generator with a prompt prefilled. */
export function buildTryItHref(opts: {
  title: string
  description: string
  templateTypeId: string
  src: string
}): string {
  const prompt = `${opts.title}: ${opts.description}`.slice(0, PREFILL_MAX_CHARS)
  const params = new URLSearchParams({
    prompt,
    type: templateTypeToFreeTaste(opts.templateTypeId),
    src: opts.src,
  })
  return `/?${params.toString()}#try`
}

/** Read and validate prefill params from a query string. Returns null if absent. */
export function parsePrefill(
  search: string,
): { prompt: string; type: FreeTasteType; src: string } | null {
  const params = new URLSearchParams(search)
  const prompt = params.get('prompt')?.trim().slice(0, PREFILL_MAX_CHARS)
  if (!prompt) return null
  const rawType = params.get('type')
  const type = (FREE_TASTE_TYPES as readonly string[]).includes(rawType ?? '')
    ? (rawType as FreeTasteType)
    : 'flowchart'
  const rawSrc = params.get('src') ?? ''
  const src = /^[a-z0-9-]{1,32}$/.test(rawSrc) ? rawSrc : 'direct'
  return { prompt, type, src }
}

export const FREE_TASTE_STORAGE_KEY = 'flowcraft:free-taste:last'

// Free-taste types to the `diagrams.type` ids used by saved mermaid diagrams.
const FREE_TO_DIAGRAM: Record<FreeTasteType, string> = {
  flowchart: 'flowchart',
  sequence: 'sequenceDiagram',
  class: 'classDiagram',
  state: 'stateDiagram',
  er: 'entityRelationshipDiagram',
  mindmap: 'mindmaps',
}

export function freeTasteTypeToDiagramType(type: string): string | null {
  return (FREE_TO_DIAGRAM as Record<string, string>)[type] ?? null
}
