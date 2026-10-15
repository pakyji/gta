import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/errors";
import { GENRE_LABEL, STATIONS, searchStations, stationsByGenre } from "@/modules/music/stations";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  const sp = new URL(req.url).searchParams;
  const q = sp.get("q") ?? "";
  const genre = sp.get("genre") ?? "all";
  let items = q ? searchStations(q) : stationsByGenre(genre);
  if (q && genre !== "all") items = items.filter((s) => s.genre === genre);
  return NextResponse.json({
    items,
    total: items.length,
    genres: Object.entries(GENRE_LABEL).map(([id, label]) => ({ id, label })),
    note: "GTA-style station branding with free open radio streams (SomaFM etc.). Not Rockstar copyrighted audio.",
  });
});
