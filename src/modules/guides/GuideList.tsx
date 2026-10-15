"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, statusLabel, statusTone } from "@/components/ui/Badge";
import { SafeImage } from "@/components/ui/SafeImage";
import { FilterChips, SearchBar } from "@/components/ui/SearchBar";
import { EmptyState, ErrorState, SkeletonCard } from "@/components/ui/States";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { GUIDE_CATEGORY_LABEL, type GuideCategory } from "@/lib/constants";
import type { GuideItem } from "./types";
import { categoryHero, guideBanner } from "./images";

type Filter = "all" | GuideCategory;

export function GuideList({ initialCategory = "all" }: { initialCategory?: Filter }) {
  const [category, setCategory] = useState<Filter>(initialCategory);
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 300);
  const [items, setItems] = useState<GuideItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const reqRef = useRef(0);

  const load = useCallback(async () => {
    const id = ++reqRef.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (dq.trim()) params.set("q", dq.trim());
      const res = await apiFetch<{ items: GuideItem[] }>(`/api/guides?${params}`);
      if (id === reqRef.current) setItems(res.items);
    } catch (err) {
      if (id === reqRef.current) setError(err instanceof ClientApiError ? err.message : "Could not load guides.");
    } finally {
      if (id === reqRef.current) setLoading(false);
    }
  }, [category, dq]);

  useEffect(() => {
    // Start the load after mount so state updates never run synchronously inside the effect.
    const boot = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(boot);
  }, [load]);

  const hero = category === "all" ? "/images/glitch-banner.jpg?v=5" : categoryHero(category);
  const fb = category === "outfits" ? "/images/outfit-banner.jpg?v=5" : "/images/glitch-banner.jpg?v=5";

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <SafeImage src={hero} alt="" height={144} className="h-36 w-full" imgClassName="h-36 w-full object-cover" fallback={fb} />
        <div className="-mt-36 relative flex h-36 flex-col justify-end bg-gradient-to-r from-black via-black/65 to-transparent p-4">
          <p className="font-label text-pink-300">{category === "all" ? "Library" : GUIDE_CATEGORY_LABEL[category]}</p>
          <p className="text-[1.25rem] font-black tracking-tight text-white drop-shadow">
            {category === "outfits" ? "Outfit guides · with pictures" : category === "glitches" || category === "gctf" ? "Unverified methods · setups inside" : "Guides with pictures & steps"}
          </p>
        </div>
        <div className="mix-line" />
      </div>

      <SearchBar value={q} onChange={setQ} placeholder="Search guides…" />
      <FilterChips<Filter>
        value={category}
        onChange={setCategory}
        options={[{ value: "all", label: "All" }, ...(Object.keys(GUIDE_CATEGORY_LABEL) as GuideCategory[]).map((c) => ({ value: c, label: GUIDE_CATEGORY_LABEL[c] }))]}
      />
      {(category === "glitches" || category === "gctf") && (
        <p className="rounded-xl border border-neon-amber/30 bg-neon-amber/10 px-3 py-2.5 text-[13px] leading-relaxed text-[#fcd34d]">
          Glitches and GCTF are never marked confirmed working. Check status badge and re-test on your build.
        </p>
      )}
      {error && <ErrorState message={error} onRetry={() => void load()} retrying={loading} />}
      {loading && !items && (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      {items && items.length === 0 && !error && <EmptyState icon="📘" title="No guides found" body={q ? `Nothing matches "${q}".` : "Try another category."} />}
      {items && items.length > 0 && <p className="text-[13px] font-bold text-faint">{items.length} guides</p>}
      <ul className="space-y-3">
        {items?.map((g) => {
          const src = g.imageUrl || guideBanner(g.slug, g.category, null);
          return (
            <li key={g.id}>
              <Link href={`/guides/${g.slug}`} className="tap card card-glow flex min-h-[112px] overflow-hidden border border-white/10 active:scale-[0.99]">
                <SafeImage
                  src={src}
                  alt={g.title}
                  width={120}
                  height={112}
                  className="h-[112px] w-[112px] shrink-0 sm:w-[128px]"
                  imgClassName="h-[112px] w-full object-cover"
                  fallback={g.category === "outfits" ? "/images/outfit-banner.jpg?v=5" : "/images/glitch-banner.jpg?v=5"}
                />
                <div className="min-w-0 flex-1 py-3 pl-3 pr-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="neutral">{GUIDE_CATEGORY_LABEL[g.category]}</Badge>
                    <Badge tone={statusTone(g.status)}>{statusLabel(g.status)}</Badge>
                    {(g.status === "outdated" || (g.stale && g.status === "verified")) && <Badge tone="neutral">Outdated</Badge>}
                  </div>
                  <h3 className="text-clamp-2 mt-1.5 text-[16px] font-black leading-snug tracking-tight">{g.title}</h3>
                  <p className="text-clamp-2 mt-1 text-[13px] text-muted">{g.summary}</p>
                  {g.payout && <p className="mt-1.5 truncate text-[13px] font-bold text-neon-green">{g.payout}</p>}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
