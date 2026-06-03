---
name: web2wave-design-to-quiz
description: Convert a Figma file, screenshot, or design brief into a published web2wave quiz — plan screens, generate JSON, validate, publish, render, and fix visual gaps. Use when the user says "build this design in web2wave", shares a Figma URL, or wants a vision-driven design-to-quiz loop.
---

# Design → web2wave quiz

End-to-end pipeline: **design source → plan → JSON → validate → publish → render → diff → fix → re-render**.

## Inputs (any of)

- Figma URL → use Figma MCP to list frames; pass as `custom_screens` to `web2wave_plan_quiz_from_design`
- Screenshot attached to chat → describe screens manually, then plan
- Text brief → `web2wave_get_design_brief({ kind: "quiz" })` as seed for a visual tool, or plan directly

## Steps

1. **Brief & constraints** — load `conversion-playbook.md` + `quiz-schema.md` via `web2wave_get_authoring_guide`.
2. **Plan** — `web2wave_plan_quiz_from_design({ custom_screens: [{ id, purpose, notes }] })`.
3. **Blocks** — `web2wave_describe_block` for every recommended type.
4. **Assets** — remote or local images → `web2wave_upload_project_files` → paste hosted URLs into block fields.
5. **Assemble** — screens JSON; anchor on `web2wave_get_quiz_example` when helpful.
6. **Validate** — `web2wave_validate_quiz_json` until `ok: true`.
7. **Confirm with user** before first publish on an existing production quiz.
8. **Publish** — `web2wave_create_quiz_with_screens` (new) or `web2wave_update_quiz_screens` (existing).
9. **Verify** — `web2wave_render_quiz_screen` on 2–3 key screens; vision-compare to source.
10. **Fix gaps** — theme variables first (`web2wave_set_quiz_theme_variables`), then `web2wave_patch_block_css_variables`, then `web2wave_apply_quiz_css_overrides` as last resort.

## Prompt shortcuts

These MCP prompts orchestrate the same flow:

- `web2wave-design-to-quiz`
- `web2wave-iterate-quiz-design`
- `web2wave-clone-funnel-from-url` (competitor URL → crawl → rebuild)

## Figma side-by-side

Configure Figma MCP (`https://mcp.figma.com/mcp`) in addition to web2wave. The model reads frames from Figma and writes into web2wave — tokens never cross servers.

## Paywalls

Same pipeline with paywall block schema (`web2wave://schema/blocks-paywall.json`), `web2wave_create_paywall_with_screens`, and paywall theme/CSS tools.

## Templates v1 → v2

When the user asks to migrate/upgrade templates without touching the source quiz:

`web2wave_migrate_templates_v1_to_v2({ target: "quiz", source_id })` — creates a new v2 row; source unchanged. Follow with theme variable mapping from `templates-v1-to-v2-css.md` unless the user said "screens only".
