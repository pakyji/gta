/**
 * Index of the gtaglitches.com "working glitches" list.
 *
 * Each entry holds only the title, mode, platforms and a link to the source.
 * Step-by-step text is NOT copied from gtaglitches.com or Reddit. Users open
 * the source link for the method. Every entry stays "unverified" in the app,
 * because lists change after each Rockstar update.
 */
import type { GuideCategory } from "@/lib/constants";
import type { GuideSeed } from "./seedTypes";
import { GLITCH_INDEX_RAW } from "./gtaglitchesIndexData";

export const GTAGLITCHES_SOURCE_NAME = "gtaglitches.com working list";
const REDDIT_BASE = "https://www.reddit.com/r/gtaglitches/";

const CATEGORY: Record<string, GuideCategory> = { M: "money", O: "outfits", G: "glitches" };
const PLATFORM: Record<string, string> = { P: "PC", S: "PlayStation", X: "Xbox" };
const MODE: Record<string, string> = { s: "Solo", ss: "Semi-solo", ns: "Non-solo", u: "Unlisted" };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildCatalog(): GuideSeed[] {
  const seen = new Map<string, number>();
  const out: GuideSeed[] = [];

  for (const line of GLITCH_INDEX_RAW.split("\n")) {
    const row = line.trim();
    if (!row) continue;
    const [cat, title, plats, mode, path] = row.split("|");
    if (!cat || !title || !path) continue;

    const platforms = [...(plats ?? "")].map((c) => PLATFORM[c]).filter(Boolean);
    const modeLabel = MODE[mode] ?? "Solo";
    const platformLabel = platforms.length ? platforms.join(", ") : "See source";
    const url = REDDIT_BASE + path;

    // Keep slugs unique: a duplicate title gets a numeric suffix.
    let slug = "gg-" + slugify(title);
    const n = seen.get(slug) ?? 0;
    seen.set(slug, n + 1);
    if (n > 0) slug = `${slug}-${n + 1}`;

    out.push({
      slug,
      category: CATEGORY[cat] ?? "glitches",
      title,
      summary: `${modeLabel} · ${platformLabel}`,
      body: [
        "## Index entry",
        `- **Mode:** ${modeLabel}`,
        `- **Platforms (listing):** ${platformLabel}`,
        "- **Status in this app:** unverified. Glitches change after every Rockstar patch.",
        "",
        "## How to use this entry",
        "The method is on the source page, linked below. Read the newest comments there for \"patched\" reports before you try it. Test in Invite Only where possible, and keep backups of your save.",
        "",
        "## Source",
        url,
      ].join("\n"),
      status: "unverified",
      platforms,
      sourceName: GTAGLITCHES_SOURCE_NAME,
      sourceUrl: url,
      featured: false,
      readMinutes: 1,
    });
  }
  return out;
}

export const GTAGLITCHES_CATALOG: GuideSeed[] = buildCatalog();
