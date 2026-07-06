# Niche: Telegram Mini App Shop

After loading the golden system prompt, tell your AI:

> "Build me a Telegram shop for my clothing brand. Pick a clean design, add these products
> [list], and set the theme to match my brand colors."

The AI will:
1. `GET /context` (plan, scopes, limits)
2. `GET /commerce/designs` and apply one via `POST /groups/{groupId}/shop/design`
3. `POST /groups/{groupId}/products` for each item
4. `PATCH /groups/{groupId}/shop/theme` and `.../shop/content` to style it

Requires scopes: `shop:read`, `shop:write` (and `media:write` to upload product images).
Note: orders are seller-fulfilled; native in-Telegram card payments are not available yet.
