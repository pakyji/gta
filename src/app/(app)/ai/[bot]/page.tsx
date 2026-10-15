import { notFound } from "next/navigation";
import { isBot } from "@/lib/constants";
import { BOT_PROFILES } from "@/modules/ai/bots";
import { AiChat } from "@/modules/ai/AiChat";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ bot: string }> }) {
  const { bot } = await params;
  return { title: isBot(bot) ? `${BOT_PROFILES[bot].name} AI` : "AI" };
}

export default async function AiBotPage({ params }: { params: Promise<{ bot: string }> }) {
  const { bot } = await params;
  if (!isBot(bot)) notFound();
  return <AiChat key={bot} bot={BOT_PROFILES[bot]} />;
}
