"""Browser smoke test for the GTA Online Community app.
Requires: pip install playwright && python -m playwright install chromium
Run: BASE_URL=http://127.0.0.1:3100 python scripts/browser-smoke-test.py
"""
import re, sys, time
from playwright.sync_api import sync_playwright

import os
BASE = os.environ.get("BASE_URL", "http://127.0.0.1:3100")
results = []
errors = []


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail else ""))


with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    page.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
    img_status = {}
    page.on("response", lambda r: img_status.__setitem__(r.url, r.status) if "/images/" in r.url or "/icons/" in r.url else None)
    api_urls = []
    page.on("request", lambda r: api_urls.append(r.url) if "/api/" in r.url else None)

    # 1. Welcome -> create account with password
    page.goto(BASE + "/", wait_until="networkidle")
    check("welcome page renders", page.locator("#password").count() == 1)
    page.fill("input[placeholder='e.g. professor_ji96']", "SmokeTester")
    page.locator("button:has-text('PS5')").first.click()
    page.fill("#password", "smoke123")
    page.locator("button[type='submit']").first.click()
    try:
        page.wait_for_url(re.compile(r".*/home(\?.*)?$"), timeout=20000)
        ok_home = True
    except Exception as e:
        ok_home = False
    check("login redirects to /home", ok_home, page.url)
    check("no token in address bar after login", "t=" not in page.url and "token=" not in page.url, page.url)

    page.wait_for_load_state("networkidle")
    time.sleep(1.5)
    check("home shows the gamertag or greeting", page.get_by_text("SmokeTester").count() > 0 or page.get_by_text("Welcome").count() > 0)

    # 2. Chat: send a message
    page.goto(BASE + "/chat/ps5", wait_until="networkidle")
    time.sleep(2)
    box = page.locator("textarea").first
    check("chat input present", box.count() == 1)
    msg = f"smoke {int(time.time())}"
    if box.count():
        box.fill(msg)
        box.press("Enter")
        time.sleep(3)
        check("sent chat message appears", page.get_by_text(msg).count() > 0, msg)

    # 3. Guides list + index entry + images
    page.goto(BASE + "/guides", wait_until="networkidle")
    time.sleep(2)
    check("guides list shows BEFF", page.get_by_text("BEFF", exact=False).count() > 0)
    page.goto(BASE + "/guides/gg-beff", wait_until="networkidle")
    time.sleep(1)
    check("guide detail shows index entry", page.get_by_text("Index entry").count() > 0)
    check("guide detail shows source link", page.get_by_text("reddit.com/r/gtaglitches", exact=False).count() > 0)

    # 4. Images: every /images request must be 200
    bad_imgs = {u: s for u, s in img_status.items() if s != 200}
    check("all loaded /images and /icons return 200", not bad_imgs and len(img_status) > 0, f"{len(img_status)} requested; bad={list(bad_imgs)[:3]}")

    # 5. Music page and vehicles page render
    page.goto(BASE + "/music", wait_until="networkidle")
    time.sleep(1)
    check("music page renders", page.locator("main, body").count() > 0 and "Application error" not in page.content())
    page.goto(BASE + "/vehicles", wait_until="networkidle")
    time.sleep(1.5)
    vehicle_imgs = [u for u in img_status if "/images/veh-" in u]
    check("vehicle images requested and OK", vehicle_imgs and all(img_status[u] == 200 for u in vehicle_imgs), f"{len(vehicle_imgs)} images")

    # 6. Tokens never in API URLs
    leaked = [u for u in api_urls if "token=" in u or re.search(r"[?&]t=", u)]
    check("no token in any /api URL", not leaked, str(leaked[:2]))

    browser.close()

print("\nJS errors seen:", len(errors))
for e in errors[:15]:
    print("  ", e[:300])
failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
