import { MusicPage } from "@/modules/music/MusicPage";

export const metadata = { title: "Music" };
export const dynamic = "force-dynamic";

export default function MusicRoutePage() {
  return <MusicPage />;
}
