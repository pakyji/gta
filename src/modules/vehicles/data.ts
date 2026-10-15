/**
 * GTA Online vehicle catalog (base retail GTA$ prices, approximate).
 * Prices change with weekly discounts — treat as reference, not live store.
 */
export type VehicleClass =
  | "super"
  | "sports"
  | "sports_classic"
  | "muscle"
  | "sedans"
  | "suvs"
  | "coupes"
  | "compacts"
  | "motorcycles"
  | "offroad"
  | "muscle_classic"
  | "open_wheel"
  | "vans"
  | "commercial"
  | "emergency"
  | "military"
  | "industrial"
  | "utility"
  | "cycles"
  | "boats"
  | "helicopters"
  | "planes"
  | "service"
  | "weaponized";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  class: VehicleClass;
  price: number; // base GTA$
  shop: string;
  note?: string;
}

export const CLASS_LABEL: Record<VehicleClass, string> = {
  super: "Super",
  sports: "Sports",
  sports_classic: "Sports Classics",
  muscle: "Muscle",
  muscle_classic: "Muscle",
  sedans: "Sedans",
  suvs: "SUVs",
  coupes: "Coupes",
  compacts: "Compacts",
  motorcycles: "Motorcycles",
  offroad: "Off-Road",
  open_wheel: "Open Wheel",
  vans: "Vans",
  commercial: "Commercial",
  emergency: "Emergency",
  military: "Military",
  industrial: "Industrial",
  utility: "Utility",
  cycles: "Cycles",
  boats: "Boats",
  helicopters: "Helicopters",
  planes: "Planes",
  service: "Service",
  weaponized: "Weaponized",
};

