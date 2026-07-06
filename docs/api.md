# BotLaunch Public API — Reference

Base URL: `https://api.botlaunch.io/api/v1`
Auth: `Authorization: Bearer bl_live_…` on every request.
Full response envelope: `{ "data": … }` on success; `{ "error": "…", "statusCode": … }` on error.

> This is the AI-facing subset. The authoritative machine-readable shapes come from
> `GET /bot-modules/definitions` (module configs) and the live endpoints below.

## Discovery

### `GET /context`
Returns the account's plan, limits, granted scopes and rate tier. **Always call this first.**
Scope: `context:read` (implicit on every key).

## Bots — scope `bots:*`

| Method | Path | Scope | Notes |
|--------|------|-------|-------|
| POST | `/bots/validate-token` | `bots:write` | Validate a BotFather token via getMe (pre-flight) |
| POST | `/bots` | `bots:write` | Connect a bot |
| GET | `/bots` | `bots:read` | List bots |
| GET | `/bots/{id}/status` | `bots:read` | Live status |
| POST | `/bots/{id}/start` \| `/stop` \| `/restart` | `bots:write` | Lifecycle |

```bash
# Validate then connect
curl -X POST https://api.botlaunch.io/api/v1/bots/validate-token \
  -H "Authorization: Bearer $BOTLAUNCH_API_KEY" -H "Content-Type: application/json" \
  -d '{"token":"123456:BotFatherTokenHere"}'
```

## Modules — scope `modules:*`

| Method | Path | Scope |
|--------|------|-------|
| GET | `/bot-modules/definitions` | `modules:read` |
| GET | `/bot-modules/groups/{groupId}` | `modules:read` |
| GET | `/bot-modules/groups/{groupId}/{MODULE_TYPE}` | `modules:read` |
| PATCH | `/bot-modules/groups/{groupId}/{MODULE_TYPE}` | `modules:write` |
| POST | `/bot-modules/groups/{groupId}/{MODULE_TYPE}/toggle` | `modules:write` |
| POST | `/bot-modules/groups/{groupId}/broadcast` | `broadcast:send` |

`MODULE_TYPE` is an UPPER_SNAKE_CASE value (e.g. `CAPTCHA`, `SPAM_DETECTION`, `WELCOME`,
`AUTO_RESPONSE`). Read `GET /bot-modules/definitions` for each module's default config shape,
then send the same shape in the PATCH body:

```bash
curl -X PATCH https://api.botlaunch.io/api/v1/bot-modules/groups/$GROUP/CAPTCHA \
  -H "Authorization: Bearer $BOTLAUNCH_API_KEY" -H "Content-Type: application/json" \
  -d '{"enabled": true, "config": { /* shape from /bot-modules/definitions */ }}'
```

## Mini App shop — scope `shop:*`

| Method | Path | Scope |
|--------|------|-------|
| GET/POST | `/groups/{groupId}/products` | `shop:read` / `shop:write` |
| PATCH/DELETE | `/groups/{groupId}/products/{productId}` | `shop:write` |
| GET | `/groups/{groupId}/orders` · PATCH `/orders/{id}` | `shop:read` / `shop:write` |
| GET/PATCH | `/groups/{groupId}/shop/content` | `shop:read` / `shop:write` |
| GET/PATCH | `/groups/{groupId}/shop/theme` | `shop:read` / `shop:write` |
| POST | `/groups/{groupId}/shop/design` | `shop:write` |
| GET | `/commerce/designs` | `shop:read` |
| POST | `/media/upload` | `media:write` |

Shop content and theme pass through a server-side safety gate (field allowlist, length caps,
URL allowlist); an invalid field returns `400` with a `path` telling you exactly what to fix.

## Errors

| Status | Meaning | What the AI should do |
|--------|---------|-----------------------|
| 401 | Invalid/revoked/expired key | Ask the user for a fresh key |
| 403 | Missing scope, or route not allowed for keys | Request the scope, or use an in-scope alternative |
| 403 + `upgrade` | Module needs a higher plan | Offer the upgrade or a same-tier alternative |
| 429 + `Retry-After` | Rate limited | Wait and space out calls |
| 400 + `path` | Invalid field | Fix that field and retry |

## Rate limits

Per plan (token bucket): Free 15 rpm / burst 60, Starter 60/120, Pro 120/240, Business
300/600. Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
