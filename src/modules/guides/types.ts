import type { GuideCategory, GuideStatus } from "@/lib/constants";

export interface GuideItem {
  id: number;
  slug: string;
  category: GuideCategory;
  title: string;
  summary: string;
  body: string;
  imageUrl: string | null;
  status: GuideStatus;
  difficulty: string | null;
  payout: string | null;
  platforms: string[];
  sourceName: string | null;
  sourceUrl: string | null;
  featured: boolean;
  readMinutes: number;
  updatedAt: string;
  stale: boolean;
}
