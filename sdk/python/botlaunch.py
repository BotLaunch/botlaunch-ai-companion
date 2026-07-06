"""Minimal BotLaunch API client (requires `requests`)."""
import requests

BASE = "https://api.botlaunch.io/api/v1"


class BotLaunchError(Exception):
    def __init__(self, status, body):
        super().__init__(body.get("error") or body.get("message") or f"HTTP {status}")
        self.status = status
        self.body = body


class BotLaunch:
    def __init__(self, api_key: str, base_url: str = BASE):
        if not api_key or not api_key.startswith("bl_live_"):
            raise ValueError("A BotLaunch API key (bl_live_...) is required.")
        self.api_key = api_key
        self.base_url = base_url

    def _req(self, method: str, path: str, body=None):
        r = requests.request(
            method, f"{self.base_url}{path}",
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            json=body, timeout=30,
        )
        data = r.json() if r.content else {}
        if not r.ok:
            raise BotLaunchError(r.status_code, data)
        return data.get("data", data)

    def context(self): return self._req("GET", "/context")
    def list_bots(self): return self._req("GET", "/bots")
    def validate_token(self, token): return self._req("POST", "/bots/validate-token", {"token": token})
    def module_definitions(self): return self._req("GET", "/bot-modules/definitions")
    def set_module(self, group_id, mtype, enabled, config):
        return self._req("PATCH", f"/bot-modules/groups/{group_id}/{mtype}", {"enabled": enabled, "config": config})
    def create_product(self, group_id, product): return self._req("POST", f"/groups/{group_id}/products", product)
