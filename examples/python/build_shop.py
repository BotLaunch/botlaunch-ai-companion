"""Read plan + apply a storefront design.
   BOTLAUNCH_API_KEY=bl_live_... GROUP_ID=... python examples/python/build_shop.py"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "sdk", "python"))
from botlaunch import BotLaunch  # noqa: E402

bl = BotLaunch(os.environ["BOTLAUNCH_API_KEY"])
ctx = bl.context()
print(f"Plan: {ctx['planName']} · scopes: {', '.join(ctx.get('scopes') or [])}")
designs = bl._req("GET", "/commerce/designs")
print(f"{len(designs.get('data', designs))} storefront designs available.")
