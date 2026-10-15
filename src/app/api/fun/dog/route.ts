import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

/** Dog CEO — free, no key. */
export const GET = handleApi(async () => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random", {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Dog API ${res.status}`);
    const data = (await res.json()) as { message?: string; status?: string };
    if (!data.message) throw new Error("No dog image returned.");
    // message URL path often contains breed
    const parts = data.message.split("/");
    const breedIdx = parts.indexOf("breeds");
    const breed = breedIdx >= 0 ? (parts[breedIdx + 1] ?? "dog").replace(/-/g, " ") : "dog";
    return NextResponse.json({
      url: data.message,
      breed,
      source: "Dog CEO (free, no key)",
    });
  } finally {
    clearTimeout(t);
  }
});
