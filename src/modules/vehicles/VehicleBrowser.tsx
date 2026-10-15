"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { SafeImage } from "@/components/ui/SafeImage";
import { FilterChips, SearchBar } from "@/components/ui/SearchBar";
import { EmptyState, ErrorState, SkeletonCard } from "@/components/ui/States";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { formatPrice, type Vehicle } from "./data";
import { vehicleClassImage, vehicleThumbGradient } from "./images";

type ClassOpt = { id: string; label: string; imageUrl?: string };
type VehicleDTO = Vehicle & { imageUrl: string };

export function VehicleBrowser() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 250);
  const [cls, setCls] = useState("all");
  const [items, setItems] = useState<VehicleDTO[] | null>(null);
  const [classes, setClasses] = useState<ClassOpt[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (dq.trim()) params.set("q", dq.trim());
      if (cls !== "all") params.set("class", cls);
      const res = await apiFetch<{ items: VehicleDTO[]; classes: ClassOpt[]; note: string; total: number }>(
        `/api/vehicles?${params}`,
        { skipAuth: true, timeoutMs: 8000 },
      );
      setItems(res.items);
      setClasses(res.classes);
      setNote(res.note);
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Could not load vehicles.");
    } finally {
      setLoading(false);
    }
  }, [dq, cls]);

  useEffect(() => {
    // Start the load after mount so state updates never run synchronously inside the effect.
    const boot = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(boot);
  }, [load]);

  const chips = useMemo(
    () => [{ value: "all", label: "All" }, ...classes.map((c) => ({ value: c.id, label: c.label }))],
    [classes],
  );

  const heroSrc = cls === "all" ? "/images/veh-default.jpg" : vehicleClassImage(cls);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <SafeImage src={heroSrc} alt="Vehicles" height={160} className="h-40 w-full" imgClassName="h-40 w-full object-cover" fallback="/images/veh-default.jpg?v=5" />
        <div className="-mt-40 relative flex h-40 flex-col justify-end bg-gradient-to-t from-black via-black/55 to-transparent p-4">
          <p className="font-label text-cyan-300">GTA Online</p>
          <p className="title-lg text-white drop-shadow">Vehicle catalog</p>
        </div>
        <div className="mix-line" />
      </div>

      <SearchBar value={q} onChange={setQ} placeholder="Search name, brand, shop…" />
      <FilterChips value={cls} onChange={setCls} options={chips} />
      {note && <p className="text-[13px] leading-relaxed text-muted">{note}</p>}
      {error && <ErrorState message={error} onRetry={() => void load()} />}
      {loading && !items && (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      {items && items.length === 0 && !error && <EmptyState icon="🚗" title="No vehicles found" body="Try another search or class filter." />}
      {items && items.length > 0 && <p className="text-[13px] font-bold text-faint">{items.length} vehicles</p>}

      <ul className="space-y-3">
        {items?.map((v) => (
          <li key={v.id} className="card card-glow overflow-hidden border border-white/10">
            <div className="flex min-h-[120px]">
              <SafeImage
                src={v.imageUrl || vehicleClassImage(v.class)}
                alt={v.name}
                width={128}
                height={120}
                className={`h-[120px] w-[120px] shrink-0 sm:w-[140px] bg-gradient-to-br ${vehicleThumbGradient(v.class)}`}
                imgClassName="h-[120px] w-full object-cover"
                fallback="/images/veh-default.jpg?v=5"
              />
              <div className="min-w-0 flex-1 p-3.5">
                <p className="font-label text-violet-300/90">{v.brand}</p>
                <h3 className="mt-0.5 text-[1.15rem] font-black leading-tight tracking-tight">{v.name}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone="blue">{v.shop}</Badge>
                  <Badge tone="neutral">{v.class.replace(/_/g, " ")}</Badge>
                  {v.note && <Badge tone="amber">Note</Badge>}
                </div>
                {v.note && <p className="mt-2 text-[13px] text-muted">{v.note}</p>}
                <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/5 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-faint">Base retail</span>
                  <span className="font-price whitespace-nowrap text-[1.05rem] tabular-nums text-neon-green sm:text-[1.15rem]">{formatPrice(v.price)}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
