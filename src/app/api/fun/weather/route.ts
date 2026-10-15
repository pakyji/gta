import { NextResponse } from "next/server";
import { handleApi, badRequest } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

/** Open-Meteo — free, no API key. */
const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

export const GET = handleApi(async (req) => {
  const sp = new URL(req.url).searchParams;
  const lat = Number(sp.get("lat") ?? "41.9028"); // Roma default
  const lon = Number(sp.get("lon") ?? "12.4964");
  const city = (sp.get("city") ?? "Roma").slice(0, 40);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw badRequest("Invalid coordinates.");

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`Weather upstream ${res.status}`);
    const data = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        apparent_temperature?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        time?: string;
      };
      daily?: {
        time?: string[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        weather_code?: number[];
      };
      timezone?: string;
    };
    const code = data.current?.weather_code ?? 0;
    return NextResponse.json({
      city,
      lat,
      lon,
      timezone: data.timezone ?? "auto",
      current: {
        tempC: data.current?.temperature_2m ?? null,
        feelsLikeC: data.current?.apparent_temperature ?? null,
        humidity: data.current?.relative_humidity_2m ?? null,
        windKmh: data.current?.wind_speed_10m ?? null,
        code,
        label: WMO[code] ?? "Unknown",
        time: data.current?.time ?? null,
      },
      daily: (data.daily?.time ?? []).map((day, i) => ({
        date: day,
        maxC: data.daily?.temperature_2m_max?.[i] ?? null,
        minC: data.daily?.temperature_2m_min?.[i] ?? null,
        code: data.daily?.weather_code?.[i] ?? 0,
        label: WMO[data.daily?.weather_code?.[i] ?? 0] ?? "Unknown",
      })),
      source: "Open-Meteo (free, no key)",
    });
  } finally {
    clearTimeout(t);
  }
});
