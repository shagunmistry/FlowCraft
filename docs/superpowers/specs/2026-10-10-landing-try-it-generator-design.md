# Landing page "Try it" generator — design

Date: 2026-10-10 · Status: approved in chat, pending spec review

## Goal
Raise the `/` → `/sign-up` conversion (about 4% over the 30 days to 2026-10-10: 552 visitors on `/`, 20 on `/sign-up`). A visitor describes a diagram on the landing page and sees it rendered in seconds, with no account, then is prompted to sign up to save, edit and export.

## Non-goals (v1)
- Importing the generated diagram into the user's account after sign-up (the CTA only links to `/sign-up`; check `src/lib/templates/handoff.ts` for a cheap follow-up).
- New diagram types beyond the 6 the API accepts.
- Any change to the authenticated generator.

## Existing backend (reused, not modified)
`flowcraft-api/src/v2/free_taste.py`, mounted at `/v2`:
- `GET /v2/free/challenge` → `{challenge, difficulty, expires}` (HMAC-signed, 120s TTL)
- `POST /v2/free/generate` `{device_id, challenge_token, pow_nonce, title, description, type}` → `{mermaid_code, remaining}`; 400 invalid/expired challenge or PoW or type, 429 `{detail:{reason,remaining}}`, 502 generation failed, 503 disabled (no `FREE_TASTE_HMAC_SECRET`).
- Proof of work: `sha256("{challenge_token}:{nonce}")` must have `difficulty` leading zero bits (default 18).
- Quota: 5 per `device_id`, 15 per IP per day. Types: flowchart, sequence, class, state, er, mindmap.
- CORS already allows flowcraft.app, www and localhost:3000.

**Not deployed:** production returns 404 for `/v2/free/challenge`. The API commits (`8b9b89e` and later) are unpushed and need a manual Cloud Run deploy plus a `FREE_TASTE_HMAC_SECRET`.

## Design
### User flow
1. A compact generator in the landing hero: textarea, 6 type chips, 3 example prompts.
2. Generate → fetch challenge → solve PoW in a Web Worker → POST generate.
3. Render the Mermaid code with the existing Mermaid viewer component.
4. Below the result: "Sign up free to save, edit and export", linking to `/sign-up`. The code is stashed in `localStorage` for a later handoff.

### Components
| Unit | Purpose | Depends on |
|---|---|---|
| `src/components/Landing/TryItGenerator.client.tsx` | UI and state machine: idle, solving, generating, done, error variants | client, device, Mermaid viewer |
| `src/lib/free-taste/client.ts` | challenge and generate calls, maps statuses to typed results/errors | fetch, `NEXT_PUBLIC_FLOWCRAFT_API` |
| `src/lib/free-taste/pow.worker.ts` | find a nonce with a synchronous SHA-256 (about 260k hashes at 18 bits) | none |
| `src/lib/free-taste/device.ts` | UUID `device_id` in `localStorage`, safe if storage throws | none |

`Main.landing.tsx` imports `TryItGenerator` into the hero; no other restructuring.

### Decisions
- Browser calls the API directly (no Next proxy): Cloud Run sees the real client IP for the per-IP cap.
- Quota limits are owned by the backend; the UI only displays `remaining`.
- Sync SHA-256 in the worker (not `crypto.subtle`) to avoid async overhead per hash.

### Errors
- 429: "You've used your free tries" + sign-up CTA.
- 503, network failure or Worker failure: hide the generator and fall back to the existing hero CTA.
- 400 expired challenge: refetch once and retry.
- 502, or Mermaid failing to render: friendly retry message.

## Rollout
1. Build and test the UI against a local API (`pnpm dev:local`, API on :8000 with a local `FREE_TASTE_HMAC_SECRET`).
2. Gated steps needing the owner's approval: push the API commits; set a random `FREE_TASTE_HMAC_SECRET` on Cloud Run; manual `gcloud run deploy`; verify `/v2/free/challenge` returns 200.
3. Only then push the web change (Vercel auto-deploys on push to main), so the live hero never calls a missing endpoint. Until step 2 completes, the generator must stay hidden (feature check via a successful challenge fetch).

## Testing
- Unit: PoW solver output passes the Python `verify_pow` for fixed challenges.
- Component: state machine with mocked fetch (success, 429, 503, network error, expired challenge).
- Manual E2E: local API + web; confirm render, 429 after 5 tries, and the fallback when the API is stopped.

## Success criteria
`/` → `/sign-up` conversion measured in Vercel Analytics 2 weeks after rollout; no new runtime errors from the generator; no abuse of the quota (check the free-quota table).
