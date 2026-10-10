export class FreeTasteUnavailableError extends Error {
  name = 'FreeTasteUnavailableError'
}
export class FreeTasteExpiredError extends Error {
  name = 'FreeTasteExpiredError'
}
export class FreeTasteGenerationError extends Error {
  name = 'FreeTasteGenerationError'
}
export class FreeTasteQuotaError extends Error {
  name = 'FreeTasteQuotaError'
  constructor(public remaining: number) {
    super('quota')
  }
}

export const FREE_TASTE_TYPES = [
  'flowchart',
  'sequence',
  'class',
  'state',
  'er',
  'mindmap',
] as const
export type FreeTasteType = (typeof FREE_TASTE_TYPES)[number]

const base = () => process.env.NEXT_PUBLIC_FLOWCRAFT_API ?? ''

async function call(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init)
  } catch {
    throw new FreeTasteUnavailableError('network')
  }
}

export async function fetchChallenge(): Promise<{ challenge: string; difficulty: number }> {
  const res = await call(`${base()}/v2/free/challenge`)
  if (!res.ok) throw new FreeTasteUnavailableError(String(res.status))
  const j = (await res.json()) as { challenge: string; difficulty: number }
  return { challenge: j.challenge, difficulty: j.difficulty }
}

export async function generateFree(a: {
  prompt: string
  type: string
  challenge: string
  nonce: string
  deviceId: string
}): Promise<{ mermaidCode: string; remaining: number }> {
  const res = await call(`${base()}/v2/free/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      device_id: a.deviceId,
      challenge_token: a.challenge,
      pow_nonce: a.nonce,
      title: a.prompt.slice(0, 80),
      description: a.prompt.slice(0, 10000),
      type: a.type,
    }),
  })
  if (res.status === 429) {
    const b = (await res.json().catch(() => ({}))) as { detail?: { remaining?: number } }
    throw new FreeTasteQuotaError(b.detail?.remaining ?? 0)
  }
  if (res.status === 503) throw new FreeTasteUnavailableError('503')
  if (res.status === 400) {
    const b = (await res.json().catch(() => ({}))) as { detail?: string }
    if (b.detail === 'invalid_or_expired_challenge') throw new FreeTasteExpiredError('expired')
    throw new FreeTasteGenerationError(b.detail ?? 'bad_request')
  }
  if (!res.ok) throw new FreeTasteGenerationError(String(res.status))
  const j = (await res.json()) as { mermaid_code: string; remaining: number }
  return { mermaidCode: j.mermaid_code, remaining: j.remaining }
}
