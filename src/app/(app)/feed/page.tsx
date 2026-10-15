import { FeedPage } from "@/modules/feed/FeedPage";

export const metadata = { title: "Feed" };
export const dynamic = "force-dynamic";

export default function FeedRoute() {
  return <FeedPage />;
}
