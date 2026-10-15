import { notFound } from "next/navigation";
import { isChannel, PLATFORM_LABEL } from "@/lib/constants";
import { ChatRoom } from "@/modules/chat/ChatRoom";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  return { title: isChannel(channel) ? `${PLATFORM_LABEL[channel]} Chat` : "Chat" };
}

export default async function ChatPage({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  if (!isChannel(channel)) notFound();
  return <ChatRoom key={channel} channel={channel} />;
}
