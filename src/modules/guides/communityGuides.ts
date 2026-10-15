/**
 * Detailed community-sourced glitch / GCTF / outfit guides.
 * Compiled from public r/gtaglitches, Se7ensins, gtaglitches.com summaries, and GitHub outfit-component docs.
 *
 * RULE: Never status === "verified" for exploit methods.
 * Always tell players to re-test on their build and post platform + date.
 */
import type { GuideSeed } from "./seedTypes";

export const COMMUNITY_GUIDES: GuideSeed[] = [
  // ═══════════════════ GCTF ═══════════════════
  {
    slug: "gctf-full-setup-checklist",
    category: "gctf",
    title: "GCTF full setup checklist",
    summary: "Everything you need before any Give-Cars-To-Friends attempt. Community standard prep.",
    body: `## What GCTF is
**Give Cars To Friends** = transfer a personal vehicle into another player's garage by abusing ownership / interior loading bugs (MOC, Casino, Facility, Arena, etc.).

## Risk (read first)
- Rockstar removes glitched cars and sometimes money
- Some waves ban or sale-lock accounts
- Methods die every title update
- **This app never marks GCTF as working**

## Receiver usually needs
1. **MOC** with **Personal Vehicle Storage** (not only vehicle workshop)
2. Empty/replaceable garage slots
3. **Throwaway cars** (free Elegy RH8, bikes you don't mind losing)
4. A friend (donor) in the same **Invite Only** session
5. Same targeting mode (Free Aim / Assisted) as agreed

## Donor usually needs
1. The car to gift (insured personal vehicle)
2. Interaction Menu → Vehicle → **Vehicle Access = Passengers** (for single-seat cars)
3. Patience — many attempts fail cleanly

## Session rules (community)
- **Invite Only** only
- Both players block joins if possible
- Don't sell a freshly received car the same day
- Screenshot garage + bank before starting

## After any success
1. Drive the car into a **full garage** and replace a junk vehicle
2. Switch session (Story → Online) to force a save
3. Confirm the car is still there next login before celebrating

Sources: r/gtaglitches FAQ threads, Se7ensins GCTF writeups (often later marked Patched).`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 5,
    imageUrl: "/images/cat-gctf.jpg",
    sourceName: "r/gtaglitches community",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "gctf-moc-casino-method",
    category: "gctf",
    title: "GCTF — Casino + MOC method (community steps)",
    summary: "Widely posted MOC-behind-Casino flow. Frequently patched and unpatched. Full setup + step list.",
    body: `## Status
**Unverified.** Se7ensins and Reddit threads regularly retitle this **Patched**. Do not pay anyone for it.

## Requirements
- MOC with **Personal Vehicle storage**
- Casino access (garage + penthouse garage elevator)
- Free/junk personal car for the receiver
- Friend (donor) with the target car
- Invite Only session

## Setup
1. Receiver: call **MOC**, park near **Diamond Casino** so the blue board/circle at the trailer rear is clear
2. Put a **junk car** inside MOC vehicle storage (this slot gets replaced)
3. Donor: spawn the gift car nearby; set **Vehicle Access → Passengers**
4. Both stay in Invite Only, same targeting mode

## Steps (community-reported outline)
1. Receiver takes the junk car **out** of the MOC, then drives it into **Casino parking garage** and exits again — leave that car near the entrance
2. On foot, enter **Penthouse garage** elevator area
3. Hover **Penthouse**, open PS/Xbox home profile join / “join session” style overlay (community calls this EWO / home-menu timing), wait until character dies/respawns in background or you return glitched
4. Get back in your personal car; donor enters as **passenger** and opens the **pause menu** (stays paused)
5. Drive to MOC rear → press **Right on D-Pad** to store/enter — if timed right, passenger is ejected and you do **not** fully store
6. Reverse slightly so store prompt drops; exit vehicle
7. Hold **Down D-Pad** → switch to **Franklin** (story character) → when “leave GTA Online?” appears, press **Circle/B to cancel**. Repeat ~2 times
8. Walk to MOC blue circle → **Enter alone**
9. On the black loading screen wait ~5s → Franklin prompt again → **cancel**
10. If invisible: enter donor’s car (passenger door if needed) so it pulls into your MOC storage

## Save the car
- Pull a street/junk car, drive into a **full** garage, replace a slot
- Story mode → Online to force save
- Confirm next session

## Common fails
- MOC only has workshop bay (no PV storage)
- Donor forgot Passengers access
- Wrong timing on Franklin cancel
- Public lobby interference

## Rule
Post **PS4/PS5 + date** in chat if you test. If it fails, assume patched for your build.

Community refs: r/gtaglitches “Casino MOC GCTF”, Se7ensins GCTF threads.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 8,
    imageUrl: "/images/cat-gctf.jpg",
    sourceName: "r/gtaglitches · Se7ensins",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "gctf-arena-workshop-variant",
    category: "gctf",
    title: "GCTF — Arena Workshop / job join variant",
    summary: "Older Arena elevator + job-join populate method. Historical steps for recognition.",
    body: `## Status
**Unverified / often patched.** Listed so you can spot outdated YouTube reposts.

## Idea
Use Arena Workshop elevator hover + joining a friend’s job (spam X/A while “getting session details”) to corrupt interior state, fall through map, then MOC invisible enter.

## Typical requirements (old posts)
- Arena Workshop
- MOC PV storage
- Friend starting any short job
- Junk Elegy/bike

## Why it breaks
Rockstar patches session-join + interior transitions together. If a video is older than the latest title update, treat it as dead until re-verified by you.

## Safer note
Paying “GCTF services” is almost always a scam or account theft.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 4,
    imageUrl: "/images/cat-gctf.jpg",
    sourceName: "r/gtaglitches historical threads",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "gctf-facility-variant",
    category: "gctf",
    title: "GCTF — Facility circle variant",
    summary: "Facility yellow-circle + flip/OTR style reports. High complexity, high patch rate.",
    body: `## Status
**Unverified.** Multiple “Facility GCTF” posts later say fully patched.

## Outline (for awareness only)
1. Get an “OTR” / black-screen alert state via office garage party bus or similar
2. Job teleport toward Facility
3. Friend flips your car (ramp buggy / wedge) onto roof while Facility enter alert is held
4. Easy way out timing, then enter gifted car on Facility circle over a junk bike/car

## Reality check
If comments say “all GCTF patched today”, believe the latest comments, not the OP date.

## App policy
No GCTF method is confirmed here.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 4,
    imageUrl: "/images/cat-gctf.jpg",
    sourceName: "r/gtaglitches",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },

  // ═══════════════════ OUTFITS ═══════════════════
  {
    slug: "outfit-hat-mask-glasses",
    category: "outfits",
    title: "Hat + Mask + Glasses stack",
    summary: "Community solo methods (telescope / Ammu-Nation soda) to wear all three together.",
    body: `## Status
**Unverified.** Clothing glitches break often. Test in Invite Only. Save backups.

## Why the game blocks it
Hat/mask/glasses share equip slots. Animation interrupts can apply a new item without clearing the old one.

## Method A — Telescope (community)
1. Equip **hat/helmet + mask** (this pair is often already allowed)
2. Find a telescope (apartment, Agency, Facility, or map)
3. Run up and **spam interact** so the look-through anim starts but interrupts
4. During the interrupt, open Interaction Menu → equip **glasses**
5. Back away — if stacked, go to wardrobe/store and **save outfit**

## Method B — Ammu-Nation soda machine
1. Save an outfit that has your **helmet/hat**
2. Equip the **mask** you want (bodysuit/ski mask variants are common in guides)
3. At Ammu-Nation soda (e.g. near Simeon / La Mesa): interact, and while anim flickers open pause → **Invite Only** with spawn **Last Location**
4. If machine options are greyed, glitch may be holding — equip the saved helmet outfit
5. Interact again; re-apply mask mid-anim; save if stacked

## Tips
- Invite Only first
- Save immediately when it works
- If character mesh breaks, reload session

Public writeups: community clothing glitch roundups (2025–2026). Always re-test.`,
    status: "unverified",
    difficulty: "medium",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 6,
    imageUrl: "/images/cat-outfits.jpg",
    sourceName: "Community clothing glitch guides",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "outfit-shoe-merge-yoga",
    category: "outfits",
    title: "Shoe merge — Mansion yoga method",
    summary: "Transfer shoes from one saved outfit onto another using mansion rooftop yoga timing.",
    body: `## Status
**Unverified.** Works in waves on new-gen according to community posts; fails after some updates.

## Requirements
- Two **saved** outfits in Interaction Menu:
  - Outfit A = shoes you want
  - Outfit B = outfit that should receive the shoes
- Mansion rooftop **yoga mats** (yours or a friend’s)

## Console-style steps (community)
1. Wear **Outfit A** (donor shoes)
2. Start yoga on the mansion roof
3. Open Pause → Online
4. Hover **Safety and Alerts**
5. Timing trick: hold/release pause so yoga stick prompts appear on the Safety page (guides describe pause double-tap / hold patterns)
6. Open Interaction Menu **while still in yoga** → select **Outfit B**
7. Exit yoga — check shoes
8. If extra pieces merged, next time use a minimal “shoes-only” donor outfit

## Tips
- Force a save (change session) after success
- If semi-freeze fails, retry the pause timing — this glitch is timing-heavy

## PC
Similar idea with pause + Enter on Safety and Alerts while yoga is active, then swap outfit in Interaction Menu.

Refs: public “merge shoes onto any outfit” guides (2026 community articles).`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 6,
    imageUrl: "/images/cat-outfits.jpg",
    sourceName: "Community outfit merge guides",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "outfit-belt-merge-g-thing",
    category: "outfits",
    title: "Belt / component merge — It's a G Thing",
    summary: "Lamar job ‘It's a G Thing’ player-owned outfit swap used to merge belts and components.",
    body: `## Status
**Unverified.** Classic r/gtaglitches approach; job list and steps shift.

## Concept
Some jobs allow **Player Owned** outfits mid-mission. Switching slots inside the job can merge components (belts, adversary pieces, etc.) that freemode wardrobe blocks.

## Typical flow (community)
1. Build/save the pieces you care about (belt donor outfit, target outfit)
2. Bookmark/start Rockstar job **It's a G Thing** (Lamar / lowrider family jobs also appear in older posts)
3. Need a second player to start some versions
4. In-job: set clothing to **Player Owned**
5. Hover/switch between donor and target outfit slots as per the specific video for your goal (belt, BEFF pieces, ped bits)
6. Save at Ammu-Nation inside the job if the guide says so (wanted level management)
7. Leave job → register CEO → Style switch once to “settle” → save wardrobe

## GitHub angle
Community maintainers document **component transfer lists** (male↔female, merge vs transfer). Components ≠ normal store items. See public repos like outfit component lists on GitHub for *what can transfer*, not as a guarantee it still works.

## Safety
- Don't delete characters unless you fully understand transfer glitches (they can wipe slots)
- Keep slot 1 as main where guides require it`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 7,
    imageUrl: "/images/cat-outfits.jpg",
    sourceName: "r/gtaglitches · GitHub component lists",
    sourceUrl: "https://github.com/Droy1up/Transfer-Outfit-Components-List",
  },
  {
    slug: "outfit-component-transfer-overview",
    category: "outfits",
    title: "Component transfer overview (new-gen)",
    summary: "How component transfer differs from simple merges — character slots, creator, line-up room.",
    body: `## Components vs merges
- **Merge**: combine two freemode outfits / job outfit states
- **Transfer**: move non-shop **components** (adversary, checkered, special joggers, etc.) via creator / story / character management glitches

## Hard warnings (community consensus)
- Main character often must be **slot 1**
- Some methods **delete 2nd character** and wipe outfits — read twice
- Force **white + gold save** icons before transferring when guides mention it
- After Mansions / recent updates, people report needing a full game restart for components to appear

## High-level new-gen pattern (do not skip a full video for your platform)
1. Wear one outfit you must keep on main
2. Use 2nd character to build component outfits
3. Creator race tutorial / manage characters delete or overwrite flow
4. Load Story via friend join / targeting switch (platform-specific)
5. Back Online — components appear in slots
6. Merge remaining layers with jobs like **It's a G Thing**

## Status
**Unverified.** One wrong step deletes progress. This is advanced.

## Recommendation
If you only want fashion, use hat/mask/glasses or shoe merges first — lower blast radius.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 6,
    imageUrl: "/images/cat-outfits.jpg",
    sourceName: "r/gtaglitches outfit transfer threads",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "outfit-nvg-merge",
    category: "outfits",
    title: "Night-vision goggles on any outfit",
    summary: "Community NVG merge reports — settle with CEO style switch.",
    body: `## Status
**Unverified.**

## Common finish step
Many clothing glitches “settle” by:
1. Register CEO/MC
2. Interaction Menu → Style → switch outfit right then left
3. Save

## NVG notes
Guides vary (property anims, job merges). If goggles don't stick after style switch + session change, method is dead on your build.`,
    status: "unverified",
    difficulty: "medium",
    platforms: ["ps4", "ps5"],
    readMinutes: 3,
    imageUrl: "/images/cat-outfits.jpg",
  },

  // ═══════════════════ GLITCHES ═══════════════════
  {
    slug: "glitch-bogdan-replay-detailed",
    category: "glitches",
    title: "Doomsday Act II (Bogdan) replay — detailed",
    summary: "Classic duo replay. Many 2024–2026 reports say patched; some still debate. Full old setup.",
    body: `## Status
**Unverified — often reported patched** (including after major DLCs). Comments conflict; test at your own risk.

## Requirements
- Doomsday Heist progress with **Act II** finale ready
- 2 players
- Host is the one who must keep the heist

## Old method (historical)
1. Both start Act II finale
2. Near the very end (after final cutscene trigger / payout moment — guides differ by seconds)
3. Host **force-closes the game** (PS button → close application) so the heist does not save as completed for host
4. Associate stays until payout clears
5. Host reloads Online — Act II still ready

## Why Rockstar cares
It's a heist payout multiplier loop. Wipe waves have hit replay users historically.

## Safer money
Cayo solo, Agency, businesses — see Money guides.

## Chat rule
If you test: **platform + exact date + enhanced/legacy**.`,
    status: "unverified",
    difficulty: "medium",
    payout: "Finale payout × loops (risky)",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 5,
    imageUrl: "/images/cat-glitches.jpg",
    sourceName: "r/gtaglitches heist replay FAQ",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "glitch-agency-dre-replay",
    category: "glitches",
    title: "Agency / Dr. Dre contract replay",
    summary: "Non-solo Agency finale replay family. Platform notes differ (console vs PC Linux reports).",
    body: `## Status
**Unverified.** Appears on working-glitch boards as “Agency Replay” / “Dr Dre replay” with platform tags.

## Idea
Force the VIP contract finale to remain available after payout using quit timing or host migration tricks (exact steps are platform-specific and change).

## Community caution
- PC “Linux replay” variants are **not** the same as console steps
- Always match the guide to **PS4 / PS5 / enhanced**
- Money glitches = highest wipe priority

## Better
Play the Dre contract normally for the $1M first clear, then use Cayo.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 4,
    imageUrl: "/images/cat-glitches.jpg",
    sourceName: "r/gtaglitches working list",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "glitch-car-dupe-overview",
    category: "glitches",
    title: "Car duplication — how dupes work (overview)",
    summary: "Clean vs dirty dupes, plates, sell caps, and why methods die. No fake ‘working 100%’ claim.",
    body: `## Status
**Unverified.** Something is usually “working” on glitch boards — until the next patch.

## Concepts (community vocabulary)
- **Dupe**: copy a vehicle into another garage slot
- **Clean dupe**: aims for normal plates / lower detect
- **Dirty dupe**: odd plates, easier flags
- **Car-to-car merge**: move mods/plates between cars
- **Magic slots**: special garage slot behavior after flips
- **GCTF**: give copy to another player (related but different)

## Sell reality (changes with patches)
Community FAQs mention sell value nerfs, daily sell limits, multi-sell penalties, and multi-day resets. **Never** dump many dupes in one day.

## Where people track “working”
- r/gtaglitches “Working Glitches Thread”
- gtaglitches.com working list
- Their Discord (invite via subreddit)

## This app
We explain systems and risk. We do **not** certify a dupe as live on your build.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 6,
    imageUrl: "/images/cat-glitches.jpg",
    sourceName: "r/gtaglitches · gtaglitches.com",
    sourceUrl: "https://gtaglitches.com/working-glitches",
  },
  {
    slug: "glitch-moc-merge-dupe",
    category: "glitches",
    title: "MOC merge / dupe family",
    summary: "MOC storage is the backbone of many merge, dupe, and GCTF routes.",
    body: `## Why MOC matters
Personal vehicle storage on the **Mobile Operations Center** is used in:
- GCTF invisible-enter steps
- Solo merge posts
- Some dupe chains

## Requirement
MOC bought with **Personal Vehicle** bay — vehicle workshop alone is not enough for PV glitches.

## Status
Individual recipes flip between working/patched weekly. If a step involves Franklin cancel + black screen + invisible, you're in this family.

## Safety
- Use junk cars as sacrifice slots
- Full garage replace to ‘solidify’
- Session change to save`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 4,
    imageUrl: "/images/cat-glitches.jpg",
    sourceName: "r/gtaglitches MOC threads",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "glitch-lscm-merge",
    category: "glitches",
    title: "LS Car Meet car-to-car merge",
    summary: "LSCM merge posts: move properties between cars inside the meet.",
    body: `## Status
**Unverified.** Listed on working boards as non-solo LSCM merge — still patchable anytime.

## Idea
Use Car Meet test track / meet interior transitions plus two player-owned cars to copy mods or create merge states.

## Practical advice
- Invite Only meet when possible
- Screenshot both cars’ LS Customs summary before
- Don't overwrite your only copy of a rare car

## Related
Car-to-car merge outside LSCM also exists in PC/console variants — different steps.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 4,
    imageUrl: "/images/cat-glitches.jpg",
    sourceName: "r/gtaglitches vehicle glitches list",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "glitch-beff-overview",
    category: "glitches",
    title: "BEFF overview (account-level risk)",
    summary: "Bare-bones explanation of BEFF-style methods. Highest risk class.",
    body: `## What people mean by BEFF
Account/character duplication or environment-flip methods (often **2 consoles**, special network setups on new-gen). Used to copy progress, money, or unlocks depending on the variant.

## Status
**Unverified** and **extreme risk**.
- Console bans
- Character rollbacks
- Full account resets

## App policy
We do **not** publish step-by-step BEFF networking instructions. If you see paid BEFF services, treat as scam/malware/account theft.

## Read instead
Money guides (Cayo, Agency, businesses).`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 3,
    imageUrl: "/images/cat-glitches.jpg",
    sourceName: "r/gtaglitches risk warnings",
    sourceUrl: "https://www.reddit.com/r/gtaglitches/",
  },
  {
    slug: "glitch-semi-frozen-money",
    category: "glitches",
    title: "Semi-frozen money (what it is)",
    summary: "Community term for money that doesn't save correctly — wipe magnet.",
    body: `## Meaning
‘Semi-frozen’ = balance looks high but cloud save / session switches don't retain it cleanly — or it triggers anti-cheat later.

## Status
**Unverified / dangerous.** Boards list solo variants; Rockstar targets these hard.

## Tell
- Money vanishes next day
- Transactions fail
- Sudden wipe

## Don't
Buy expensive stuff immediately with glitched funds hoping it ‘sticks’.`,
    status: "unverified",
    difficulty: "hard",
    platforms: ["ps4", "ps5"],
    readMinutes: 3,
    imageUrl: "/images/cat-glitches.jpg",
  },
  {
    slug: "glitch-working-list-how-to-track",
    category: "glitches",
    title: "How to track what still works",
    summary: "Where the community posts live status — and how to read it safely.",
    body: `## Best public trackers
1. **Reddit** r/gtaglitches — Working Glitches Thread + comments (newest comments win)
2. **gtaglitches.com** working list / articles
3. **Discord** linked from the subreddit (fastest patch alerts)
4. **Se7ensins** threads (check ‘Patched’ tags)
5. **GitHub** outfit component lists (clothing data, not live status)

## How to read a post
- Sort by **new**
- Ignore titles that say “WORKING 100% 2026” without comments
- Match **PS4 vs PS5 vs enhanced**
- If 10 comments say patched, it's patched

## YouTube
Use for visuals only after Reddit says it's alive. Many reupload dead methods.

## This app
Guides stay labeled **unverified/patched**. Chat is for date-stamped reports.`,
    status: "verified",
    difficulty: "easy",
    platforms: ["ps4", "ps5"],
    featured: true,
    readMinutes: 4,
    imageUrl: "/images/cat-glitches.jpg",
    sourceName: "r/gtaglitches · gtaglitches.com",
    sourceUrl: "https://gtaglitches.com/working-glitches",
  },
];
