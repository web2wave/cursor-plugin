# web2wave Cursor Plugin

Official [Cursor](https://cursor.com) plugin for [web2wave](https://web2wave.com) — quiz funnels, paywalls, subscriptions, analytics, and A/B experiments.

Includes:

- **MCP server** — hosted at `https://mcp.web2wave.com/mcp` (OAuth + PKCE)
- **Skills** — quiz authoring, design-to-quiz pipeline, experiment readouts
- **Workflows** — validated publish paths, preview URLs, visual iteration loops

The MCP server implementation lives in [web2wave/web2wave-mcp](https://github.com/web2wave/web2wave-mcp).

## Install

1. Open **Cursor Settings → Plugins** (or install from the Cursor Marketplace once listed).
2. Add this repository: `https://github.com/web2wave/cursor-plugin`
3. Enable the **web2wave** MCP server when prompted.
4. Authorize with your project API key (Cabinet → Project Settings → API).

Cursor opens a browser OAuth page — paste your API key once; the token is stored for subsequent sessions.

## MCP server

Remote (default, configured in `mcp.json`):

```json
{
  "mcpServers": {
    "web2wave": {
      "type": "http",
      "url": "https://mcp.web2wave.com/mcp"
    }
  }
}
```

Local stdio alternative (for development):

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

See [web2wave-mcp README](https://github.com/web2wave/web2wave-mcp#install--run) for all auth modes and environment variables.

## Skills

| Skill | Use when... |
|---|---|
| `web2wave` | General MCP workflows — API discovery, previews, safety model |
| `web2wave-quiz-authoring` | Creating or editing quiz/paywall screens JSON |
| `web2wave-design-to-quiz` | Figma/screenshot → published quiz with visual QA loop |
| `web2wave-experiments` | A/B experiment analysis and ship/keep-running verdicts |

Pair with the [Figma Cursor plugin](https://github.com/figma/mcp-server-guide) when the design source is Figma.

## Validate locally

```bash
node scripts/validate-plugin.mjs
```

## Submit to Cursor Marketplace

- Valid `.cursor-plugin/plugin.json` and `mcp.json`
- Logo at `assets/logo.svg`
- Skills with YAML frontmatter (`name`, `description`)
- Contact Cursor: Slack or `kniparko@anysphere.com`

## License

MIT
