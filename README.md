<div align="center">

<img src="assets/hero.png" alt="BotLaunch AI Companion — connect an AI assistant to your Telegram bot and Mini App shop" width="100%" />

# BotLaunch AI Companion

**Build and run a Telegram bot & Mini App shop by just talking to an AI.**

Connect [BotLaunch](https://www.botlaunch.io) to Claude, ChatGPT, or Cursor with a personal
API key, then describe what you want in plain language — the AI does the setup for you.

[Website](https://www.botlaunch.io) · [API Docs](https://www.botlaunch.io/docs/api) · [Get an API key](https://panel.botlaunch.io/settings)

</div>

---

## What is this?

BotLaunch is a no-code platform for Telegram: 165 module types to manage a channel/group
(moderation, captcha, welcomes, analytics, AI, automation) **and** a Mini App builder for
shops, catalogs and booking pages that open right inside Telegram.

This repository is the **AI Companion** — everything an AI assistant needs to drive your
BotLaunch account through our public REST API:

- 📕 the **golden system prompt** you paste into any AI
- 🧩 ready-made **config templates** for common niches
- 📐 **JSON schemas** for module configuration
- 🛠️ tiny **SDK wrappers** (Node & Python) and runnable examples
- 📖 a concise **API reference**
- 🔌 a live **MCP (Model Context Protocol)** server so AI clients see BotLaunch as native tools

## Connect via MCP (Model Context Protocol)

BotLaunch runs a **live hosted MCP server**, so an MCP-capable client sees BotLaunch as a native
tool set — no SDK, no code.

```
Server URL:  https://api.botlaunch.io/api/v1/mcp
Transport:   Streamable HTTP (JSON-RPC 2.0)
Auth header: Authorization: Bearer bl_live_...   (your personal API key)
```

- **Cursor / Claude Code / custom MCP clients:** add the URL above as a remote MCP (HTTP) server
  and set the `Authorization: Bearer` header to your key.
  - Claude Code: `claude mcp add --transport http botlaunch https://api.botlaunch.io/api/v1/mcp --header "Authorization: Bearer $BOTLAUNCH_API_KEY"`
- The client runs `initialize` → `tools/list` and gets **12 tools**: `get_account_context`,
  `list_bots`, `get_bot_status`, `validate_bot_token`, `connect_bot`, `list_modules`,
  `configure_module`, `send_broadcast`, `list_shop_designs`, `create_product`, `set_shop_theme`,
  `set_shop_content`.
- Then just talk: *"Connect my bot and turn on anti-spam + captcha."* The tools are scoped and
  rate-limited by your plan exactly like the REST API — a key can never touch billing or admin.

Prefer raw HTTP? The same key drives the REST API directly — see below.

## Connect in 2 minutes

1. **Get a key.** Open **[panel.botlaunch.io → Settings → API & AI](https://panel.botlaunch.io/settings)**,
   create a key, and copy it (it starts with `bl_live_` and is shown only once).
2. **Give it to your AI.** Paste the golden prompt from
   [`ai-prompts/system-prompt.md`](ai-prompts/system-prompt.md) into Claude / ChatGPT / Cursor,
   then paste your key and the base URL `https://api.botlaunch.io/api/v1`.
3. **Describe what you want.** e.g. *"Set up anti-spam and a captcha on my group, and send a
   welcome message."* The AI calls `GET /context` first to learn your plan and permissions,
   then makes the changes.

## How auth works

Every request uses your personal key as a Bearer token:

```http
Authorization: Bearer bl_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Keys are **scoped** (a positive allowlist) and **rate-limited per plan**. A key can only do
what you grant it and can **never** touch billing, admin, or account settings.

| Scope | Grants |
|-------|--------|
| `bots:read` / `bots:write` | list/read bots · connect, start/stop, configure |
| `modules:read` / `modules:write` | read module definitions/config · enable & configure modules |
| `shop:read` / `shop:write` | read products/orders/storefront · manage catalog & storefront |
| `analytics:read` | read dashboards & metrics |
| `broadcast:send` | send broadcast messages |
| `media:write` | upload images/videos |

`context:read` is always granted so the AI can call `GET /context`.

## The magic first call

```bash
curl https://api.botlaunch.io/api/v1/context \
  -H "Authorization: Bearer $BOTLAUNCH_API_KEY"
```

```jsonc
{
  "data": {
    "authType": "api_key",
    "plan": "FREE",
    "planName": "Free",
    "limits": { "maxChannels": 1, "moduleTier": "basic" },
    "rateLimit": { "rpm": 15, "burst": 60, "dailyCap": 2000 },
    "scopes": ["context:read", "bots:write", "modules:write"]
  }
}
```

## Repository layout

```
botlaunch-ai-companion/
├── ai-prompts/       # golden system prompt + niche prompts
├── templates/        # ready module/shop configs per niche
├── schemas/          # JSON schemas for module configs
├── sdk/              # thin Node & Python wrappers
├── examples/         # runnable end-to-end examples
└── docs/             # API reference
```

## Rate limits & plans

| Plan | Sustained | Burst | Daily cap |
|------|-----------|-------|-----------|
| Free | 15 rpm | 60 | 2,000 |
| Starter | 60 rpm | 120 | 10,000 |
| Pro | 120 rpm | 240 | 50,000 |
| Business | 300 rpm | 600 | unlimited |

Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`; a `429`
carries `Retry-After`. The module tiers available to a key follow your plan
(Free = basic, Starter/Pro = core, Pro/Business = all).

## Links

- 🌐 Website — https://www.botlaunch.io
- 📖 API docs — https://www.botlaunch.io/docs/api
- 🔑 Get a key — https://panel.botlaunch.io/settings
- 💬 Telegram — https://t.me/botlaunch

## License

MIT — see [LICENSE](LICENSE).
