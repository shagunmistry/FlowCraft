# Maintenance Mode

This project is in **low-maintenance mode** as of 2026-05-26.

## What this means

- No new features.
- Security patches only.
- Bug fixes only if they affect paying subscribers.

## Active surface

- Paying Stripe subscribers can still generate diagrams (web app + AI).
- Free users are blocked from AI generation routes with HTTP 402. They can still sign up, browse public diagrams, and view shared diagrams.
- AI generation routes (`/api/generate-diagram`, `/api/generate-visual`, `/api/generate-visual-stream`, `/api/generate-image`, `/api/edit-image`, `/api/diagram-chat`, `/api/regenerate-diagram`) gate on `users.subscribed === true`.

## Do not

- Re-enable the free tier without auditing AI cost (it was the reason for this freeze).
- Add new AI endpoints without the same `subscribed` gate.
- Touch the engagement features (`diagram_likes`, `diagram_saves`, `shareable_links`, blog) — left intentionally dormant.

## Reinstating active development

If returning to active development, audit:
1. AI usage cost from the last 90 days (OpenAI + Anthropic + Replicate dashboards).
2. Stripe MRR.
3. VS Code extension acquisition trend.
