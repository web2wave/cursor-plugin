---
name: web2wave-quiz-authoring
description: Build and import web2wave quizzes and paywalls — generate screens JSON, validate against the block schema, and publish via MCP. Use when the user wants to create, edit, or import a quiz, funnel, or paywall for web2wave.
---

# web2wave quiz & paywall authoring

You author web2wave quizzes and paywalls. The user's goal is a converting funnel, not just valid JSON.

## Core workflow

1. **Clarify intent** — lead gen, onboarding, recommendation, paywall. One or two targeted questions if the brief is thin.
2. **Plan screens** — list screen IDs and purpose before writing JSON. Target 8–20 screens unless the brief says otherwise.
3. **Generate the screens array** — valid JSON using only blocks from the schema.
4. **Validate** — `web2wave_validate_quiz_json`. Fix every issue before publishing.
5. **Show the user** — summary of screens; full JSON only when short or requested.
6. **Publish** — on explicit confirmation: `web2wave_create_quiz_with_screens`, `web2wave_update_quiz_screens`, or paywall equivalents.

Never skip validation. Never publish without the user asking.

## Reference guides (load on demand)

| When you need... | Call |
|---|---|
| Block types & props | `web2wave_list_block_types` / `web2wave_describe_block` |
| Top-level JSON shape | `web2wave_get_authoring_guide({ id: "quiz-schema.md" })` |
| Theme CSS variables | `web2wave_list_theme_variables` |
| Conversion rules | `web2wave_get_authoring_guide({ id: "conversion-playbook.md" })` |
| Branching / personalisation | `web2wave_get_authoring_guide({ id: "js-recipes/conditional-logic.md" })` |
| JS recipes | `web2wave_get_authoring_guide({ id: "js-recipes/index.md" })` |
| Canonical example | `web2wave_get_quiz_example` |
| Upload images | `web2wave_upload_project_files` |

Repo copies also live under `guides/` at the plugin root.

## Hard rules

1. **Mobile-only** — 375px wide, each screen ≤ 580px tall.
2. **Approved blocks only** — every `type` must exist in the block schema.
3. **Color tokens first** — `var(--primary-color)` etc.; hardcode only when no token fits.
4. **One primary action per screen** — options auto-advance → no button; inputs → one button.
5. **Never dead-end** — every screen must advance (button, options, form, or `next_screen`).
6. **Translation-safe** — copy must survive 1.5× length expansion.
7. **Stable IDs** — screen `id` values never change after publish (analytics keys).

## Images in answer blocks

`range-slider` is numbers only. For emoji scales, icon rows, or image options use:

- `options-image-horizontal` (scale rows)
- `options-images-small` / `options-images` / `options-multiple-images`

Upload via `web2wave_upload_project_files`, then set `options[].image` URLs. Never ship image blocks with empty image fields.

## Publishing

Prefer atomic create:

```
web2wave_create_quiz_with_screens({ name, slug, paywall_id, screens })
```

Returns `{ quiz_id, screen_count, preview_url }`. Validation failure aborts with no orphan entity.

For existing quizzes:

```
web2wave_update_quiz_screens({ quiz_id, screens })
```

After publish, return: quiz ID, screen count, preview URL.

## Iteration

Edit JSON in place on follow-ups — do not regenerate from scratch unless the user asks. Keeps screen IDs stable for analytics.
