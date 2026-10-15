/** Pick a banner for a guide from slug keywords + category. */
const bust = (p: string) => p + (p.includes("?") ? "" : "?v=5");

export function guideBanner(slug: string, category: string, fallback?: string | null): string {
  const s = slug.toLowerCase();

  if (s.startsWith("gg-") || category === "outfits" || s.includes("outfit") || s.startsWith("merge-")) {
    if (category === "outfits" || s.includes("outfit") || s.includes("merge") || s.includes("mask") || s.includes("hat") || s.includes("shoe") || s.includes("duffle") || s.includes("jogger") || s.includes("paint") || s.includes("glove") || s.includes("helmet") || s.includes("suit") || s.includes("jacket") || s.includes("transfer") || s.includes("component") || s.includes("belt") || s.includes("nvg") || s.includes("glasses") || s.includes("parachute") || s.includes("bodysuit") || s.includes("necklace") || s.includes("badge")) {
      return bust(outfitArt(s));
    }
  }

  if (s.startsWith("gg-")) {
    if (s.includes("gctf") || s.includes("give-") || category === "gctf") return bust("/images/glitch-gctf.jpg");
    if (category === "money" || s.includes("beff") || s.includes("frozen") || s.includes("money") || s.includes("replay")) {
      return bust("/images/money-banner.jpg");
    }
    if (s.includes("dupe") || s.includes("merge")) return bust("/images/glitch-dupe.jpg");
    if (s.includes("god") || s.includes("otr") || s.includes("heist")) return bust("/images/glitch-heist.jpg");
    if (category === "glitches") return bust("/images/glitch-banner.jpg");
  }

  if (s.includes("gctf") || s.includes("casino-moc") || s.includes("facility") || s.includes("arena-workshop")) {
    return bust("/images/glitch-gctf.jpg");
  }
  if (s.includes("bogdan") || s.includes("heist") || s.includes("dre") || s.includes("cayo") || s.includes("agency")) {
    return bust("/images/glitch-heist.jpg");
  }
  if (s.includes("dupe") || (s.includes("merge") && s.includes("car")) || s.includes("moc-merge") || s.includes("lscm")) {
    return bust("/images/glitch-dupe.jpg");
  }
  if (category === "outfits") return bust(outfitArt(s));
  if (category === "gctf") return bust("/images/gctf-banner.jpg");
  if (category === "glitches") return bust("/images/glitch-banner.jpg");
  if (category === "money") return bust("/images/money-banner.jpg");
  return bust(fallback || "/images/glitch-banner.jpg");
}

function outfitArt(s: string): string {
  if (s.includes("shoe") || s.includes("boot") || s.includes("footwear")) return "/images/outfit-shoes.jpg";
  if (s.includes("paint") || s.includes("makeup") || s.includes("face")) return "/images/outfit-paint.jpg";
  if (s.includes("glove") || s.includes("watch")) return "/images/outfit-gloves.jpg";
  if (s.includes("mask") || s.includes("glasses") || s.includes("bandana") || s.includes("balaclava")) {
    return "/images/outfit-mask.jpg";
  }
  if (s.includes("helmet") || s.includes("hat") || s.includes("cap") || s.includes("beanie")) {
    return "/images/outfit-helmet.jpg";
  }
  if (s.includes("duffle") || s.includes("chute") || s.includes("parachute") || s.includes("bag")) {
    return "/images/outfit-duffle.jpg";
  }
  if (s.includes("jogger") || s.includes("gorka") || s.includes("pants") || s.includes("cargo")) {
    return "/images/outfit-joggers.jpg";
  }
  if (s.includes("biker") || s.includes("kutte") || s.includes("halloween")) return "/images/outfit-biker.jpg";
  if (s.includes("suit") || s.includes("tie") || s.includes("overcoat") || s.includes("formal")) {
    return "/images/outfit-suit.jpg";
  }
  if (s.includes("jacket") || s.includes("hoodie") || s.includes("shirt")) return "/images/outfit-street.jpg";
  if (s.includes("tactical") || s.includes("armor") || s.includes("vest") || s.includes("holster")) {
    return "/images/outfit-tactical.jpg";
  }
  if (s.includes("merge") || s.includes("component") || s.includes("transfer") || s.includes("belt")) {
    return "/images/outfit-merge.jpg";
  }
  if (s.includes("street") || s.includes("ceo") || s.includes("fit")) return "/images/outfit-street.jpg";

  const arts = [
    "/images/outfit-tactical.jpg",
    "/images/outfit-street.jpg",
    "/images/outfit-formal.jpg",
    "/images/outfit-mask.jpg",
    "/images/outfit-merge.jpg",
    "/images/outfit-suit.jpg",
    "/images/outfit-helmet.jpg",
    "/images/outfit-joggers.jpg",
    "/images/outfit-shoes.jpg",
    "/images/outfit-paint.jpg",
    "/images/outfit-gloves.jpg",
    "/images/outfit-duffle.jpg",
    "/images/outfit-biker.jpg",
    "/images/outfit-banner.jpg",
  ];
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return arts[h % arts.length];
}

export function categoryHero(category: string): string {
  switch (category) {
    case "money":
      return bust("/images/money-banner.jpg");
    case "outfits":
      return bust("/images/outfit-banner.jpg");
    case "glitches":
      return bust("/images/glitch-banner.jpg");
    case "gctf":
      return bust("/images/gctf-banner.jpg");
    default:
      return bust("/images/news-banner.jpg");
  }
}
