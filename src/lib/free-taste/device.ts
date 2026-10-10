const KEY = 'flowcraft:device-id'
let ephemeral: string | null = null

function newId(): string {
  const c = globalThis.crypto
  return c?.randomUUID ? c.randomUUID() : `d${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

/** Stable per-browser id for the free-taste quota. Falls back to a
 *  per-page-load id when localStorage is unavailable (private mode). */
export function getDeviceId(): string {
  try {
    const existing = localStorage.getItem(KEY)
    if (existing && existing.length >= 8) return existing
    const id = newId()
    localStorage.setItem(KEY, id)
    return id
  } catch {
    return (ephemeral ??= newId())
  }
}
