import { solvePow } from './pow'

self.onmessage = (e: MessageEvent<{ challenge: string; bits: number }>) => {
  self.postMessage(solvePow(e.data.challenge, e.data.bits))
}
