import type { GuideCategory, GuideStatus } from "@/lib/constants";

export interface GuideSeed {
  slug: string;
  category: GuideCategory;
  title: string;
  summary: string;
  body: string;
  status: GuideStatus;
  difficulty?: "easy" | "medium" | "hard";
  payout?: string;
  platforms: string[];
  sourceName?: string;
  sourceUrl?: string;
  featured?: boolean;
  readMinutes: number;
  imageUrl?: string;
}
