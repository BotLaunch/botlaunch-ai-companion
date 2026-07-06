# Connecting via MCP

BotLaunch runs a **live hosted MCP (Model Context Protocol) server** so MCP-capable clients use
BotLaunch as a native tool set.

- **Endpoint:** `https://api.botlaunch.io/api/v1/mcp` (Streamable HTTP, JSON-RPC 2.0)
- **Auth:** send your personal key as `Authorization: Bearer bl_live_…`
- **Tools:** 12, listed below — each maps to a scoped REST endpoint, so your key's scopes and
  plan limits apply exactly as in the REST API.
- **Note:** your client just needs to support a remote/HTTP MCP server with a custom
  `Authorization` header (Cursor, Claude Code, and custom integrations do). If yours doesn't,
  the same key drives the REST API directly (see [`../README.md`](../README.md)).

## Quick check

```bash
# Server info
curl https://api.botlaunch.io/api/v1/mcp

# List tools (JSON-RPC)
curl -X POST https://api.botlaunch.io/api/v1/mcp \
  -H "Authorization: Bearer $BOTLAUNCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Clients that support a custom header on a remote MCP server

Add a remote/HTTP MCP server pointing at `https://api.botlaunch.io/api/v1/mcp` with an
`Authorization: Bearer bl_live_…` header. Exact steps vary by client (Cursor, Claude Code,
VS Code, Claude Desktop) and change often — check your client's current MCP docs.

## Available tools

`get_account_context`, `list_bots`, `get_bot_status`, `validate_bot_token`, `connect_bot`,
`list_modules`, `configure_module`, `send_broadcast`, `list_shop_designs`, `create_product`,
`set_shop_theme`, `set_shop_content`.

Each tool maps to a scoped REST endpoint — your key's scopes and plan limits apply exactly as
in the REST API. Ask the assistant to call `get_account_context` first.
