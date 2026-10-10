# Landing "Try it" generator Implementation Plan

> **For agentic workers:** execute task-by-task (superpowers:executing-plans). Steps use checkbox syntax.

**Goal:** Anonymous diagram generator in the landing hero backed by the existing `/v2/free/*` API.

**Architecture:** Pure TS modules (sha256, PoW solver, device id, API client) with unit tests; a Web Worker runs the solver; one client component owns the state machine and renders via the existing `Templates/MermaidViewer`.

**Tech Stack:** Next 15, React 19, vitest (new devDependency), existing mermaid.

**Spec:** `docs/superpowers/specs/2026-10-10-landing-try-it-generator-design.md`

## Global Constraints
- API base: `process.env.NEXT_PUBLIC_FLOWCRAFT_API` (no trailing `/v2`); endpoints `/v2/free/challenge`, `/v2/free/generate`.
- PoW: `sha256("{challenge}:{nonce}")` needs `difficulty` leading zero bits; nonce is a decimal string.
- Types: flowchart, sequence, class, state, er, mindmap.
- Generator hidden unless a challenge fetch succeeds; never throw into the hero.
- No co-author line in commits.

## Review Focus
- localStorage throws (private mode) → still works with an ephemeral device id.
- Challenge older than 90s at submit → refetch before solving.
- Empty/whitespace prompt → Generate disabled, no request.
- Mermaid render failure on returned code → inline retry message, no crash.
- 429 → sign-up CTA, not a generic error.

### Task 1: vitest + SHA-256 + PoW solver
**Files:** Create `vitest.config.ts`, `src/lib/free-taste/sha256.ts`, `src/lib/free-taste/pow.ts`, `src/lib/free-taste/__tests__/pow.test.ts`; Modify `package.json` (devDep `vitest`, script `test`).
**Produces:** `sha256(data: Uint8Array): Uint8Array`; `leadingZeroBits(d: Uint8Array): number`; `solvePow(challenge: string, bits: number, maxIter?: number): string | null`.
- [ ] Failing tests: sha256 equals node `crypto` for "", "abc", 300-byte input; `solvePow(ch, 12)` result satisfies node-crypto verification; returns null when `maxIter` too small.
- [ ] Implement; run `pnpm test`; commit.

### Task 2: device id + API client
**Files:** Create `src/lib/free-taste/device.ts`, `src/lib/free-taste/client.ts`, `src/lib/free-taste/__tests__/client.test.ts`.
**Produces:** `getDeviceId(): string`; `fetchChallenge(): Promise<{challenge,difficulty}>`; `generateFree({prompt,type,challenge,nonce,deviceId}): Promise<{mermaidCode,remaining}>`; errors `FreeTasteQuotaError(remaining)`, `FreeTasteUnavailableError`, `FreeTasteExpiredError`, `FreeTasteGenerationError`.
- [ ] Failing tests with mocked fetch: 200, 429 → quota error with remaining, 503 → unavailable, 400 invalid_or_expired_challenge → expired, 502 → generation error, network reject → unavailable; getDeviceId survives a throwing localStorage and is stable when storage works.
- [ ] Implement; tests pass; commit.

### Task 3: Worker + component + hero wiring
**Files:** Create `src/lib/free-taste/pow.worker.ts`, `src/components/Landing/TryItGenerator.client.tsx`; Modify `src/components/Landing/Main.landing.tsx` (render under hero CTA row, unauthenticated users only).
- [ ] Component: on mount `fetchChallenge()`; failure → render null. Idle/solving/generating/done/error states, type chips, 3 example prompts, remaining counter, result in `MermaidViewer`, sign-up CTA, code stashed to `localStorage['flowcraft:free-taste:last']` (try/catch).
- [ ] `pnpm lint` and `tsc --noEmit` clean; commit.

### Task 4: Local end-to-end
- [ ] Run API locally with `FREE_TASTE_HMAC_SECRET` set; run `pnpm dev:local`; verify render, quota 429 after 5 tries, fallback when API stopped. Record results.

### Task 5: Rollout (authorized by owner on 2026-10-10)
- [ ] Push API commits, set `FREE_TASTE_HMAC_SECRET` on Cloud Run, deploy, verify `/v2/free/challenge` is 200.
- [ ] Only then push web `main`; verify hero generator live and `get_runtime_errors` clean.
