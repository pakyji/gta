import type { NewsKind } from "@/lib/constants";

export interface NewsItem {
  id: number;
  slug: string;
  kind: NewsKind;
  title: string;
  summary: string;
  body: string;
  imageUrl: string | null;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  expiresAt: string | null;
  tags: string[];
  outdated: boolean;
}
