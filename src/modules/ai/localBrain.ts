/**
 * Built-in GTA Online assistant brain.
 * Used when no external AI provider key is configured, so Lester & Pavel
 * always respond instead of failing with a 503.
 */
import type { BotId, Platform } from "@/lib/constants";

function includesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

function bullets(lines: string[]): string {
  return lines.map((l) => `- ${l}`).join("\n");
}

function numbered(lines: string[]): string {
  return lines.map((l, i) => `${i + 1}. ${l}`).join("\n");
}

export function localReply(input: {
  bot: BotId;
  prompt: string;
  gamertag: string;
  platform: Platform;
}): string {
  const q = input.prompt.toLowerCase().replace(/\s+/g, " ").trim();
  const name = input.gamertag;
  const platform = input.platform.toUpperCase();

  if (input.bot === "lester") return lesterReply(q, name, platform);
  return pavelReply(q, name, platform);
}

function lesterReply(q: string, name: string, platform: string): string {
  if (includesAny(q, ["cayo", "perico", "kosatka", "el rubio", "panther", "primary target"])) {
    return [
      `Alright ${name}, Cayo Perico is still the best solo printer on ${platform}.`,
      "",
      "## Solo route (drainage tunnel)",
      numbered([
        "Buy the Kosatka (Warstock). Call Pavel and start the heist.",
        "Scope the primary target + secondary loot. Unlock the **drainage tunnel** entry.",
        "Preps: Kosatka approach, weapon loadout, optional disruptions.",
        "Finale: swim into the drainage tunnel, cut the grate, bag the primary, grab secondaries, leave by main gate, swim out.",
      ]),
      "",
      "## Expected payout",
      bullets([
        "Roughly **$1.1M–$1.5M** per solo run (depends on primary + secondaries).",
        "Hard mode pays more. Elite challenge needs speed + no deaths — check the in-game board.",
        "There is a cooldown between runs — stack Agency contracts / payphone hits while you wait.",
      ]),
      "",
      "Want the prep order or secondary-loot priority next?",
    ].join("\n");
  }

  if (includesAny(q, ["nightclub", "bunker", "acid", "business", "passive", "warehouse", "ceo", "mc club"])) {
    return [
      `Passive stack for ${name} on ${platform}:`,
      "",
      "## Priority order",
      numbered([
        "Kosatka (Cayo money first)",
        "Acid Lab (Freakshop) — cheap, solo-friendly sells",
        "Nightclub — technicians on Cargo, Coke, Meth, Cash, Shipping",
        "Bunker — buy supplies, sell in LS around ~$210k stock for a solo vehicle",
      ]),
      "",
      "## Daily habit",
      bullets([
        "Empty Nightclub safe + Agency safe every login.",
        "Never steal bunker supplies unless it's 2x week.",
        "Sell Nightclub with Speedo Custom / Pounder when full.",
      ]),
      "",
      "This mix is safer and more consistent than grinding random contact missions.",
    ].join("\n");
  }

  if (includesAny(q, ["agency", "franklin", "payphone", "security contract", "dr dre", "dre"])) {
    return [
      "## Agency money loop",
      bullets([
        "Security Contracts (Specialist+) → **$50k–$70k** each, raise safe income up to **$20k/day**.",
        "Payphone Hits from Franklin → base pay + big bonus if you follow the assassination style.",
        "Dr. Dre VIP contract → **$1M** first clear, then replayable.",
      ]),
      "",
      "Best used between Cayo cooldowns. Short, repeatable, low risk.",
    ].join("\n");
  }

  if (includesAny(q, ["money", "cash", "make money", "earn", "rich", "solo", "fast", "best method", "grind"])) {
    return [
      `Fastest clean money path on ${platform}, ${name}:`,
      "",
      numbered([
        "**Cayo Perico solo** — main earner ($1.1M–$1.5M / run).",
        "**Agency** — contracts + payphone hits during Cayo cooldown.",
        "**Acid Lab + Nightclub + Bunker** — passive fill while you play.",
        "Daily: safes, stash house, G's cache, shipwreck, daily objectives.",
      ]),
      "",
      "## Avoid",
      bullets([
        "Paying for money drops / modded accounts (ban + wipe risk).",
        "Unverified glitch money methods — Rockstar wipes those constantly.",
      ]),
      "",
      "Ask me about **Cayo**, **Agency**, or **businesses** for the detailed steps.",
    ].join("\n");
  }

  if (includesAny(q, ["heist", "doomsday", "casino", "apartment heist", "pacific", "bogdan"])) {
    return [
      "## Heist quick take",
      bullets([
        "**Cayo Perico** — best solo. Do this first.",
        "**Casino Host** — strong with a duo if setups are already done.",
        "**Doomsday Act II (Bogdan)** — classic replay glitch is **unverified / often patched**. Don't rely on it for money.",
        "Apartment heists — fine for fun/RP, weak $/hour vs Cayo.",
      ]),
      "",
      "If you name the heist, I'll give the prep order and payout range.",
    ].join("\n");
  }

  if (includesAny(q, ["glitch", "dupe", "bogdan", "frozen", "beff", "replay"])) {
    return [
      `Listen ${name} — glitch money is how accounts get wiped.`,
      "",
      bullets([
        "**Bogdan / heist replay** — often patched; duo force-close timing; high risk",
        "**Semi-frozen money** — looks rich, then vanishes / triggers bans",
        "**Car dupes** — clean vs dirty; sell caps; don't dump many in one day",
        "**BEFF** — account-level; extreme ban risk; we don't walk it step-by-step",
      ]),
      "",
      "Open **Guides → Glitches** for detailed community writeups with setup lists.",
      "For actual cash: Cayo solo still beats most dead glitch videos.",
    ].join("\n");
  }

  if (includesAny(q, ["hello", "hi", "hey", "yo", "what's up", "whats up", "help"])) {
    return [
      `Lester here. What do you need, ${name}?`,
      "",
      bullets([
        "Best **solo money** method",
        "**Cayo Perico** route",
        "**Business** setup order",
        "**Agency** / payphone loop",
      ]),
      "",
      "Keep it short — I give steps, not essays.",
    ].join("\n");
  }

  // generic
  return [
    `Got it, ${name}. Here's the practical take for ${platform}:`,
    "",
    bullets([
      "Main earner: **Cayo Perico solo** via drainage tunnel.",
      "Between runs: Agency contracts + payphone hits.",
      "Passive: Acid Lab, Nightclub technicians, Bunker (buy supplies).",
      "Daily: empty safes, stash house, daily objectives.",
    ]),
    "",
    "Ask a more specific question (e.g. \"Cayo prep order\" or \"Nightclub sell\") and I'll go deeper.",
    "",
    "_Built-in advisor — works offline. Add GROQ_API_KEY / GEMINI_API_KEY on the server for fuller AI answers._",
  ].join("\n");
}

