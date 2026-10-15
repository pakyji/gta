import type { Channel, Platform } from "@/lib/constants";

export interface ChatMessage {
  id: number;
  channel: Channel;
  userId: string | null;
  gamertag: string;
  platform: Platform;
  body: string;
  createdAt: string;
}
