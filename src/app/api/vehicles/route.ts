import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/errors";
import { CLASS_LABEL, searchVehicles, vehicleClasses, type Vehicle } from "@/modules/vehicles/data";
import { vehicleImage } from "@/modules/vehicles/images";

export const dynamic = "force-dynamic";

export type VehicleDTO = Vehicle & { imageUrl: string };

export const GET = handleApi(async (req) => {
  const sp = new URL(req.url).searchParams;
  const q = sp.get("q") ?? "";
  const cls = sp.get("class") ?? "all";
  const raw = searchVehicles(q, cls);
  const items: VehicleDTO[] = raw.map((v) => ({ ...v, imageUrl: vehicleImage(v) }));
  return NextResponse.json({
    items,
    total: items.length,
    classes: vehicleClasses().map((c) => ({ id: c, label: CLASS_LABEL[c], imageUrl: vehicleImage({ id: c, name: c, class: c }) })),
    note: "Base retail GTA$ prices (approx). Weekly discounts change live prices in-game.",
  });
});
