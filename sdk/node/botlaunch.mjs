// Minimal BotLaunch API client — zero dependencies (Node 18+ global fetch).
// Usage: const bl = new BotLaunch(process.env.BOTLAUNCH_API_KEY);
const BASE = 'https://api.botlaunch.io/api/v1';

export class BotLaunchError extends Error {
  constructor(status, body) {
    super(body?.error || body?.message || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

export class BotLaunch {
  constructor(apiKey, baseUrl = BASE) {
    if (!apiKey || !apiKey.startsWith('bl_live_')) {
      throw new Error('A BotLaunch API key (bl_live_...) is required.');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(method, path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new BotLaunchError(res.status, json);
    return json.data ?? json;
  }

  context() { return this.request('GET', '/context'); }
  listBots() { return this.request('GET', '/bots'); }
  validateToken(token) { return this.request('POST', '/bots/validate-token', { token }); }
  connectBot(payload) { return this.request('POST', '/bots', payload); }
  botStatus(id) { return this.request('GET', `/bots/${id}/status`); }
  moduleDefinitions() { return this.request('GET', '/bot-modules/definitions'); }
  setModule(groupId, type, enabled, config) {
    return this.request('PATCH', `/bot-modules/groups/${groupId}/${type}`, { enabled, config });
  }
  listDesigns() { return this.request('GET', '/commerce/designs'); }
  createProduct(groupId, product) { return this.request('POST', `/groups/${groupId}/products`, product); }
}
