"use client";
/**
 * Fun zone: weather (Open-Meteo), random cat (TheCatAPI), random dog (Dog CEO).
 * All free public APIs — optional CAT_API_KEY raises TheCatAPI rate limits.
 */
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { apiFetch, ClientApiError } from "@/lib/api/client";

type Meteo = {
  city: string;
  current: {
    tempC: number | null;
    feelsLikeC: number | null;
    humidity: number | null;
    windKmh: number | null;
    label: string;
    code: number;
  };
  daily: Array<{ date: string; maxC: number | null; minC: number | null; label: string }>;
  source: string;
};

type Pet = { url: string; breed?: string; source: string };

const CITIES: Array<{ name: string; lat: number; lon: number; region?: string }> = [
  // Italy (default zone)
  { name: "Roma", lat: 41.9028, lon: 12.4964, region: "IT" },
  { name: "Milano", lat: 45.4642, lon: 9.1900, region: "IT" },
  { name: "Napoli", lat: 40.8518, lon: 14.2681, region: "IT" },
  { name: "Torino", lat: 45.0703, lon: 7.6869, region: "IT" },
  { name: "Firenze", lat: 43.7696, lon: 11.2558, region: "IT" },
  { name: "Bologna", lat: 44.4949, lon: 11.3426, region: "IT" },
  { name: "Palermo", lat: 38.1157, lon: 13.3615, region: "IT" },
  { name: "Genova", lat: 44.4056, lon: 8.9463, region: "IT" },
  { name: "Venezia", lat: 45.4408, lon: 12.3155, region: "IT" },
  { name: "Verona", lat: 45.4384, lon: 10.9916, region: "IT" },
  // Also useful
  { name: "Los Santos", lat: 34.0522, lon: -118.2437, region: "GTA" },
  { name: "London", lat: 51.5074, lon: -0.1278, region: "UK" },
];