export const VEHICLES: Vehicle[] = [
  // Super
  { id: "adder", name: "Adder", brand: "Truffade", class: "super", price: 1000000, shop: "Legendary" },
  { id: "zentorno", name: "Zentorno", brand: "Pegassi", class: "super", price: 725000, shop: "Legendary" },
  { id: "t20", name: "T20", brand: "Progen", class: "super", price: 2200000, shop: "Legendary" },
  { id: "osiris", name: "Osiris", brand: "Pegassi", class: "super", price: 1950000, shop: "Legendary" },
  { id: "entityxf", name: "Entity XF", brand: "Overflod", class: "super", price: 795000, shop: "Legendary" },
  { id: "entity2", name: "Entity XXR", brand: "Overflod", class: "super", price: 2305000, shop: "Legendary" },
  { id: "fmj", name: "FMJ", brand: "Vapid", class: "super", price: 1750000, shop: "Legendary" },
  { id: "reaper", name: "Reaper", brand: "Pegassi", class: "super", price: 1595000, shop: "Legendary" },
  { id: "tyrus", name: "Tyrus", brand: "Progen", class: "super", price: 2550000, shop: "Legendary" },
  { id: "tempesta", name: "Tempesta", brand: "Pegassi", class: "super", price: 1329000, shop: "Legendary" },
  { id: "italigtb", name: "Itali GTB", brand: "Progen", class: "super", price: 1189000, shop: "Legendary" },
  { id: "nero", name: "Nero", brand: "Truffade", class: "super", price: 1440000, shop: "Legendary" },
  { id: "nero2", name: "Nero Custom", brand: "Truffade", class: "super", price: 605000, shop: "Legendary", note: "Upgrade from Nero" },
  { id: "xa21", name: "XA-21", brand: "Ocelot", class: "super", price: 2375000, shop: "Legendary" },
  { id: "vagner", name: "Vagner", brand: "Dewbauchee", class: "super", price: 1535000, shop: "Legendary" },
  { id: "cyclone", name: "Cyclone", brand: "Coil", class: "super", price: 1890000, shop: "Legendary" },
  { id: "visione", name: "Visione", brand: "Grotti", class: "super", price: 2250000, shop: "Legendary" },
  { id: "autarch", name: "Autarch", brand: "Overflod", class: "super", price: 1955000, shop: "Legendary" },
  { id: "sc1", name: "SC1", brand: "Ubermacht", class: "super", price: 1603000, shop: "Legendary" },
  { id: "entity3", name: "Entity MT", brand: "Overflod", class: "super", price: 2355000, shop: "Legendary" },
  { id: "emerus", name: "Emerus", brand: "Progen", class: "super", price: 2750000, shop: "Legendary" },
  { id: "krieger", name: "Krieger", brand: "Benefactor", class: "super", price: 2875000, shop: "Legendary" },
  { id: "thrax", name: "Thrax", brand: "Truffade", class: "super", price: 2325000, shop: "Legendary" },
  { id: "zorrusso", name: "Zorrusso", brand: "Pegassi", class: "super", price: 1925000, shop: "Legendary" },
  { id: "furia", name: "Furia", brand: "Grotti", class: "super", price: 2740000, shop: "Legendary" },
  { id: "tigon", name: "Tigon", brand: "Lampadati", class: "super", price: 2310000, shop: "Legendary" },
  { id: "champion", name: "Champion", brand: "Dewbauchee", class: "super", price: 3750000, shop: "Legendary" },
  { id: "ignus", name: "Ignus", brand: "Pegassi", class: "super", price: 2765000, shop: "Legendary" },
  { id: "zeno", name: "Zeno", brand: "Overflod", class: "super", price: 2820000, shop: "Legendary" },
  { id: "torero2", name: "Torero XO", brand: "Pegassi", class: "super", price: 2890000, shop: "Legendary" },
  { id: "lm87", name: "LM87", brand: "Benefactor", class: "super", price: 2915000, shop: "Legendary" },
  { id: "tenf", name: "10F", brand: "Obey", class: "sports", price: 1675000, shop: "Legendary" },
  { id: "tenf2", name: "10F Widebody", brand: "Obey", class: "sports", price: 1875000, shop: "Legendary" },
  { id: "sm722", name: "SM722", brand: "Benefactor", class: "sports", price: 2115000, shop: "Legendary" },
  { id: "toros", name: "Toros", brand: "Pegassi", class: "suvs", price: 498000, shop: "Legendary" },
  { id: "italirsx", name: "Itali RSX", brand: "Progen", class: "sports", price: 3465000, shop: "Legendary" },
  { id: "corsita", name: "Corsita", brand: "Lampadati", class: "sports", price: 1795000, shop: "Legendary" },
  { id: "omnisegt", name: "Omnis e-GT", brand: "Obey", class: "sports", price: 1795000, shop: "Legendary" },
  { id: "virtue", name: "Virtue", brand: "Ocelot", class: "super", price: 2980000, shop: "Legendary" },
  { id: "entitytt", name: "Turismo Omaggio", brand: "Grotti", class: "super", price: 2685000, shop: "Legendary" },

  // Sports
  { id: "elegy2", name: "Elegy RH8", brand: "Annis", class: "sports", price: 95000, shop: "Legendary", note: "Free with Immortal Soul crew (classic)" },
  { id: "elegy", name: "Elegy Retro Custom", brand: "Annis", class: "sports", price: 904000, shop: "Benny's" },
  { id: "sultanrs", name: "Sultan RS", brand: "Karin", class: "sports", price: 795000, shop: "Benny's" },
  { id: "banshee2", name: "Banshee 900R", brand: "Bravado", class: "sports", price: 565000, shop: "Benny's" },
  { id: "comet2", name: "Comet", brand: "Pfister", class: "sports", price: 100000, shop: "Legendary" },
  { id: "comet3", name: "Comet Retro Custom", brand: "Pfister", class: "sports", price: 710000, shop: "Benny's" },
  { id: "comet5", name: "Comet SR", brand: "Pfister", class: "sports", price: 1145000, shop: "Legendary" },
  { id: "comet6", name: "Comet S2", brand: "Pfister", class: "sports", price: 1873000, shop: "Legendary" },
  { id: "comet7", name: "Comet S2 Cabrio", brand: "Pfister", class: "sports", price: 1797000, shop: "Legendary" },
  { id: "pariah", name: "Pariah", brand: "Ocelot", class: "sports", price: 1420000, shop: "Legendary" },
  { id: "neon", name: "Neon", brand: "Pfister", class: "sports", price: 1500000, shop: "Legendary" },
  { id: "revolter", name: "Revolter", brand: "Ubermacht", class: "sports", price: 1610000, shop: "Legendary" },
  { id: "jugular", name: "Jugular", brand: "Ocelot", class: "sports", price: 1225000, shop: "Legendary" },
  { id: "sugoi", name: "Sugoi", brand: "Dinka", class: "sports", price: 1224000, shop: "Legendary" },
  { id: "vstr", name: "V-STR", brand: "Albany", class: "sports", price: 1285000, shop: "Legendary" },
  { id: "growler", name: "Growler", brand: "Pfister", class: "sports", price: 1627000, shop: "Legendary" },
  { id: "cypher", name: "Cypher", brand: "Ubermacht", class: "sports", price: 1550000, shop: "Legendary" },
  { id: "vectre", name: "Vectre", brand: "Emperor", class: "sports", price: 1785000, shop: "Legendary" },
  { id: "rt3000", name: "RT3000", brand: "Dinka", class: "sports", price: 1715000, shop: "Legendary" },
  { id: "zr350", name: "ZR350", brand: "Annis", class: "sports", price: 1615000, shop: "Legendary" },
  { id: "euros", name: "Euros", brand: "Annis", class: "sports", price: 1800000, shop: "Legendary" },
  { id: "sultan3", name: "Sultan RS Classic", brand: "Karin", class: "sports", price: 1789000, shop: "Legendary" },
  { id: "jester4", name: "Jester RR", brand: "Dinka", class: "sports", price: 1970000, shop: "Legendary" },
  { id: "remus", name: "Remus", brand: "Annis", class: "sports", price: 1370000, shop: "Legendary" },
  { id: "calico", name: "Calico GTF", brand: "Karin", class: "sports", price: 1995000, shop: "Legendary" },
  { id: "futo2", name: "Futo GTX", brand: "Karin", class: "sports", price: 1590000, shop: "Legendary" },
  { id: "previon", name: "Previon", brand: "Karin", class: "sports", price: 1490000, shop: "Legendary" },
  { id: "dominator7", name: "Dominator ASP", brand: "Vapid", class: "muscle", price: 1775000, shop: "Legendary" },
  { id: "dominator8", name: "Dominator GTT", brand: "Vapid", class: "muscle", price: 1220000, shop: "Legendary" },
  { id: "gauntlet4", name: "Gauntlet Hellfire", brand: "Bravado", class: "muscle", price: 745000, shop: "Legendary" },
  { id: "gauntlet5", name: "Gauntlet Classic Custom", brand: "Bravado", class: "muscle", price: 615000, shop: "Benny's" },
  { id: "yosemite2", name: "Yosemite Drift", brand: "Declasse", class: "muscle", price: 1308000, shop: "Legendary" },
  { id: "tampa2", name: "Drift Tampa", brand: "Declasse", class: "muscle", price: 995000, shop: "Legendary" },

  // Sports classics
  { id: "ztype", name: "Z-Type", brand: "Truffade", class: "sports_classic", price: 950000, shop: "Legendary" },
  { id: "monroe", name: "Monroe", brand: "Pegassi", class: "sports_classic", price: 490000, shop: "Legendary" },
  { id: "stingergt", name: "Stinger GT", brand: "Grotti", class: "sports_classic", price: 875000, shop: "Legendary" },
  { id: "stinger", name: "Stinger", brand: "Grotti", class: "sports_classic", price: 875000, shop: "Legendary" },
  { id: "jb700", name: "JB 700", brand: "Dewbauchee", class: "sports_classic", price: 350000, shop: "Legendary" },
  { id: "jb7002", name: "JB 700W", brand: "Dewbauchee", class: "sports_classic", price: 1470000, shop: "Legendary" },
  { id: "cheetah2", name: "Cheetah Classic", brand: "Grotti", class: "sports_classic", price: 865000, shop: "Legendary" },
  { id: "torero", name: "Torero", brand: "Pegassi", class: "sports_classic", price: 998000, shop: "Legendary" },
  { id: "savestra", name: "Savestra", brand: "Annis", class: "sports_classic", price: 990000, shop: "Legendary" },
  { id: "gt500", name: "GT500", brand: "Grotti", class: "sports_classic", price: 785000, shop: "Legendary" },
  { id: "neonclassic", name: "190z", brand: "Karin", class: "sports_classic", price: 900000, shop: "Legendary" },
  { id: "cheburek", name: "Cheburek", brand: "Rune", class: "sports_classic", price: 145000, shop: "Legendary" },
  { id: "mamba", name: "Mamba", brand: "Declasse", class: "sports_classic", price: 995000, shop: "Legendary" },
  { id: "feltzer3", name: "Stirling GT", brand: "Benefactor", class: "sports_classic", price: 975000, shop: "Legendary" },

  // Muscle
  { id: "dominator", name: "Dominator", brand: "Vapid", class: "muscle", price: 35000, shop: "Southern" },
  { id: "dominator3", name: "Dominator GTX", brand: "Vapid", class: "muscle", price: 725000, shop: "Legendary" },
  { id: "dukes", name: "Dukes", brand: "Imponte", class: "muscle", price: 62000, shop: "Southern" },
  { id: "blade", name: "Blade", brand: "Vapid", class: "muscle", price: 160000, shop: "Southern" },
  { id: "gauntlet", name: "Gauntlet", brand: "Bravado", class: "muscle", price: 32000, shop: "Southern" },
  { id: "phoenix", name: "Phoenix", brand: "Imponte", class: "muscle", price: 0, shop: "Steal / random", note: "Often found, not always purchasable" },
  { id: "sabregt", name: "Sabre Turbo", brand: "Declasse", class: "muscle", price: 15000, shop: "Southern" },
  { id: "sabregt2", name: "Sabre Turbo Custom", brand: "Declasse", class: "muscle", price: 490000, shop: "Benny's" },
  { id: "slamvan3", name: "Slamvan Custom", brand: "Vapid", class: "muscle", price: 425000, shop: "Benny's" },
  { id: "yosemite", name: "Yosemite", brand: "Declasse", class: "muscle", price: 485000, shop: "Southern" },
  { id: "hustler", name: "Hustler", brand: "Vapid", class: "muscle", price: 625000, shop: "Legendary" },
  { id: "deveste", name: "Deveste Eight", brand: "Principe", class: "super", price: 1795000, shop: "Legendary" },
  { id: "impaler", name: "Impaler", brand: "Declasse", class: "muscle", price: 331835, shop: "Arena" },
  { id: "ellie", name: "Ellie", brand: "Vapid", class: "muscle", price: 565000, shop: "Legendary" },
  { id: "clique", name: "Clique", brand: "Vapid", class: "muscle", price: 909000, shop: "Legendary" },
  { id: "deviant", name: "Deviant", brand: "Schyster", class: "muscle", price: 512000, shop: "Legendary" },
  { id: "tulip", name: "Tulip", brand: "Declasse", class: "muscle", price: 718000, shop: "Legendary" },
  { id: "vamos", name: "Vamos", brand: "Declasse", class: "muscle", price: 596000, shop: "Legendary" },
  { id: "hermes", name: "Hermes", brand: "Albany", class: "muscle", price: 535000, shop: "Legendary" },

  // SUVs
  { id: "baller2", name: "Baller", brand: "Gallivanter", class: "suvs", price: 90000, shop: "Legendary" },
  { id: "baller4", name: "Baller LE LWB", brand: "Gallivanter", class: "suvs", price: 247000, shop: "Legendary" },
  { id: "baller7", name: "Baller ST", brand: "Gallivanter", class: "suvs", price: 890000, shop: "Legendary" },
  { id: "cavalcade2", name: "Cavalcade", brand: "Albany", class: "suvs", price: 60000, shop: "Legendary" },
  { id: "dubsta2", name: "Dubsta", brand: "Benefactor", class: "suvs", price: 0, shop: "Steal / random" },
  { id: "dubsta3", name: "Dubsta 6x6", brand: "Benefactor", class: "offroad", price: 249000, shop: "Legendary" },
  { id: "huntley", name: "Huntley S", brand: "Enus", class: "suvs", price: 195000, shop: "Legendary" },
  { id: "landstalker2", name: "Landstalker XL", brand: "Dundreary", class: "suvs", price: 1220000, shop: "Legendary" },
  { id: "novak", name: "Novak", brand: "Lampadati", class: "suvs", price: 608000, shop: "Legendary" },
  { id: "rebla", name: "Rebla GTS", brand: "Ubermacht", class: "suvs", price: 1175000, shop: "Legendary" },
  { id: "squaddie", name: "Squaddie", brand: "Mammoth", class: "suvs", price: 1130000, shop: "Warstock" },
  { id: "astron", name: "Astron", brand: "Pfister", class: "suvs", price: 1580000, shop: "Legendary" },
  { id: "iwagen", name: "I-Wagen", brand: "Obey", class: "suvs", price: 1728000, shop: "Legendary" },
  { id: "jubilee", name: "Jubilee", brand: "Enus", class: "suvs", price: 1650000, shop: "Legendary" },
  { id: "patriot3", name: "Patriot Military", brand: "Mammoth", class: "offroad", price: 1710000, shop: "Warstock" },

  // Off-road
  { id: "sandking", name: "Sandking XL", brand: "Vapid", class: "offroad", price: 45000, shop: "Legendary" },
  { id: "sandking2", name: "Sandking SWB", brand: "Vapid", class: "offroad", price: 38000, shop: "Legendary" },
  { id: "bifta", name: "Bifta", brand: "BF", class: "offroad", price: 75000, shop: "Legendary" },
  { id: "brawler", name: "Brawler", brand: "Coil", class: "offroad", price: 715000, shop: "Legendary" },
  { id: "trophytruck", name: "Trophy Truck", brand: "Vapid", class: "offroad", price: 550000, shop: "Legendary" },
  { id: "trophytruck2", name: "Desert Raid", brand: "Vapid", class: "offroad", price: 695000, shop: "Legendary" },
  { id: "kamacho", name: "Kamacho", brand: "Canis", class: "offroad", price: 345000, shop: "Legendary" },
  { id: "riata", name: "Riata", brand: "Vapid", class: "offroad", price: 380000, shop: "Legendary" },
  { id: "caracara2", name: "Caracara 4x4", brand: "Vapid", class: "offroad", price: 875000, shop: "Legendary" },
  { id: "everon", name: "Everon", brand: "Karin", class: "offroad", price: 1475000, shop: "Legendary" },
  { id: "hellion", name: "Hellion", brand: "Annis", class: "offroad", price: 835000, shop: "Legendary" },
  { id: "outlaw", name: "Outlaw", brand: "Nagasaki", class: "offroad", price: 1268000, shop: "Legendary" },
  { id: "vagrant", name: "Vagrant", brand: "Maxwell", class: "offroad", price: 2214000, shop: "Legendary" },
  { id: "winky", name: "Winky", brand: "Vapid", class: "offroad", price: 1100000, shop: "Legendary" },
  { id: "draugur", name: "Draugur", brand: "Declasse", class: "offroad", price: 1870000, shop: "Legendary" },

  // Motorcycles
  { id: "hakuchou", name: "Hakuchou", brand: "Shitzu", class: "motorcycles", price: 82000, shop: "Legendary" },
  { id: "hakuchou2", name: "Hakuchou Drag", brand: "Shitzu", class: "motorcycles", price: 976000, shop: "Legendary" },
  { id: "bati", name: "Bati 801", brand: "Pegassi", class: "motorcycles", price: 15000, shop: "Legendary" },
  { id: "bati2", name: "Bati 801RR", brand: "Pegassi", class: "motorcycles", price: 15000, shop: "Legendary" },
  { id: "akuma", name: "Akuma", brand: "Dinka", class: "motorcycles", price: 9000, shop: "Legendary" },
  { id: "double", name: "Double T", brand: "Dinka", class: "motorcycles", price: 12000, shop: "Legendary" },
  { id: "pcj", name: "PCJ 600", brand: "Shitzu", class: "motorcycles", price: 9000, shop: "Legendary" },
  { id: "ruffian", name: "Ruffian", brand: "Pegassi", class: "motorcycles", price: 10000, shop: "Legendary" },
  { id: "sanchez", name: "Sanchez", brand: "Maibatsu", class: "motorcycles", price: 8000, shop: "Legendary" },
  { id: "sanchez2", name: "Sanchez (livery)", brand: "Maibatsu", class: "motorcycles", price: 8000, shop: "Legendary" },
  { id: "thrust", name: "Thrust", brand: "Dinka", class: "motorcycles", price: 75000, shop: "Legendary" },
  { id: "vader", name: "Vader", brand: "Shitzu", class: "motorcycles", price: 9000, shop: "Legendary" },
  { id: "carbonrs", name: "Carbon RS", brand: "Nagasaki", class: "motorcycles", price: 40000, shop: "Legendary" },
  { id: "shotaro", name: "Shotaro", brand: "Nagasaki", class: "motorcycles", price: 2225000, shop: "Legendary" },
  { id: "defiler", name: "Defiler", brand: "Shitzu", class: "motorcycles", price: 412000, shop: "Legendary" },
  { id: "nightblade", name: "Nightblade", brand: "Western", class: "motorcycles", price: 100000, shop: "Legendary" },
  { id: "wolfsbane", name: "Wolfsbane", brand: "Western", class: "motorcycles", price: 90000, shop: "Legendary" },
  { id: "zombiea", name: "Zombie Bobber", brand: "Western", class: "motorcycles", price: 99000, shop: "Legendary" },
  { id: "zombieb", name: "Zombie Chopper", brand: "Western", class: "motorcycles", price: 122000, shop: "Legendary" },
  { id: "daemon", name: "Daemon", brand: "Western", class: "motorcycles", price: 20000, shop: "Southern" },
  { id: "gargoyle", name: "Gargoyle", brand: "Western", class: "motorcycles", price: 120000, shop: "Legendary" },
  { id: "cliffhanger", name: "Cliffhanger", brand: "Western", class: "motorcycles", price: 225000, shop: "Legendary" },
  { id: "bf400", name: "BF400", brand: "Nagasaki", class: "motorcycles", price: 95000, shop: "Legendary" },
  { id: "manchez", name: "Manchez", brand: "Maibatsu", class: "motorcycles", price: 67000, shop: "Legendary" },
  { id: "manchez2", name: "Manchez Scout", brand: "Maibatsu", class: "motorcycles", price: 1250000, shop: "Warstock" },
  { id: "oppressor", name: "Oppressor", brand: "Pegassi", class: "motorcycles", price: 3524500, shop: "Warstock", note: "Mk I" },
  { id: "oppressor2", name: "Oppressor Mk II", brand: "Pegassi", class: "weaponized", price: 8000000, shop: "Warstock", note: "Trade price lower after research" },
  { id: "deathbike", name: "Deathbike", brand: "Western", class: "motorcycles", price: 1260000, shop: "Arena" },
  { id: "shinobi", name: "Shinobi", brand: "Nagasaki", class: "motorcycles", price: 2480500, shop: "Legendary" },
  { id: "reever", name: "Reever", brand: "Western", class: "motorcycles", price: 1900000, shop: "Legendary" },

  // Weaponized / special
  { id: "insurgent", name: "Insurgent", brand: "HVY", class: "weaponized", price: 675000, shop: "Warstock" },
  { id: "insurgent2", name: "Insurgent Pick-Up", brand: "HVY", class: "weaponized", price: 1790000, shop: "Warstock" },
  { id: "insurgent3", name: "Insurgent Pick-Up Custom", brand: "HVY", class: "weaponized", price: 2025000, shop: "Warstock" },
  { id: "kuruma2", name: "Kuruma (Armored)", brand: "Karin", class: "sports", price: 698250, shop: "Legendary" },
  { id: "kuruma", name: "Kuruma", brand: "Karin", class: "sports", price: 126000, shop: "Legendary" },
  { id: "nightshark", name: "Nightshark", brand: "HVY", class: "weaponized", price: 1245000, shop: "Warstock" },
  { id: "dune3", name: "Dune FAV", brand: "BF", class: "weaponized", price: 1131200, shop: "Warstock" },
  { id: "technical3", name: "Technical Custom", brand: "Karin", class: "weaponized", price: 1425000, shop: "Warstock" },
  { id: "apc", name: "APC", brand: "HVY", class: "weaponized", price: 3092000, shop: "Warstock" },
  { id: "halftrack", name: "Half-track", brand: "Bravado", class: "weaponized", price: 2253350, shop: "Warstock" },
  { id: "khanjali", name: "TM-02 Khanjali", brand: "HVY", class: "weaponized", price: 3850350, shop: "Warstock" },
  { id: "deluxo", name: "Deluxo", brand: "Imponte", class: "sports_classic", price: 5750000, shop: "Warstock" },
  { id: "stromberg", name: "Stromberg", brand: "Ocelot", class: "sports_classic", price: 3185350, shop: "Warstock" },
  { id: "vigilante", name: "Vigilante", brand: "Grotti", class: "super", price: 3750000, shop: "Warstock" },
  { id: "scramjet", name: "Scramjet", brand: "Declasse", class: "super", price: 4628250, shop: "Warstock" },
  { id: "toreador", name: "Toreador", brand: "Pegassi", class: "sports_classic", price: 4250000, shop: "Warstock" },
  { id: "champion2", name: "Buffalo STX", brand: "Bravado", class: "muscle", price: 1590000, shop: "Legendary" },
  { id: "ignus2", name: "Ruiner ZZ-8", brand: "Imponte", class: "muscle", price: 1695000, shop: "Legendary" },

  // Helicopters / planes (key ones)
  { id: "buzzard2", name: "Buzzard Attack Chopper", brand: "Nagasaki", class: "helicopters", price: 1750000, shop: "Warstock" },
  { id: "buzzard", name: "Buzzard", brand: "Nagasaki", class: "helicopters", price: 0, shop: "Pegasus / steal" },
  { id: "savage", name: "Savage", brand: "Unknown", class: "helicopters", price: 2593500, shop: "Warstock" },
  { id: "hunter", name: "FH-1 Hunter", brand: "Unknown", class: "helicopters", price: 3750000, shop: "Warstock" },
  { id: "akula", name: "Akula", brand: "Unknown", class: "helicopters", price: 4500000, shop: "Warstock" },
  { id: "havok", name: "Havok", brand: "Nagasaki", class: "helicopters", price: 2300000, shop: "Warstock" },
  { id: "sparrow", name: "Sparrow", brand: "Unknown", class: "helicopters", price: 1815000, shop: "Warstock" },
  { id: "seasparrow", name: "Sea Sparrow", brand: "Unknown", class: "helicopters", price: 1815000, shop: "Warstock" },
  { id: "volatus", name: "Volatus", brand: "Buckingham", class: "helicopters", price: 2295000, shop: "Elitas" },
  { id: "supervolito", name: "SuperVolito", brand: "Buckingham", class: "helicopters", price: 2113000, shop: "Elitas" },
  { id: "frogger", name: "Frogger", brand: "Maibatsu", class: "helicopters", price: 1300000, shop: "Elitas" },
  { id: "maverick", name: "Maverick", brand: "Buckingham", class: "helicopters", price: 780000, shop: "Elitas" },
  { id: "hydra", name: "Hydra", brand: "Mammoth", class: "planes", price: 3990000, shop: "Warstock" },
  { id: "lazer", name: "P-996 LAZER", brand: "Jobuilt", class: "planes", price: 6500000, shop: "Warstock", note: "Often unavailable; hangar research era pricing varies" },
  { id: "pyro", name: "Pyro", brand: "Buckingham", class: "planes", price: 4456500, shop: "Warstock" },
  { id: "raiju", name: "F-160 Raiju", brand: "Mammoth", class: "planes", price: 6855000, shop: "Warstock" },
  { id: "strikeforce", name: "B-11 Strikeforce", brand: "Unknown", class: "planes", price: 3800000, shop: "Warstock" },
  { id: "rogue", name: "Rogue", brand: "Western", class: "planes", price: 1596000, shop: "Warstock" },
  { id: "molotok", name: "V-65 Molotok", brand: "Unknown", class: "planes", price: 4788000, shop: "Warstock" },
  { id: "nokota", name: "P-45 Nokota", brand: "Unknown", class: "planes", price: 2653350, shop: "Warstock" },
  { id: "seabreeze", name: "Seabreeze", brand: "Western", class: "planes", price: 1130000, shop: "Warstock" },
  { id: "alphaz1", name: "Alpha-Z1", brand: "Buckingham", class: "planes", price: 2121350, shop: "Warstock" },
  { id: "howard", name: "Howard NX-25", brand: "Unknown", class: "planes", price: 1296500, shop: "Warstock" },
  { id: "luxor", name: "Luxor", brand: "Buckingham", class: "planes", price: 1500000, shop: "Elitas" },
  { id: "luxor2", name: "Luxor Deluxe", brand: "Buckingham", class: "planes", price: 10000000, shop: "Elitas" },
  { id: "shamal", name: "Shamal", brand: "Buckingham", class: "planes", price: 1150000, shop: "Elitas" },
  { id: "vestra", name: "Vestra", brand: "Buckingham", class: "planes", price: 950000, shop: "Elitas" },
  { id: "nimbus", name: "Nimbus", brand: "Buckingham", class: "planes", price: 4500000, shop: "Elitas" },

  // Boats
  { id: "toro", name: "Toro", brand: "Lampadati", class: "boats", price: 1750000, shop: "DockTease" },
  { id: "toro2", name: "Toro (yacht)", brand: "Lampadati", class: "boats", price: 1750000, shop: "DockTease" },
  { id: "speeder", name: "Speeder", brand: "Pegassi", class: "boats", price: 325000, shop: "DockTease" },
  { id: "jetmax", name: "Jetmax", brand: "Shitzu", class: "boats", price: 299000, shop: "DockTease" },
  { id: "squalo", name: "Squalo", brand: "Shitzu", class: "boats", price: 196000, shop: "DockTease" },
  { id: "suntrap", name: "Suntrap", brand: "Shitzu", class: "boats", price: 25100, shop: "DockTease" },
  { id: "tropic", name: "Tropic", brand: "Shitzu", class: "boats", price: 22000, shop: "DockTease" },
  { id: "dinghy", name: "Dinghy", brand: "Nagasaki", class: "boats", price: 12500, shop: "DockTease" },
  { id: "seashark", name: "Seashark", brand: "Speedophile", class: "boats", price: 16899, shop: "DockTease" },
  { id: "longfin", name: "Longfin", brand: "Shitzu", class: "boats", price: 2125000, shop: "DockTease" },
  { id: "patrolboat", name: "Kurtz 31 Patrol Boat", brand: "Unknown", class: "boats", price: 3220000, shop: "Warstock" },
  { id: "kosatka", name: "Kosatka", brand: "Rune", class: "boats", price: 2200000, shop: "Warstock", note: "Submarine — Cayo heist" },

  // Sedans / coupes / compacts (popular)
  { id: "schafter2", name: "Schafter", brand: "Benefactor", class: "sedans", price: 65000, shop: "Legendary" },
  { id: "schafter3", name: "Schafter V12", brand: "Benefactor", class: "sports", price: 140000, shop: "Legendary" },
  { id: "schafter4", name: "Schafter LWB", brand: "Benefactor", class: "sports", price: 208000, shop: "Legendary" },
  { id: "tailgater", name: "Tailgater", brand: "Obey", class: "sedans", price: 55000, shop: "Legendary" },
  { id: "tailgater2", name: "Tailgater S", brand: "Obey", class: "sports", price: 1495000, shop: "Legendary" },
  { id: "superd", name: "Super Diamond", brand: "Enus", class: "sedans", price: 250000, shop: "Legendary" },
  { id: "cognoscenti", name: "Cognoscenti", brand: "Enus", class: "sedans", price: 254000, shop: "Legendary" },
  { id: "cognoscenti2", name: "Cognoscenti (Armored)", brand: "Enus", class: "sedans", price: 558000, shop: "Legendary" },
  { id: "stafford", name: "Stafford", brand: "Enus", class: "sedans", price: 1272000, shop: "Legendary" },
  { id: "glendale", name: "Glendale", brand: "Benefactor", class: "sedans", price: 200000, shop: "Southern" },
  { id: "glendale2", name: "Glendale Custom", brand: "Benefactor", class: "sedans", price: 520000, shop: "Benny's" },
  { id: "warrener", name: "Warrener", brand: "Vulcar", class: "sedans", price: 120000, shop: "Southern" },
  { id: "warrener2", name: "Warrener HKR", brand: "Vulcar", class: "sedans", price: 1260000, shop: "Legendary" },
  { id: "oracle2", name: "Oracle XS", brand: "Ubermacht", class: "coupes", price: 82000, shop: "Legendary" },
  { id: "zion", name: "Zion", brand: "Ubermacht", class: "coupes", price: 60000, shop: "Legendary" },
  { id: "zion2", name: "Zion Cabrio", brand: "Ubermacht", class: "coupes", price: 65000, shop: "Legendary" },
  { id: "zion3", name: "Zion Classic", brand: "Ubermacht", class: "sports_classic", price: 812000, shop: "Legendary" },
  { id: "f620", name: "F620", brand: "Ocelot", class: "coupes", price: 80000, shop: "Legendary" },
  { id: "exemplar", name: "Exemplar", brand: "Dewbauchee", class: "coupes", price: 205000, shop: "Legendary" },
  { id: "jackal", name: "Jackal", brand: "Ocelot", class: "coupes", price: 60000, shop: "Legendary" },
  { id: "sentinel", name: "Sentinel", brand: "Ubermacht", class: "coupes", price: 95000, shop: "Legendary" },
  { id: "sentinel2", name: "Sentinel XS", brand: "Ubermacht", class: "coupes", price: 95000, shop: "Legendary" },
  { id: "sentinel3", name: "Sentinel Classic", brand: "Ubermacht", class: "sports", price: 650000, shop: "Legendary" },
  { id: "sentinel4", name: "Sentinel Classic Widebody", brand: "Ubermacht", class: "sports", price: 650000, shop: "Legendary" },
  { id: "blista", name: "Blista", brand: "Dinka", class: "compacts", price: 16000, shop: "Southern" },
  { id: "blista2", name: "Blista Compact", brand: "Dinka", class: "sports", price: 42000, shop: "Southern" },
  { id: "blista3", name: "Go Go Monkey Blista", brand: "Dinka", class: "sports", price: 0, shop: "Event / random" },
  { id: "issi2", name: "Issi", brand: "Weeny", class: "compacts", price: 18000, shop: "Southern" },
  { id: "issi3", name: "Issi Classic", brand: "Weeny", class: "compacts", price: 360000, shop: "Legendary" },
  { id: "issi7", name: "Issi Sport", brand: "Weeny", class: "sports", price: 897000, shop: "Legendary" },
  { id: "issi8", name: "Issi Rally", brand: "Weeny", class: "suvs", price: 1836000, shop: "Legendary" },
  { id: "panto", name: "Panto", brand: "Benefactor", class: "compacts", price: 85000, shop: "Legendary" },
  { id: "prairie", name: "Prairie", brand: "Bollokan", class: "compacts", price: 24000, shop: "Southern" },
  { id: "rhapsody", name: "Rhapsody", brand: "Declasse", class: "compacts", price: 140000, shop: "Southern" },
  { id: "asbo", name: "Asbo", brand: "Maxwell", class: "compacts", price: 408000, shop: "Legendary" },
  { id: "kanjo", name: "Blista Kanjo", brand: "Dinka", class: "compacts", price: 580000, shop: "Legendary" },
  { id: "club", name: "Club", brand: "BF", class: "compacts", price: 1280000, shop: "Legendary" },
  { id: "brioso", name: "Brioso R/A", brand: "Grotti", class: "compacts", price: 155000, shop: "Legendary" },
  { id: "brioso2", name: "Brioso 300", brand: "Grotti", class: "compacts", price: 610000, shop: "Legendary" },
  { id: "brioso3", name: "Brioso 300 Widebody", brand: "Grotti", class: "compacts", price: 610000, shop: "Legendary" },

  // Tuners / misc popular
  { id: "sultan", name: "Sultan", brand: "Karin", class: "sports", price: 12000, shop: "Southern" },
  { id: "sultan2", name: "Sultan Classic", brand: "Karin", class: "sports", price: 1718000, shop: "Legendary" },
  { id: "futo", name: "Futo", brand: "Karin", class: "sports", price: 9000, shop: "Southern" },
  { id: "penumbra", name: "Penumbra", brand: "Maibatsu", class: "sports", price: 24000, shop: "Southern" },
  { id: "penumbra2", name: "Penumbra FF", brand: "Maibatsu", class: "sports", price: 1380000, shop: "Legendary" },
  { id: "flashgt", name: "Flash GT", brand: "Vapid", class: "sports", price: 1675000, shop: "Legendary" },
  { id: "gb200", name: "GB200", brand: "Vapid", class: "sports", price: 940000, shop: "Legendary" },
  { id: "hotring", name: "Hotring Sabre", brand: "Declasse", class: "sports", price: 830000, shop: "Legendary" },
  { id: "jester", name: "Jester", brand: "Dinka", class: "sports", price: 240000, shop: "Legendary" },
  { id: "jester2", name: "Jester (Racecar)", brand: "Dinka", class: "sports", price: 350000, shop: "Legendary" },
  { id: "jester3", name: "Jester Classic", brand: "Dinka", class: "sports", price: 790000, shop: "Legendary" },
  { id: "massacro", name: "Massacro", brand: "Dewbauchee", class: "sports", price: 275000, shop: "Legendary" },
  { id: "massacro2", name: "Massacro (Racecar)", brand: "Dewbauchee", class: "sports", price: 385000, shop: "Legendary" },
  { id: "alpha", name: "Alpha", brand: "Albany", class: "sports", price: 150000, shop: "Legendary" },
  { id: "banshee", name: "Banshee", brand: "Bravado", class: "sports", price: 105000, shop: "Legendary" },
  { id: "carbonizzare", name: "Carbonizzare", brand: "Grotti", class: "sports", price: 195000, shop: "Legendary" },
  { id: "feltzer2", name: "Feltzer", brand: "Benefactor", class: "sports", price: 130000, shop: "Legendary" },
  { id: "furoregt", name: "Furore GT", brand: "Lampadati", class: "sports", price: 448000, shop: "Legendary" },
  { id: "fusilade", name: "Fusilade", brand: "Schyster", class: "sports", price: 36000, shop: "Southern" },
  { id: "khamelion", name: "Khamelion", brand: "Hijak", class: "sports", price: 100000, shop: "Legendary" },
  { id: "lynx", name: "Lynx", brand: "Ocelot", class: "sports", price: 1735000, shop: "Legendary" },
  { id: "ninef", name: "9F", brand: "Obey", class: "sports", price: 120000, shop: "Legendary" },
  { id: "ninef2", name: "9F Cabrio", brand: "Obey", class: "sports", price: 130000, shop: "Legendary" },
  { id: "rapidgt", name: "Rapid GT", brand: "Dewbauchee", class: "sports", price: 132000, shop: "Legendary" },
  { id: "rapidgt2", name: "Rapid GT Cabrio", brand: "Dewbauchee", class: "sports", price: 140000, shop: "Legendary" },
  { id: "schafter", name: "Schafter", brand: "Benefactor", class: "sedans", price: 65000, shop: "Legendary" },
  { id: "schwarzer", name: "Schwartzer", brand: "Benefactor", class: "sports", price: 80000, shop: "Southern" },
  { id: "surano", name: "Surano", brand: "Benefactor", class: "sports", price: 110000, shop: "Legendary" },
  { id: "tropos", name: "Tropos Rallye", brand: "Lampadati", class: "sports", price: 816000, shop: "Legendary" },
  { id: "verlierer2", name: "Verlierer", brand: "Bravado", class: "sports", price: 695000, shop: "Legendary" },
];

export function formatPrice(n: number): string {
  if (!n || n <= 0) return "N/A";
  // Always en-US grouping, no wrapping-friendly soft hyphens
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function searchVehicles(q: string, classFilter?: string): Vehicle[] {
  const query = q.trim().toLowerCase();
  return VEHICLES.filter((v) => {
    if (classFilter && classFilter !== "all" && v.class !== classFilter) return false;
    if (!query) return true;
    return (
      v.name.toLowerCase().includes(query) ||
      v.brand.toLowerCase().includes(query) ||
      v.shop.toLowerCase().includes(query) ||
      CLASS_LABEL[v.class].toLowerCase().includes(query)
    );
  }).sort((a, b) => a.name.localeCompare(b.name));
}

export function vehicleClasses(): VehicleClass[] {
  const set = new Set(VEHICLES.map((v) => v.class));
  return [...set].sort((a, b) => CLASS_LABEL[a].localeCompare(CLASS_LABEL[b]));
}
