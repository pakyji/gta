import Link from "next/link";
import { GuideList } from "@/modules/guides/GuideList";
import { GUIDE_CATEGORIES, GUIDE_CATEGORY_LABEL, isGuideCategory } from "@/lib/constants";

export const metadata = { title: "Guides" };
export const dynamic = "force-dynamic";

export default async function GuidesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initial = isGuideCategory(category) ? category : "all";
  return (
    <div className="px-safe space-y-4 pb-10 pt-4">
      <div>
        <div className="mix-line mb-3" /><h1 className="title-xl neon-text">Guides</h1>
        <p className="mt-1 body-lg" id="guides-intro">Money methods, outfits, glitches and GCTF — each with a clear status badge.</p>
      </div>
      {initial === "all" && (
        <div className="grid grid-cols-2 gap-3">
          {GUIDE_CATEGORIES.map((c) => (
            <Link key={c} href={`/guides?category=${c}`} className="tap relative block aspect-[2/1] overflow-hidden rounded-card border border-border active:opacity-90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c==="money"?"/images/money-banner.jpg":c==="outfits"?"/images/outfit-banner.jpg":c==="glitches"?"/images/glitch-banner.jpg":"/images/gctf-banner.jpg"} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <span className="absolute bottom-2 left-3 right-3 truncate text-base font-black tracking-tight">{GUIDE_CATEGORY_LABEL[c]}</span>
            </Link>
          ))}
        </div>
      )}
      <GuideList key={initial} initialCategory={initial} />
    </div>
  );
}