function pavelReply(q: string, name: string, platform: string): string {
  if (includesAny(q, ["gctf", "give car", "modded car", "glitch car", "duplicate", "dupe", "moc"])) {
    return [
      `Kapitan ${name} — GCTF is high risk and usually patched fast.`,
      "",
      "## Typical setup",
      bullets([
        "MOC with **Personal Vehicle** storage (not workshop-only)",
        "Junk cars (free Elegy) you can replace",
        "Friend in **Invite Only**, same targeting mode",
        "Donor: Interaction Menu → Vehicle Access → **Passengers**",
      ]),
      "",
      "## Method families (all unverified here)",
      bullets([
        "**Casino + MOC** — penthouse elevator timing, Franklin cancel, invisible enter",
        "**Arena Workshop** — job-join spam, fall through map, then MOC",
        "**Facility circle** — OTR/alert + car flip (often dead)",
      ]),
      "",
      "Open **Guides → GCTF** for full step lists. Report PS4/PS5 + date in chat. Never pay for GCTF services.",
    ].join("\n");
  }

  if (includesAny(q, ["merge", "outfit glitch", "hat mask", "glasses", "shoe merge", "yoga", "component", "belt merge"])) {
    return [
      `Kapitan ${name}, outfit glitch map:`,
      "",
      bullets([
        "**Hat + Mask + Glasses** — telescope spam or Ammu-Nation soda interrupt",
        "**Shoe merge** — mansion roof yoga + Safety and Alerts timing",
        "**Belt / components** — Lamar job *It's a G Thing* with Player Owned outfits",
        "**A–Z merges** — Guides → Outfits (every merge stays unverified)",
      ]),
      "",
      "Save backup outfits first. Component transfer can wipe slots if you delete the wrong character.",
    ].join("\n");
  }

  if (includesAny(q, ["outfit", "clothing", "fit", "fashion", "black", "tactical", "drip", "vest", "all-black", "all black"]) && !includesAny(q, ["glitch", "merge", "hat mask", "glasses", "gctf", "component", "yoga"])) {
    return [
      `Kapitan ${name}, clean all-black tactical look:`,
      "",
      "## Pieces",
      bullets([
        "Top: black combat / utility vest over a black long-sleeve",
        "Legs: black cargo pants (Suburban)",
        "Boots: black hi-top combat boots",
        "Gloves: black fingerless",
        "Mask: black balaclava or hockey mask",
      ]),
      "",
      "## Tips",
      bullets([
        "Save the outfit **before** adding the mask — masks can reset slots.",
        "Heist prep outfits are a good armored base.",
        "No glitch needed for this look — all store items.",
      ]),
      "",
      "Want a street-racer / Car Meet style instead?",
    ].join("\n");
  }

  if (includesAny(q, ["griefer", "grief", "tryhard", "oppressor", "mk2", "jet", "kill me", "lobby", "defensive"])) {
    return [
      `Stay calm, Kapitan ${name}. Anti-griefer basics on ${platform}:`,
      "",
      numbered([
        "Switch to **Invite Only** / **Closed Friend** for sales and preps.",
        "Enable **Ghost Organization** (CEO) when moving product.",
        "Keep a **Oppressor counter** (railgun, heavy sniper MK II explosive, or your own Mk II).",
        "Don't chase — finish the sell, then leave.",
        "Use **Passive Mode** in free roam when you're just traveling (not during sells).",
      ]),
      "",
      "Most griefers want a reaction. Deny them the show.",
    ].join("\n");
  }

  if (includesAny(q, ["crew", "friends", "heist team", "find people", "session", "discord"])) {
    return [
      "## Finding a crew",
      bullets([
        "Use this app's **PS4 / PS5 chat** — say your gamertag + what you need (Cayo setups, car meet, etc.).",
        "In-game: pause → Online → Crews → Join a crew with open wall.",
        "LS Car Meet is a good place to meet chill players.",
        "Never share account logins. Never pay for 'car drops' from strangers.",
      ]),
      "",
      `Drop a message in the ${platform} lobby chat like: "looking for Cayo duo — ${name}".`,
    ].join("\n");
  }

  if (includesAny(q, ["car meet", "ls car", "rep", "prize ride", "tuner"])) {
    return [
      "## LS Car Meet",
      bullets([
        "Hang inside the meet + race to raise **rep**.",
        "Rep unlocks clothing, horns, and liveries.",
        "Prize Ride challenge rotates weekly — check the board.",
        "Test track is free; good place to try cars before buying.",
      ]),
    ].join("\n");
  }

  if (includesAny(q, ["hello", "hi", "hey", "yo", "kapitan", "help", "what's up", "whats up"])) {
    return [
      `Privet, Kapitan ${name}! Pavel at your service.`,
      "",
      "I can help with:",
      bullets(["Outfit ideas", "Lobby / griefer tips", "Finding a crew", "Car Meet rep", "General GTA Online advice"]),
      "",
      "What do you need?",
    ].join("\n");
  }

  return [
    `Kapitan ${name}, here's what I can tell you on ${platform}:`,
    "",
    bullets([
      "For **outfits** — ask \"all black tactical\" or \"car meet fit\".",
      "For **griefers** — ask \"how to deal with Mk2\".",
      "For **crew** — ask \"find heist team\".",
      "Money questions are Lester's specialty — try the Lester assistant too.",
    ]),
    "",
    "_Built-in helper — works offline. Add an AI provider key on the server for broader answers._",
  ].join("\n");
}
