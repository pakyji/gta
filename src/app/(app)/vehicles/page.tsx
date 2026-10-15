import { VehicleBrowser } from "@/modules/vehicles/VehicleBrowser";

export const metadata = { title: "Vehicles" };
export const dynamic = "force-dynamic";

export default function VehiclesPage() {
  return (
    <div className="px-safe space-y-4 pb-10 pt-4">
      <div>
        <div className="mix-line mb-3" />
        <p className="font-label text-orange-300">Catalog · with class art</p>
        <h1 className="title-xl neon-text mt-1">GTA Vehicles</h1>
        <p className="body-lg mt-2">294 vehicles with base GTA$ prices and class banners. Weekly sales change live prices.</p>
      </div>
      <VehicleBrowser />
    </div>
  );
}
