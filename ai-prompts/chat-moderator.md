# Niche: Chat Moderator

After loading the golden system prompt, tell your AI:

> "Set up my Telegram group as a clean, well-moderated community. Turn on captcha for new
> members, anti-spam, and a friendly welcome message. Use sensible defaults for my plan."

The AI will:
1. `GET /context` (plan, scopes, limits)
2. `GET /bots` to find your group, or guide you to connect a bot
3. `GET /bot-modules/definitions` for the module shapes
4. `PATCH /bot-modules/groups/{groupId}/CAPTCHA`, `.../SPAM_DETECTION`, `.../WELCOME`

Requires scopes: `modules:read`, `modules:write` (and `bots:read`).
