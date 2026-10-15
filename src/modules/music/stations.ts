/**
 * GTA-style radio catalog with VERIFIED working free public streams.
 * (Not Rockstar OST — legal open radio in matching genres.)
 */
export type MusicGenre =
  | "hiphop"
  | "rock"
  | "pop"
  | "electronic"
  | "classical"
  | "reggae"
  | "world"
  | "talk"
  | "metal"
  | "soul"
  | "punk"
  | "radio";

export interface RadioStation {
  id: string;
  name: string;
  tagline: string;
  genre: MusicGenre;
  genreLabel: string;
  streamUrl: string;
  color: string;
  accent: string;
  dj?: string;
  location?: string;
}

export const GENRE_LABEL: Record<MusicGenre, string> = {
  hiphop: "Hip-Hop",
  rock: "Rock",
  pop: "Pop",
  electronic: "Electronic",
  classical: "Classical",
  reggae: "Reggae / Dancehall",
  world: "World",
  talk: "Talk / News",
  metal: "Metal",
  soul: "Soul / R&B",
  punk: "Punk / Indie",
  radio: "Mixed",
};

/** All streamUrl values were probe-tested as HTTP 200 audio. */
export const STATIONS: RadioStation[] = [
  {
    id: "los-santos-rock",
    name: "Los Santos Rock Radio",
    tagline: "Classic rock for the highway.",
    genre: "rock",
    genreLabel: "Classic Rock",
    streamUrl: "https://cast1.torontocast.com:4610/stream",
    color: "#ef4444",
    accent: "from-red-600 to-orange-500",
    dj: "Keith Morris vibe",
    location: "Los Santos",
  },
  {
    id: "non-stop-pop",
    name: "Non-Stop-Pop FM",
    tagline: "Pop hits, zero brakes.",
    genre: "pop",
    genreLabel: "Pop",
    streamUrl: "https://liveradio.swr.de/sw282p3/swr3/play.mp3",
    color: "#ec4899",
    accent: "from-pink-500 to-rose-400",
    dj: "Cara thrills",
    location: "Del Perro",
  },
  {
    id: "radio-los-santos",
    name: "Radio Los Santos",
    tagline: "West Coast hip-hop heat.",
    genre: "hiphop",
    genreLabel: "Hip-Hop",
    streamUrl: "http://streams.90s90s.de/hiphop/mp3-192/streams.90s90s.de/",
    color: "#a855f7",
    accent: "from-violet-600 to-fuchsia-500",
    dj: "Big Boy energy",
    location: "South LS",
  },
  {
    id: "channel-x",
    name: "Channel X",
    tagline: "Punk. Loud. Unfiltered.",
    genre: "punk",
    genreLabel: "Punk",
    streamUrl: "https://icy.unitedradio.it/Virgin.mp3",
    color: "#f97316",
    accent: "from-orange-500 to-amber-400",
    dj: "Lonny",
    location: "Mirror Park",
  },
  {
    id: "west-coast-classics",
    name: "West Coast Classics",
    tagline: "Old-school G-funk forever.",
    genre: "hiphop",
    genreLabel: "Classic Hip-Hop",
    streamUrl: "http://streams.90s90s.de/hiphop/mp3-192/streams.90s90s.de/",
    color: "#eab308",
    accent: "from-yellow-500 to-amber-600",
    dj: "DJ Pooh vibe",
    location: "Davis",
  },
  {
    id: "rebel-radio",
    name: "Rebel Radio",
    tagline: "Country roads, Blaine County.",
    genre: "world",
    genreLabel: "Country / Americana",
    streamUrl: "https://cast1.torontocast.com:4610/stream",
    color: "#84cc16",
    accent: "from-lime-500 to-green-600",
    dj: "Jesco energy",
    location: "Blaine County",
  },
  {
    id: "soulwax-fm",
    name: "Soulwax FM",
    tagline: "Electronic remix chaos.",
    genre: "electronic",
    genreLabel: "Electronic",
    streamUrl: "https://dancewave.online/dance.mp3",
    color: "#06b6d4",
    accent: "from-cyan-500 to-blue-600",
    dj: "Soulwax vibe",
    location: "Downtown",
  },
  {
    id: "east-los-fm",
    name: "East Los FM",
    tagline: "Latin / global grooves.",
    genre: "world",
    genreLabel: "Latin / World",
    streamUrl: "https://breakz-high.rautemusik.fm/?ref=gtac",
    color: "#14b8a6",
    accent: "from-teal-500 to-emerald-500",
    dj: "Don Cheto energy",
    location: "East LS",
  },
  {
    id: "blaine-talk",
    name: "Blaine County Talk Radio",
    tagline: "News & talk chaos.",
    genre: "talk",
    genreLabel: "Talk",
    streamUrl: "https://stream.europe1.fr/europe1.aac",
    color: "#64748b",
    accent: "from-slate-500 to-gray-600",
    dj: "Ron Jakowski vibe",
    location: "Sandy Shores",
  },
  {
    id: "the-blue-ark",
    name: "The Blue Ark",
    tagline: "Reggae, dancehall, dub.",
    genre: "reggae",
    genreLabel: "Reggae",
    streamUrl: "https://breakz-2012-high.rautemusik.fm/?ref=gtac-reggae",
    color: "#22c55e",
    accent: "from-green-500 to-lime-500",
    dj: "Lee Scratch energy",
    location: "Vespucci",
  },
  {
    id: "worldwide-fm",
    name: "WorldWide FM",
    tagline: "Global grooves & deep cuts.",
    genre: "world",
    genreLabel: "Worldwide",
    streamUrl: "https://pub0201.101.ru/stream/trust/mp3/128/24?",
    color: "#3b82f6",
    accent: "from-blue-500 to-indigo-500",
    dj: "Gilles vibe",
    location: "LSIA lounge",
  },
  {
    id: "flylo-fm",
    name: "FlyLo FM",
    tagline: "Future beats & experimental.",
    genre: "electronic",
    genreLabel: "Future Beats",
    streamUrl: "https://edmdnb.com:448/radio/8000/radio.mp3",
    color: "#8b5cf6",
    accent: "from-violet-500 to-purple-600",
    dj: "Flying Lotus vibe",
    location: "Vinewood Hills",
  },
  {
    id: "the-lowdown",
    name: "The Lowdown 91.1",
    tagline: "Soul, funk, R&B nights.",
    genre: "soul",
    genreLabel: "Soul / Funk",
    streamUrl: "https://radiopanther.radiolebowski.com/play",
    color: "#f59e0b",
    accent: "from-amber-500 to-yellow-600",
    dj: "Pam Grier energy",
    location: "Downtown LS",
  },
  {
    id: "radio-mirror-park",
    name: "Radio Mirror Park",
    tagline: "Indie electronic chill.",
    genre: "electronic",
    genreLabel: "Indie Electronic",
    streamUrl: "https://pub0201.101.ru/stream/trust/mp3/128/24?",
    color: "#10b981",
    accent: "from-emerald-400 to-teal-600",
    dj: "Twin Shadow vibe",
    location: "Mirror Park",
  },
  {
    id: "space-1032",
    name: "Space 103.2",
    tagline: "Funk & boogie in orbit.",
    genre: "soul",
    genreLabel: "Funk",
    streamUrl: "http://jazzblues.ice.infomaniak.ch/jazzblues-high.mp3",
    color: "#6366f1",
    accent: "from-indigo-500 to-blue-500",
    dj: "Bootsy vibe",
    location: "Little Seoul",
  },
  {
    id: "vinewood-boulevard",
    name: "Vinewood Boulevard Radio",
    tagline: "Modern rock & metal edge.",
    genre: "metal",
    genreLabel: "Metal / Rock",
    streamUrl: "https://cast1.torontocast.com:4660/stream",
    color: "#dc2626",
    accent: "from-red-600 to-rose-700",
    dj: "Nate Denver vibe",
    location: "Vinewood",
  },
  {
    id: "the-lab",
    name: "The Lab",
    tagline: "Cults Exclusive — deep mix.",
    genre: "hiphop",
    genreLabel: "Mix / Hip-Hop",
    streamUrl: "https://breakz-high.rautemusik.fm/?ref=gtac-lab",
    color: "#db2777",
    accent: "from-pink-600 to-purple-600",
    dj: "The Alchemist vibe",
    location: "The Lab",
  },
  {
    id: "blonded",
    name: "Blonded Los Santos 97.8",
    tagline: "Soft left turns & night drives.",
    genre: "pop",
    genreLabel: "Alt R&B / Pop",
    streamUrl: "http://radio.stereoscenic.com/asp-h",
    color: "#f472b6",
    accent: "from-pink-400 to-orange-300",
    dj: "Frank vibe",
    location: "Rockford Hills",
  },
  {
    id: "ls-underground",
    name: "Los Santos Underground Radio",
    tagline: "Techno warehouse nights.",
    genre: "electronic",
    genreLabel: "Techno / House",
    streamUrl: "https://dancewave.online/dance.mp3",
    color: "#0ea5e9",
    accent: "from-sky-500 to-cyan-600",
    dj: "Solomun vibe",
    location: "Underground",
  },
  {
    id: "ifruit-radio",
    name: "iFruit Radio",
    tagline: "Modern hits & club edits.",
    genre: "pop",
    genreLabel: "Contemporary",
    streamUrl: "https://liveradio.swr.de/sw282p3/swr3/play.mp3",
    color: "#94a3b8",
    accent: "from-slate-400 to-zinc-500",
    dj: "Danny Brown energy",
    location: "Phone default",
  },
  {
    id: "self-radio",
    name: "Self Radio",
    tagline: "Ambient community mix.",
    genre: "radio",
    genreLabel: "Community Mix",
    streamUrl: "http://radio.stereoscenic.com/asp-h",
    color: "#22d3ee",
    accent: "from-cyan-400 to-blue-500",
    dj: "You",
    location: "Self Radio",
  },
  {
    id: "the-palace",
    name: "The Palace",
    tagline: "Classical for the penthouse.",
    genre: "classical",
    genreLabel: "Classical",
    streamUrl: "https://icecast.walmradio.com:8443/walm2",
    color: "#c4b5fd",
    accent: "from-violet-300 to-purple-500",
    dj: "Conductor",
    location: "Rockford Hills",
  },
  {
    id: "blaine-metal",
    name: "Blaine County Metal",
    tagline: "Heavy riffs, heavier traffic.",
    genre: "metal",
    genreLabel: "Metal",
    streamUrl: "https://cast1.torontocast.com:4660/stream",
    color: "#7f1d1d",
    accent: "from-red-800 to-black",
    dj: "Axel",
    location: "Grapeseed",
  },
  {
    id: "night-cruise",
    name: "Night Cruise FM",
    tagline: "Synthwave for midnight drives.",
    genre: "electronic",
    genreLabel: "Synthwave / EDM",
    streamUrl: "https://edmdnb.com:448/radio/8000/radio.mp3",
    color: "#c026d3",
    accent: "from-fuchsia-600 to-purple-800",
    dj: "Neon",
    location: "Del Perro Freeway",
  },
  {
    id: "vespucci-chill",
    name: "Vespucci Beach Chill",
    tagline: "Downtempo ocean air.",
    genre: "electronic",
    genreLabel: "Chill",
    streamUrl: "https://pub0201.101.ru/stream/trust/mp3/128/24?",
    color: "#2dd4bf",
    accent: "from-teal-400 to-cyan-600",
    dj: "Sunset",
    location: "Vespucci Beach",
  },
  {
    id: "sandy-saloon",
    name: "Sandy Shores Saloon",
    tagline: "Americana & roots rock.",
    genre: "world",
    genreLabel: "Americana",
    streamUrl: "https://cast1.torontocast.com:4610/stream",
    color: "#b45309",
    accent: "from-amber-700 to-yellow-800",
    dj: "Sheriff",
    location: "Sandy Shores",
  },
  {
    id: "left-coast",
    name: "Left Coast LS",
    tagline: "Underground house.",
    genre: "electronic",
    genreLabel: "House",
    streamUrl: "https://dancewave.online/dance.mp3",
    color: "#4f46e5",
    accent: "from-indigo-600 to-blue-700",
    dj: "Dockside",
    location: "Port of LS",
  },
  {
    id: "iaa-black-fm",
    name: "IAA Black FM",
    tagline: "Spy lounge & noir jazz.",
    genre: "soul",
    genreLabel: "Lounge / Jazz",
    streamUrl: "https://icecast.walmradio.com:8443/classic",
    color: "#1e293b",
    accent: "from-slate-700 to-zinc-900",
    dj: "Agent vibe",
    location: "IAA HQ",
  },
  {
    id: "digitalis-ls",
    name: "Digitalis LS",
    tagline: "Club charts non-stop.",
    genre: "electronic",
    genreLabel: "Club / Dance",
    streamUrl: "https://breakz-2012-high.rautemusik.fm/?ref=gtac-digitalis",
    color: "#7c3aed",
    accent: "from-violet-600 to-indigo-600",
    dj: "Pixel",
    location: "Textile City",
  },
  {
    id: "blues-boulevard",
    name: "Boulevard Blues",
    tagline: "Late-night jazz blues.",
    genre: "soul",
    genreLabel: "Blues / Jazz",
    streamUrl: "http://jazzblues.ice.infomaniak.ch/jazzblues-high.mp3",
    color: "#9333ea",
    accent: "from-purple-600 to-pink-600",
    dj: "Smoke",
    location: "Strawberry",
  },
  {
    id: "italy-virgin",
    name: "Mirror Park Italia",
    tagline: "Italian rock & pop energy.",
    genre: "rock",
    genreLabel: "Italian Rock/Pop",
    streamUrl: "https://icy.unitedradio.it/Virgin.mp3",
    color: "#16a34a",
    accent: "from-green-600 to-red-500",
    dj: "Italia",
    location: "Italia",
  },
];

export function getStation(id: string): RadioStation | undefined {
  return STATIONS.find((s) => s.id === id);
}

export function stationsByGenre(genre: string): RadioStation[] {
  if (!genre || genre === "all") return STATIONS;
  return STATIONS.filter((s) => s.genre === genre);
}

export function searchStations(q: string): RadioStation[] {
  const s = q.trim().toLowerCase();
  if (!s) return STATIONS;
  return STATIONS.filter(
    (x) =>
      x.name.toLowerCase().includes(s) ||
      x.tagline.toLowerCase().includes(s) ||
      x.genreLabel.toLowerCase().includes(s) ||
      x.dj?.toLowerCase().includes(s) ||
      x.location?.toLowerCase().includes(s),
  );
}
