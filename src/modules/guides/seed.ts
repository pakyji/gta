/**
 * Curated guide content. Glitches / GCTF are NEVER "verified".
 */
import type { GuideSeed } from "./seedTypes";
import { EXTRA_GLITCHES, MERGE_GUIDES } from "./merges";
import { COMMUNITY_GUIDES } from "./communityGuides";
import { GTAGLITCHES_CATALOG } from "./gtaglitchesCatalog";
export type { GuideSeed };

const BASE_GUIDES: GuideSeed[] = [
  // ── MONEY ──────────────────────────────────────────────
  {
    slug: "cayo-perico-solo-route",
    category: "money",
    title: "Cayo Perico Heist — solo route",
    summary: "Best solo money method. Drainage-tunnel entry, prep order, secondary loot priority.",
    body: `## Why it's #1 solo
Kosatka unlocks a fully solo heist. Expect roughly **$1.1M–$1.5M** per run depending on primary + secondaries.

## Requirements
- Kosatka submarine (Warstock)
- Finish Pavel's intro call

## Scope-out
1. Photograph the primary target
2. Unlock the **drainage tunnel** on the south compound wall
3. Scope 1–2 secondary targets (gold/cocaine preferred for solo)

## Preps (solo order)
1. Approach vehicle: **Kosatka**
2. Weapons: Aggressor or Conspirator
3. Disruptions: optional

## Finale
- Swim in via drainage tunnel → cut grate → basement primary
- Grab secondaries → exit main gate → swim out

## Tips
- Elite: under 15 min, no deaths (check in-game board)
- Use Agency contracts during the cooldown`,
    status: "verified",
    difficulty: "medium",
    payout: "$1.1M – $1.5M / run",
    platforms: ["ps4", "ps5"],
    sourceName: "Rockstar Support — Cayo Perico",
    sourceUrl: "https://support.rockstargames.com/articles/360052992673",
    featured: true,
    readMinutes: 6,
    imageUrl: "/images/cat-money.jpg",
  },
  {
    slug: "passive-business-cycle",
    category: "money",
    title: "Passive business cycle",
    summary: "Nightclub + Bunker + Acid Lab loop that prints while you do other content.",
    body: `## The loop
1. **Nightclub** — technicians on Cargo, Sporting Goods, Coke, Meth, Cash. Sell with Speedo Custom / Pounder.
2. **Bunker** — buy supplies, sell in LS near ~$210k stock for solo vehicle.
3. **Acid Lab** — Freakshop unlock, one-vehicle sells.

## Timing
- Nightclub safe caps at $250k (upgraded)
- Bunker ~2h20m per full supply
- Acid Lab ~$335k full batch

## Buy order
1. Kosatka  2. Acid Lab  3. Nightclub  4. Bunker`,
    status: "verified",
    difficulty: "easy",
    payout: "$500k+ / hour mix",
    platforms: ["ps4", "ps5"],
    sourceName: "Rockstar Newswire",
    sourceUrl: "https://www.rockstargames.com/newswire",
    readMinutes: 4,
    imageUrl: "/images/cat-money.jpg",
  },
  {
    slug: "agency-security-contracts",
    category: "money",
    title: "Agency contracts & payphone hits",
    summary: "Repeatable no-cooldown money with Franklin's Agency.",
    body: `## Security Contracts
- Specialist+ contracts ≈ $50k–$70k
- Raises Agency safe up to **$20k/day**

## Payphone Hits
- Call Franklin after a few contracts
- ~$15k + big bonus for the correct assassination style
- ~20 min cooldown

## Dr. Dre VIP
- One-time $1M, then replayable`,
    status: "verified",
    difficulty: "easy",
    payout: "$50k – $85k / contract",
    platforms: ["ps4", "ps5"],
    readMinutes: 3,
    imageUrl: "/images/cat-money.jpg",
  },
  {
    slug: "money-glitch-warnings",
    category: "money",
    title: "Money glitches — warnings & reality check",
    summary: "Why money glitches get wiped, and what 'working' actually means.",
    body: `## Hard truth
Money glitches (cardboard box, clothes bag, slot chip, property share loops, etc.) are the **fastest way to get a wipe**.

## What Rockstar does
- Detects sudden balance spikes
- Removes glitched funds + sometimes legitimate cash
- May apply sale locks or bans on repeat abuse

## Status of popular money glitches
All widely shared money glitches should be treated as **patched or high-risk**. This app will **never** mark a money glitch as verified.

## Safe alternative
Use the Cayo / Agency / business guides instead. Slower, keeps your account.`,
    status: "patched",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 3,
    imageUrl: "/images/cat-money.jpg",
  },
  {
    slug: "daily-money-checklist",
    category: "money",
    title: "Daily money checklist (15 min)",
    summary: "Fast daily loop: safes, stash house, G's cache, shipwreck, dailies.",
    body: `## Every login
1. Nightclub safe + Agency safe
2. Daily Objectives (3)
3. Stash House raid
4. G's Cache
5. Shipwreck (7-day outfit)
6. Gun Van location
7. Payphone hit if available

## Reset
Daily objectives reset **06:00 UTC**.`,
    status: "verified",
    difficulty: "easy",
    payout: "$100k–$250k / day passive",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-money.jpg",
  },

  // ── OUTFITS ────────────────────────────────────────────
  {
    slug: "all-black-tactical-outfit",
    category: "outfits",
    title: "All-black tactical outfit",
    summary: "Clean aggressive look from normal stores — no glitch needed.",
    body: `## Pieces
- Top: black combat / utility vest
- Under: black long sleeve
- Legs: black cargos (Suburban)
- Boots: black hi-top combat
- Gloves: black fingerless
- Mask: black balaclava / hockey

## Tips
- Save outfit **before** mask
- Heist prep outfits = armored base`,
    status: "verified",
    difficulty: "easy",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 2,
    imageUrl: "/images/cat-outfits.jpg",
  },
  {
    slug: "street-racer-outfit",
    category: "outfits",
    title: "Street racer / LS Car Meet outfit",
    summary: "Stylish Car Meet look with rep unlocks + store items.",
    body: `## Pieces
- Racing / varsity jacket (Car Meet rep)
- Slim dark jeans
- Low-top sneakers
- Racing cap backwards + aviators

## Where
- LS Car Meet rep rewards
- Binco / Suburban`,
    status: "verified",
    difficulty: "easy",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-outfits.jpg",
  },
  {
    slug: "modded-outfit-merge-basics",
    category: "outfits",
    title: "Outfit merging — overview",
    summary: "What merge glitches are, why they break, how to stay safe.",
    body: `## What it is
Merge glitches combine blocked clothing components (vests + jackets, etc.) using wardrobe / mission-outfit bugs.

## Status
**Unverified.** Steps change every title update. This app does **not** publish a "working" merge recipe.

## Safety
- Usually not treated like money cheats, but Rockstar can reset outfits
- Never use mod menus — bannable
- Save a clean backup outfit slot`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 3,
    imageUrl: "/images/cat-outfits.jpg",
  },
  {
    slug: "outfit-glitch-mask-combo",
    category: "outfits",
    title: "Mask + helmet combo glitch",
    summary: "Community-reported mask layering. Unverified — patch-prone.",
    body: `## Idea
Layer a mask under/over a helmet or hat using a specific wardrobe leave/rejoin sequence.

## Status
**Unverified.** Many variants were patched. Do not trust random TikTok "still works 2026" claims without testing yourself.

## If you test it
Post **platform + date** in PS4/PS5 chat so the community can track it.

## Risk
Low money risk, but outfit slots can corrupt — keep backups.`,
    status: "unverified",
    difficulty: "medium",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-outfits.jpg",
  },
  {
    slug: "gunrunning-outfit-style",
    category: "outfits",
    title: "Gunrunning / bunker operative look",
    summary: "Military-inspired fit using Ammu-Nation and bunker gear.",
    body: `## Pieces
- Tactical shirt / field jacket
- Holster accessories if unlocked
- Combat boots + gloves
- Optional scarf / headset

## Notes
- Many pieces unlock via bunker research / gunrunning progress
- Works great with the all-black tactical base`,
    status: "verified",
    difficulty: "easy",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-outfits.jpg",
  },

  // ── GLITCHES ───────────────────────────────────────────
  {
    slug: "bogdan-replay-glitch",
    category: "glitches",
    title: "Doomsday Act II (Bogdan) replay",
    summary: "Classic heist replay loop. Status changes constantly — verify yourself.",
    body: `## How it worked
Host force-quit near finale completion so the heist stayed "ready" while the associate kept the payout.

## Current status
**Unverified.** Patched and unpatched in waves for years.

## Risks
- Setup cost waste
- Historical association with money-wipe waves

## Rule
Report **date + platform** in chat if you test it. Never pay anyone for a "Bogdan partner" service.`,
    status: "unverified",
    difficulty: "medium",
    payout: "Varies",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 3,
    imageUrl: "/images/cat-glitches.jpg",
  },
  {
    slug: "apartment-garage-duplication",
    category: "glitches",
    title: "Vehicle duplication (garage swap family)",
    summary: "Historic car dupe family. Mostly patched — awareness only.",
    body: `## Summary
Used property/garage transitions to copy a vehicle then sell the copy.

## Status
**Patched** in widely shared variants. Duplicate plates get flagged.

## Recommendation
Don't risk it. Earn cars legitimately or trade favors with friends (without glitches).`,
    status: "patched",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-glitches.jpg",
  },
  {
    slug: "orbital-cannon-charge-glitch",
    category: "glitches",
    title: "Orbital cannon / facility charge tricks",
    summary: "Old facility charge bypass stories. Assume patched.",
    body: `## Background
Players tried to avoid the high Orbital Cannon fee using job warps or disconnect timing.

## Status
**Patched / unverified.** Don't plan content around it.

## Better approach
Just don't orbital strangers. Use Invite Only for peace.`,
    status: "patched",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-glitches.jpg",
  },
  {
    slug: "clothing-slot-corrupt-reset",
    category: "glitches",
    title: "Clothing slot corruption recovery",
    summary: "What to do when an outfit glitch bricks a slot.",
    body: `## Symptoms
- Outfit slot empty / default
- Character loads with missing textures
- Interaction menu outfits greyed out

## Recovery attempts (community)
1. Switch session → reapply a clean saved outfit
2. Load into a story-mode wardrobe then back online
3. Replace the slot with a brand-new simple outfit

## Status
Recovery steps are **unverified** and vary by platform.

## Prevention
Keep 2–3 clean backup outfits you never merge.`,
    status: "unverified",
    difficulty: "medium",
    platforms: ["ps4", "ps5"],
    readMinutes: 3,
    imageUrl: "/images/cat-glitches.jpg",
  },
  {
    slug: "job-warp-glitch-overview",
    category: "glitches",
    title: "Job warp glitches — overview",
    summary: "Warping via jobs to skip collisions or fees. Patch magnets.",
    body: `## What people used them for
- Fast travel across the map
- Avoiding wanted levels
- Exploiting interior transitions

## Status
**Mostly patched.** Any new warp is likely short-lived.

## Risk
Low direct ban risk historically, but can soft-lock missions or characters rarely.

Treat every job-warp post as **unverified** until you test it on your platform that day.`,
    status: "unverified",
    difficulty: "medium",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-glitches.jpg",
  },

  // ── GCTF ───────────────────────────────────────────────
  {
    slug: "gctf-what-is-it",
    category: "gctf",
    title: "GCTF — what it is",
    summary: "Give Cars To Friends explained: purpose, risks, community rules.",
    body: `## What is GCTF?
Glitches that let one player transfer a personal vehicle into another player's garage by abusing ownership transitions (Car Meet, garage swaps, heist preps, etc.).

## Why people do it
- Share rare / modded vehicles
- Help a friend get a car they can sell

## Risks
- Rockstar removes glitched cars and money
- Some waves hit receivers harder than givers
- Methods die every title update

## Community rule
If you discuss GCTF in chat, include **platform + date tested**. Never pay for "GCTF services" — scams.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 3,
    imageUrl: "/images/cat-gctf.jpg",
  },
  {
    slug: "gctf-car-meet-method",
    category: "gctf",
    title: "GCTF — LS Car Meet variant",
    summary: "Commonly shared Car Meet transfer idea. Unverified.",
    body: `## Outline (community-reported)
1. Giver enters LS Car Meet in the target vehicle
2. Both coordinate test-track / merge-area actions
3. Receiver drives the vehicle into their garage

## Status
**Unverified.** Frequently reported patched.

## Important
- No steps here are guaranteed
- Do not pay anyone for GCTF
- Report your results with date + platform`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-gctf.jpg",
  },
  {
    slug: "gctf-garage-close-variant",
    category: "gctf",
    title: "GCTF — garage close / CEO variant",
    summary: "Older garage-close timing method. Assume broken until proven.",
    body: `## Idea
Exploit the moment a garage door closes while CEO/MC vehicle options flip ownership state.

## Status
**Unverified / likely patched.** Listed so you can recognise scam videos recycling old steps.

## Safer path
Buy the car on sale week, or run Cayo and purchase it clean.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 2,
    imageUrl: "/images/cat-gctf.jpg",
  },
  {
    slug: "gctf-safety-checklist",
    category: "gctf",
    title: "GCTF safety checklist",
    summary: "If you still experiment, reduce wipe risk.",
    body: `## Before anything
- Screenshot your bank + garage list
- Don't move your entire net worth into one car
- Use a secondary character if you have one

## Red flags (scam)
- Anyone asking for login details
- "Pay me first, GCTF after"
- Discord links from randoms in public lobbies

## After
- Avoid immediately selling a freshly received car
- If the car vanishes next session, it was flagged — don't repeat

## Official stance of this app
GCTF is **never** marked working here.`,
    status: "unverified",
    difficulty: "medium",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 3,
    imageUrl: "/images/cat-gctf.jpg",
  },
];

export const GUIDE_SEEDS: GuideSeed[] = [...BASE_GUIDES, ...MERGE_GUIDES, ...EXTRA_GLITCHES, ...COMMUNITY_GUIDES, ...GTAGLITCHES_CATALOG];
