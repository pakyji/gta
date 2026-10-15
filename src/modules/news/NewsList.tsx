"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { SafeImage } from "@/components/ui/SafeImage";
import { FilterChips, SearchBar } from "@/components/ui/SearchBar";
import { EmptyState, ErrorState, SkeletonCard } from "@/components/ui/States";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { NewsKind } from "@/lib/constants";
import type { NewsItem } from "./types";

type Filter = "all" | NewsKind;
interface Resp {
  items: NewsItem[];
  feed?: { configured: boolean; url: string | null };
}

export function NewsList({ initialKind = "all" }: { initialKind?: Filter }) {
  const [kind, setKind] = useState<Filter>(initialKind);
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 300);
  const [data, setData] = useState<Resp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const reqRef = useRef(0);

  const load = useCallback(async () => {
    const id = ++reqRef.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (kind !== "all") params.set("kind", kind);
      if (dq.trim()) params.set("q", dq.trim());
      const res = await apiFetch<Resp>(`/api/news?${params}`);
      if (id === reqRef.current) setData(res);
    } catch (err) {
      if (id === reqRef.current) setError(err instanceof ClientApiError ? err.message : "Could not load news.");
    } finally {
      if (id === reqRef.current) setLoading(false);
    }
  }, [kind, dq]);

  useEffect(() => {
    // Start the load after mount so state updates never run synchronously inside the effect.
    const boot = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(boot);
  }, [load]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <SafeImage src="/images/news-weekly.jpg" alt="" className="h-36 w-full" imgClassName="h-36 w-full object-cover" height={144} fallback="/images/news-daily.jpg" />
        <div className="-mt-36 relative flex h-36 flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent p-4">
          <p className="font-label text-sky-300">GTA Online</p>
          <p className="text-[1.35rem] font-black text-white drop-shadow">News & weekly intel</p>
        </div>
      </div>

      <SearchBar value={q} onChange={setQ} placeholder="Search updates…" />
      <FilterChips<Filter>
        value={kind}
        onChange={setKind}
        options={[
          { value: "all", label: "All" },
          { value: "weekly", label: "Weekly" },
          { value: "daily", label: "Daily" },
          { value: "event", label: "Events" },
        ]}
      />

      {error && <ErrorState message={error} onRetry={() => void load()} retrying={loading} />}
      {loading && !data && (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      {data && data.items.length === 0 && !error && (
        <EmptyState icon="📰" title="No updates found" body={q ? `Nothing matches "${q}".` : "Check back soon."} />
      )}

      <ul className="space-y-3">
        {data?.items.map((n) => (
          <li key={n.id}>
            <Link href={`/news/${n.slug}`} className="tap card overflow-hidden border border-white/10 active:scale-[0.99]">
              <SafeImage
                src={n.imageUrl || "/images/news-weekly.jpg"}
                alt={n.title}
                className="h-40 w-full"
                imgClassName="h-40 w-full object-cover"
                height={160}
                fallback="/images/news-daily.jpg"
              />
              <div className="p-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone={n.kind === "weekly" ? "purple" : n.kind === "daily" ? "blue" : "red"}>{n.kind}</Badge>
                  <span className="ml-auto text-[12px] font-semibold text-faint">{formatDate(n.publishedAt)}</span>
                </div>
                <h3 className="mt-2 text-[17px] font-black leading-snug tracking-tight">{n.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted line-clamp-2">{n.summary}</p>
                <p className="mt-2 truncate text-[11px] text-faint">Source: {n.sourceName}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
