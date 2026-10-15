import { FunHub } from "@/modules/fun/FunHub";

export const metadata = { title: "Fun Zone · Italia" };
export const dynamic = "force-dynamic";

export default function FunPage() {
  return (
    <div className="px-safe space-y-4 pb-10 pt-4">
      <div>
        <h1 className="text-xl font-bold">Fun Zone · Italia</h1>
        <p className="mt-1 text-sm text-muted">Meteo Italia, cats and dogs — free live APIs. Default zone: Italy.</p>
      </div>
      <FunHub />
    </div>
  );
}
