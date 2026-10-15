"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconChat } from "@/components/ui/Icons";
import { PLATFORM_LABEL } from "@/lib/constants";
import { useSession } from "./SessionProvider";

const BANNERS = [
  "/images/banner-city.jpg",
  "/images/banner-vinewood.jpg",
  "/images/banner-night.jpg",
  "/images/banner-cars.jpg",
  "/images/banner-garage.jpg",
  "/images/banner-heist.jpg",
  "/images/banner-cash.jpg",
  "/images/banner-crew.jpg",
  "/images/banner-super.jpg",
  "/images/banner-race.jpg",
  "/images/banner-moc.jpg",
  "/images/banner-neon.jpg",
  "/images/hero.jpg",
  "/images/banner-x1.jpg",
  "/images/banner-x2.jpg",
  "/images/banner-x3.jpg",
  "/images/banner-x4.jpg",
  "/images/banner-x5.jpg",
  "/images/banner-x6.jpg",
  "/images/banner-x7.jpg",
  "/images/banner-x8.jpg",
  "/images/banner-x9.jpg",
  "/images/banner-x10.jpg",
  "/images/banner-x11.jpg",
  "/images/banner-x12.jpg",
  "/images/banner-x13.jpg",
  "/images/banner-x14.jpg",
  "/images/banner-x15.jpg",
  "/images/banner-x16.jpg",
  "/images/banner-x17.jpg",
  "/images/banner-x18.jpg",
  "/images/banner-x19.jpg",
  "/images/banner-x20.jpg",
  "/images/veh-super.jpg",
  "/images/veh-sports.jpg",
  "/images/veh-muscle.jpg",
  "/images/cat-gctf.jpg",
  "/images/glitch-heist.jpg",
];

export function HomeHero() {
  const { user } = useSession();
  const channel = user?.platform ?? "ps5";
  const [i, setI] = useState(0);

  useEffect(() => {
    // start at random so it feels endless, not always same first image
    // Random start must happen on the client only (SSR and hydration would differ).
    const start = window.setTimeout(() => setI(Math.floor(Math.random() * BANNERS.length)), 0);
    const t = window.setInterval(() => {
      setI((x) => {
        // jump by random step so sequence never feels fixed 1..N
        const step = 1 + Math.floor(Math.random() * 5);
        return (x + step) % BANNERS.length;
      });
    }, 3000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(t);
    };
  }, []);

  const src = BANNERS[i] || BANNERS[0];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10">
      <div className="relative h-56 w-full bg-[#0a0a12]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-300">Welcome back</p>
          <h1 className="mt-1 truncate text-3xl font-black tracking-tight text-white drop-shadow-lg">
            {user?.gamertag ?? "Player"}
          </h1>
          <p className="mt-1 text-[15px] text-white/75">
            {PLATFORM_LABEL[channel]} player · Lobby ready
          </p>
          <Link
            href={`/chat/${channel}`}
            className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 text-[15px] font-bold text-white shadow-lg active:scale-[0.98]"
          >
            <IconChat size={18} /> Open {PLATFORM_LABEL[channel]} chat
          </Link>
        </div>
      </div>
      <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-cyan-400 via-pink-500 to-orange-400" style={{ backgroundSize: "200% 100%", animation: "menu-gradient-shift 4s linear infinite" }} />
    </section>
  );
}