export function FunHub() {
  const [city, setCity] = useState(CITIES[0]);
  const [weather, setMeteo] = useState<Meteo | null>(null);
  const [wErr, setWErr] = useState<string | null>(null);
  const [wLoading, setWLoading] = useState(true);

  const [cat, setCat] = useState<Pet | null>(null);
  const [dog, setDog] = useState<Pet | null>(null);
  const [catErr, setCatErr] = useState<string | null>(null);
  const [dogErr, setDogErr] = useState<string | null>(null);
  const [catLoading, setCatLoading] = useState(false);
  const [dogLoading, setDogLoading] = useState(false);

  const loadMeteo = useCallback(async (c: (typeof CITIES)[number]) => {
    setWLoading(true);
    setWErr(null);
    try {
      const q = new URLSearchParams({ lat: String(c.lat), lon: String(c.lon), city: c.name });
      const res = await apiFetch<Meteo>(`/api/fun/weather?${q}`, { timeoutMs: 10000, skipAuth: true });
      setMeteo(res);
    } catch (err) {
      setWErr(err instanceof ClientApiError ? err.message : "Meteo unavailable.");
    } finally {
      setWLoading(false);
    }
  }, []);

  const loadCat = useCallback(async () => {
    setCatLoading(true);
    setCatErr(null);
    try {
      const res = await apiFetch<Pet>("/api/fun/cat", { timeoutMs: 10000, skipAuth: true });
      setCat(res);
    } catch (err) {
      setCatErr(err instanceof ClientApiError ? err.message : "Cat API unavailable.");
    } finally {
      setCatLoading(false);
    }
  }, []);

  const loadDog = useCallback(async () => {
    setDogLoading(true);
    setDogErr(null);
    try {
      const res = await apiFetch<Pet>("/api/fun/dog", { timeoutMs: 10000, skipAuth: true });
      setDog(res);
    } catch (err) {
      setDogErr(err instanceof ClientApiError ? err.message : "Dog API unavailable.");
    } finally {
      setDogLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void loadMeteo(city), 0);
    return () => window.clearTimeout(t);
  }, [city, loadMeteo]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void loadCat();
      void loadDog();
    }, 0);
    return () => window.clearTimeout(t);
  }, [loadCat, loadDog]);

  return (
    <div className="space-y-5">
      {/* Meteo */}
      <section className="overflow-hidden rounded-2xl border border-sky-400/30 bg-gradient-to-br from-sky-600/20 via-[#0e1420] to-indigo-600/10">
        <div className="border-b border-white/5 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">Meteo</p>
              <h2 className="text-lg font-black">Meteo Italia</h2>
            </div>
            <Badge tone="blue">Open-Meteo</Badge>
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {CITIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setCity(c)}
                className={`tap shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  city.name === c.name ? "border-sky-400/50 bg-sky-400/20 text-sky-200" : "border-white/10 bg-white/5 text-muted"
                }`}
              >
                {c.region === "IT" ? "🇮🇹 " : c.region === "GTA" ? "🎮 " : ""}{c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 py-4">
          {wLoading && <LoadingState label="Fetching weather…" />}
          {wErr && <ErrorState message={wErr} onRetry={() => void loadMeteo(city)} />}
          {weather && !wLoading && (
            <div>
              <p className="text-sm text-muted">{weather.city}</p>
              <p className="mt-1 text-5xl font-black tracking-tight">
                {weather.current.tempC != null ? `${Math.round(weather.current.tempC)}°` : "—"}
                <span className="ml-2 text-lg font-semibold text-sky-300">{weather.current.label}</span>
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl border border-white/5 bg-black/20 p-2">
                  <p className="text-faint">Feels</p>
                  <p className="font-bold">{weather.current.feelsLikeC != null ? `${Math.round(weather.current.feelsLikeC)}°` : "—"}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 p-2">
                  <p className="text-faint">Humidity</p>
                  <p className="font-bold">{weather.current.humidity != null ? `${weather.current.humidity}%` : "—"}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 p-2">
                  <p className="text-faint">Wind</p>
                  <p className="font-bold">{weather.current.windKmh != null ? `${Math.round(weather.current.windKmh)} km/h` : "—"}</p>
                </div>
              </div>
              {weather.daily.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {weather.daily.map((d) => (
                    <div key={d.date} className="flex items-center justify-between rounded-lg bg-black/15 px-3 py-2 text-xs">
                      <span className="text-muted">{d.date}</span>
                      <span className="text-faint">{d.label}</span>
                      <span className="font-semibold">
                        {d.maxC != null ? Math.round(d.maxC) : "—"}° / {d.minC != null ? Math.round(d.minC) : "—"}°
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-[10px] text-faint">{weather.source}</p>
            </div>
          )}
        </div>
      </section>

      {/* Pets */}
      <div className="grid grid-cols-1 gap-4">
        <PetCard
          title="Random Cat"
          accent="pink"
          badge="TheCatAPI"
          pet={cat}
          error={catErr}
          loading={catLoading}
          onRefresh={() => void loadCat()}
        />
        <PetCard
          title="Random Dog"
          accent="amber"
          badge="Dog CEO"
          pet={dog}
          error={dogErr}
          loading={dogLoading}
          onRefresh={() => void loadDog()}
          subtitle={dog?.breed}
        />
      </div>
    </div>
  );
}

function PetCard({
  title,
  accent,
  badge,
  pet,
  error,
  loading,
  onRefresh,
  subtitle,
}: {
  title: string;
  accent: "pink" | "amber";
  badge: string;
  pet: Pet | null;
  error: string | null;
  loading: boolean;
  onRefresh: () => void;
  subtitle?: string;
}) {
  const border = accent === "pink" ? "border-pink-400/30" : "border-amber-400/30";
  const grad = accent === "pink" ? "from-pink-600/20 to-fuchsia-600/5" : "from-amber-500/20 to-orange-600/5";
  const tone = accent === "pink" ? "pink" : "amber";
  return (
    <section className={`overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${grad}`}>
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div>
          <h2 className="text-base font-black">{title}</h2>
          {subtitle && <p className="text-xs capitalize text-muted">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={tone === "pink" ? "red" : "amber"}>{badge}</Badge>
          <Button size="sm" variant="secondary" loading={loading} onClick={onRefresh}>
            New
          </Button>
        </div>
      </div>
      <div className="px-4 pb-4">
        {loading && !pet && <LoadingState label="Loading…" />}
        {error && <ErrorState message={error} onRetry={onRefresh} />}
        {pet && (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pet.url} alt={title} className="max-h-72 w-full object-cover" loading="lazy" />
            <p className="px-2 py-1.5 text-[10px] text-faint">{pet.source}</p>
          </div>
        )}
      </div>
    </section>
  );
}
