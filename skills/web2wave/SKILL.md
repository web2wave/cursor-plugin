---
name: web2wave
description: Operate the web2wave platform via MCP — quizzes, paywalls, subscriptions, analytics, experiments, translations, and browser automation. Use when the user mentions web2wave, quiz funnels, paywalls, w2w, or needs to manage their web2wave project from Cursor.
---

# web2wave MCP

This plugin connects Cursor to [web2wave](https://web2wave.com) via the hosted MCP at `https://mcp.web2wave.com/mcp`.

## First-time setup

1. Install the plugin from the Cursor Marketplace (or clone this repo).
2. Enable the **web2wave** MCP server — Cursor opens OAuth in the browser.
3. Paste your project API key (Cabinet → Project Settings → API) and click **Authorize**.
4. Use a vision-capable model when calling `web2wave_render_quiz_screen` or comparing designs.

Alternative (local stdio, no OAuth):

```json
{
  "mcpServers": {
    "web2wave": {
      "command": "npx",
      "args": ["-y", "@web2wave/mcp"],
      "env": { "WEB2WAVE_API_KEY": "your-project-key" }
    }
  }
}
```

## Recommended workflow

1. **Unfamiliar operation** → `web2wave_search_docs`.
2. **Curated actions** → use `web2wave_*` tools (quizzes, paywalls, subscriptions, reports, experiments, email, prices, files).
3. **Anything else** → `web2wave_list_endpoints` → `web2wave_describe_endpoint` → `web2wave_api_call`.

## Authoring quizzes / paywalls

Load the `web2wave-quiz-authoring` or `web2wave-design-to-quiz` skill for JSON generation workflows.

Quick pipeline:

1. `web2wave_get_authoring_guide({ id: "conversion-playbook.md" })` + `quiz-schema.md`
2. `web2wave_plan_quiz_from_design` (pass `custom_screens` from Figma MCP if available)
3. `web2wave_describe_block` for every block type you use
4. Assemble screens JSON
5. **`web2wave_validate_quiz_json`** — must return `ok: true` before publish
6. `web2wave_create_quiz_with_screens` / `web2wave_update_quiz_screens` (or paywall equivalents)

## Preview URLs

Never hand-craft preview hosts. Always use `preview_url` / `view_url` from API responses, or call `web2wave_get_quiz_preview_url` / `web2wave_get_paywall_preview_url`.

## Visual iteration loop

1. `web2wave_render_quiz_screen` with the preview URL
2. Diff against source design (vision)
3. Fix in order: theme variables → per-block CSS variables → raw CSS overrides
4. Re-render until acceptable

## Figma

Use the official Figma MCP alongside this plugin. Extract frames there, pass to `web2wave_plan_quiz_from_design`. The Figma token stays in the Figma MCP — web2wave never sees it.

## A/B experiments

Use the `web2wave-experiments` skill, or:

1. `web2wave_list_experiments` → `web2wave_get_experiment`
2. `web2wave_summarize_experiment({ id, primary_metric: "conversion_to_subscribe" })`
3. Prompt `web2wave-experiment-readout` for a Slack-ready write-up

## Safety

Destructive tools (delete, cancel, refund, charge) are disabled unless the server runs with `WEB2WAVE_MCP_ALLOW_DESTRUCTIVE=1`.

## Grounding resources

Read when needed:

- `web2wave://project/summary`
- `web2wave://openapi/spec.json`
- `web2wave://schema/blocks.json`
- `web2wave://guides/*`
