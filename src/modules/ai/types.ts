export interface AiHistoryItem {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
