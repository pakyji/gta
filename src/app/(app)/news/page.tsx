import { NewsList } from "@/modules/news/NewsList";
import { isNewsKind } from "@/lib/constants";

export const metadata = { title: "News & Updates" };
export const dynamic = "force-dynamic";

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams;
  return (
    <div className="px-safe space-y-4 pb-10 pt-4">
      <div>
        <h1 className="text-xl font-bold">News & Updates</h1>
        <p className="mt-1 text-sm text-muted">Daily objectives, weekly bonuses and important GTA Online info.</p>
      </div>
      <NewsList initialKind={isNewsKind(kind) ? kind : "all"} />
    </div>
  );
}
