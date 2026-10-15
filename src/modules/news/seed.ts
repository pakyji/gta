import type { NewsKind } from "@/lib/constants";

export interface NewsSeed {
  slug: string;
  kind: NewsKind;
  title: string;
  summary: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  expiresAt?: string;
  tags: string[];
  imageUrl?: string;
}

const now = new Date();
const day = (offset: number) => {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() + offset);
  d.setUTCHours(10, 0, 0, 0);
  return d.toISOString();
};

export const NEWS_SEEDS: NewsSeed[] = [
  {
    slug: "weekly-reset-thursday",
    kind: "weekly",
    title: "Weekly reset is every Thursday",
    summary: "Bonuses, discounts, podium car, prize ride and Gun Van rotate every Thursday. Check Newswire after reset.",
    body: `## When
Rockstar flips the GTA Online weekly content every **Thursday ~10:00 UTC**.

## What changes
- 2x / 3x GTA$ & RP playlists
- Property & vehicle discounts
- Lucky Wheel **podium vehicle**
- LS Car Meet **Prize Ride**
- Gun Van inventory + location
- Time Trials / challenges

## What you should do
1. After Thursday reset, open Rockstar Newswire
2. Note 2x businesses (Nightclub, Bunker, Acid Lab, etc.)
3. Buy discounted vehicles only if you need them
4. Spin the Lucky Wheel once per day for podium chance

## Confirm live
https://www.rockstargames.com/newswire`,
    sourceName: "Rockstar Newswire",
    sourceUrl: "https://www.rockstargames.com/newswire",
    publishedAt: day(0),
    tags: ["weekly", "reset", "bonuses"],
    imageUrl: "/images/news-weekly.jpg",
  },
  {
    slug: "daily-checklist-ls",
    kind: "daily",
    title: "Daily LS checklist (10–15 min)",
    summary: "Safes, stash house, G's Cache, shipwreck, daily objectives — quick money every login.",
    body: `## Every login
1. **Nightclub safe** + **Agency safe**
2. **Daily Objectives** (3) — keep the streak
3. **Stash House** raid
4. **G's Cache**
5. **Shipwreck** (7-day Frontier progress)
6. **Gun Van** if you need ammo/weapons
7. Payphone hit if available

## Resets
Daily objectives reset around **06:00 UTC**.

## Tip
Do dailies before long Cayo runs so the streak never breaks.`,
    sourceName: "GTA Community Tips",
    sourceUrl: "https://www.rockstargames.com/newswire",
    publishedAt: day(0),
    tags: ["daily", "checklist", "money"],
    imageUrl: "/images/news-daily.jpg",
  },
  {
    slug: "cayo-still-best-solo",
    kind: "weekly",
    title: "Cayo Perico remains the best solo money method",
    summary: "Kosatka + drainage tunnel route still prints. Stack Agency work on cooldown.",
    body: `## Why Cayo
Fully solo, strong payout, repeatable.

## Quick route
1. Scope primary + drainage tunnel
2. Kosatka approach
3. In through tunnel → bag primary + secondaries
4. Main gate out → swim escape

## Between runs
- Agency Security Contracts
- Payphone hits
- Empty passive businesses

See in-app **Guides → Money → Cayo Perico solo route**.`,
    sourceName: "Community Money Guide",
    sourceUrl: "https://www.rockstargames.com/newswire",
    publishedAt: day(-1),
    tags: ["weekly", "money", "cayo"],
    imageUrl: "/images/news-money.jpg",
  },
  {
    slug: "podium-and-prize-ride",
    kind: "weekly",
    title: "Podium vehicle & Prize Ride this week",
    summary: "Spin Lucky Wheel daily. Complete the Car Meet Prize Ride challenge for a test-drive unlock path.",
    body: `## Lucky Wheel
- One free spin per day at Diamond Casino
- Podium vehicle rotates with the Thursday update

## Prize Ride
- LS Car Meet board shows the weekly challenge
- Finish the challenge to unlock the prize vehicle purchase/claim flow

## Tip
Don't dump millions on a podium car if a discount week is likely — check Newswire first.`,
    sourceName: "Rockstar Newswire",
    sourceUrl: "https://www.rockstargames.com/newswire",
    publishedAt: day(0),
    tags: ["weekly", "casino", "carmeet"],
    imageUrl: "/images/news-podium.jpg",
  },
  {
    slug: "ps5-gta-plus-note",
    kind: "event",
    title: "GTA+ is PS5 / enhanced only",
    summary: "PS4 still gets weekly bonuses. GTA+ perks, some upgrades and faster loads stay on enhanced.",
    body: `## PS5 / enhanced
- GTA+ membership benefits
- Hao's Special Works
- Better load times / performance modes

## PS4
- Full weekly bonuses & most content
- No GTA+ exclusive track

## Migration
You can migrate a character PS4 → PS5 from the game menu when ready.`,
    sourceName: "Rockstar GTA+",
    sourceUrl: "https://www.rockstargames.com/gta-plus",
    publishedAt: day(-2),
    tags: ["event", "ps5", "gta+"],
    imageUrl: "/images/news-event.jpg",
  },
  {
    slug: "gun-van-and-daily-locates",
    kind: "daily",
    title: "Gun Van, Exotic Exports & daily locates",
    summary: "Gun Van moves daily. Exotic Exports list refreshes — easy cash if you're already free roam grinding.",
    body: `## Gun Van
- Location changes daily
- Rotating discounted weapons & armor

## Exotic Exports
- Auto Shop board shows today's export list
- Deliver for solid cash + RP

## Tip
Combine with daily objectives so one free-roam loop pays multiple systems.`,
    sourceName: "GTA Community Tips",
    sourceUrl: "https://www.rockstargames.com/newswire",
    publishedAt: day(0),
    tags: ["daily", "gunvan", "exports"],
    imageUrl: "/images/news-cars.jpg",
  },
  {
    slug: "community-rules-chat",
    kind: "event",
    title: "Community chat rules",
    summary: "No account selling, no paid GCTF services, tag glitch reports with platform + date.",
    body: `## Rules
1. No selling accounts / money drops / GCTF services
2. Glitch reports need **platform + date tested**
3. Be decent in PS4/PS5 lobbies
4. Never share login codes

## Where
Use in-app **PS4 Chat** and **PS5 Chat**.`,
    sourceName: "GTA Online Community",
    sourceUrl: "/settings",
    publishedAt: day(-3),
    tags: ["event", "community"],
    imageUrl: "/images/news-event.jpg",
  },
  {
    slug: "business-bonus-priority",
    kind: "weekly",
    title: "If businesses are 2x — sell order",
    summary: "When Nightclub/Bunker/Acid are boosted, sell in the right order for max hourly.",
    body: `## Priority when boosted
1. **Nightclub** full stock (best passive)
2. **Acid Lab** (fast solo sell)
3. **Bunker** (buy supplies, sell LS for solo vehicle when possible)
4. Special cargo / vehicles if 2x

## Never
Don't start a long sell in a public lobby when griefers are up — Invite Only where allowed.`,
    sourceName: "Community Money Guide",
    sourceUrl: "https://www.rockstargames.com/newswire",
    publishedAt: day(-1),
    tags: ["weekly", "business", "money"],
    imageUrl: "/images/news-money.jpg",
  },
];
