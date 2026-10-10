import { solvePow } from './pow'

/** Solve the PoW off the main thread; fall back to inline if Workers fail. */
export function solveInWorker(challenge: string, bits: number): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const worker = new Worker(new URL('./pow.worker.ts', import.meta.url))
      worker.onmessage = (e: MessageEvent<string | null>) => {
        worker.terminate()
        resolve(e.data)
      }
      worker.onerror = () => {
        worker.terminate()
        resolve(solvePow(challenge, bits))
      }
      worker.postMessage({ challenge, bits })
    } catch {
      resolve(solvePow(challenge, bits))
    }
  })
}
