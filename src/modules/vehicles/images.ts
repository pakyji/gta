import type { Vehicle, VehicleClass } from "./data";

const CLASS_PRIMARY: Record<string, string> = {
  super: "/images/veh-super.jpg",
  sports: "/images/veh-sports.jpg",
  muscle: "/images/veh-muscle.jpg",
  muscle_classic: "/images/veh-muscle.jpg",
  suvs: "/images/veh-suv.jpg",
  offroad: "/images/veh-offroad.jpg",
  utility: "/images/veh-offroad.jpg",
  industrial: "/images/veh-offroad.jpg",
  motorcycles: "/images/veh-bike.jpg",
  cycles: "/images/veh-bike.jpg",
  sports_classic: "/images/veh-classic.jpg",
  coupes: "/images/veh-coupe.jpg",
  sedans: "/images/veh-sedan.jpg",
  compacts: "/images/veh-compact.jpg",
  vans: "/images/veh-van.jpg",
  service: "/images/veh-sedan.jpg",
  commercial: "/images/veh-van.jpg",
  emergency: "/images/veh-sedan.jpg",
  weaponized: "/images/veh-weaponized.jpg",
  military: "/images/veh-military.jpg",
  helicopters: "/images/veh-heli.jpg",
  planes: "/images/veh-plane.jpg",
  open_wheel: "/images/veh-air.jpg",
  boats: "/images/veh-boat.jpg",
};

const CLASS_ALT: Record<string, string> = {
  super: "/images/veh-super-2.jpg",
  sports: "/images/veh-sports-2.jpg",
  muscle: "/images/veh-muscle-2.jpg",
  muscle_classic: "/images/veh-muscle-2.jpg",
  suvs: "/images/veh-suv-2.jpg",
  offroad: "/images/veh-offroad-2.jpg",
  motorcycles: "/images/veh-bike-2.jpg",
  sports_classic: "/images/veh-classic-2.jpg",
  coupes: "/images/veh-classic-2.jpg",
  sedans: "/images/veh-sedan-2.jpg",
  compacts: "/images/veh-sedan-2.jpg",
  weaponized: "/images/veh-weaponized-2.jpg",
  military: "/images/veh-weaponized-2.jpg",
  helicopters: "/images/veh-air-2.jpg",
  planes: "/images/veh-air-2.jpg",
  boats: "/images/veh-boat-2.jpg",
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Class hero (filters). */
export function vehicleClassImage(cls: VehicleClass | string): string {
  return (CLASS_PRIMARY[cls] ?? "/images/veh-default.jpg") + "?v=5";
}

/** Per-vehicle art: primary/alt by id hash so list isn't identical tiles. */
export function vehicleImage(v: Pick<Vehicle, "id" | "class" | "name">): string {
  const primary = CLASS_PRIMARY[v.class] ?? "/images/veh-default.jpg";
  const alt = CLASS_ALT[v.class];
  if (!alt) return primary + "?v=5";
  const pick = hash(v.id + v.name) % 2 === 0 ? primary : alt;
  return pick + (pick.includes("?") ? "" : "?v=5");
}

export function vehicleThumbGradient(cls: string): string {
  switch (cls) {
    case "super":
      return "from-violet-700/80 to-fuchsia-900/40";
    case "sports":
      return "from-sky-700/80 to-cyan-900/40";
    case "muscle":
    case "muscle_classic":
      return "from-rose-700/80 to-orange-900/40";
    case "suvs":
      return "from-emerald-700/80 to-teal-900/40";
    case "motorcycles":
    case "cycles":
      return "from-pink-700/80 to-indigo-900/40";
    case "weaponized":
    case "military":
      return "from-red-800/80 to-stone-900/50";
    case "helicopters":
      return "from-blue-800/80 to-slate-900/50";
    case "planes":
    case "open_wheel":
      return "from-indigo-800/80 to-slate-900/50";
    case "boats":
      return "from-cyan-900/80 to-blue-950/50";
    case "sports_classic":
    case "coupes":
      return "from-amber-800/70 to-stone-900/50";
    case "compacts":
      return "from-lime-900/70 to-stone-900/40";
    default:
      return "from-zinc-700/80 to-zinc-900/50";
  }
}
