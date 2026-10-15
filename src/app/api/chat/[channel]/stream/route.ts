/**
 * Server-Sent Events stream for a chat channel.
 * The server polls PostgreSQL for new rows (works across multiple devices and
 * server instances) and pushes them to connected clients. The browser's
 * EventSource reconnects automatically; the client passes `after` so no
 * messages are lost between reconnects.
 */
import { isChannel } from "@/lib/constants";
import { listAfter, listRecent } from "@/modules/chat/server";

export const dynamic = "force-dynamic";

const POLL_MS = 1500;
const MAX_LIFETIME_MS = 55_000; // keep connections short-lived; EventSource reconnects

export async function GET(req: Request, { params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  if (!isChannel(channel)) return new Response("Unknown channel", { status: 400 });

  const url = new URL(req.url);
  const afterRaw = url.searchParams.get("after");
  const afterParam = afterRaw === null || afterRaw === "" ? NaN : Number(afterRaw);
  let cursor = Number.isFinite(afterParam) && afterParam >= 0 ? afterParam : -1;

  const encoder = new TextEncoder();
  let closed = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      const finish = () => {
        if (closed) return;
        closed = true;
        if (timer) clearTimeout(timer);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      req.signal.addEventListener("abort", finish);

      try {
        if (cursor < 0) {
          const recent = await listRecent(channel);
          cursor = recent.length ? recent[recent.length - 1].id : 0;
          send("init", { messages: recent, cursor });
        } else {
          send("ready", { cursor });
        }
      } catch (err) {
        send("error", { error: "Database unavailable." });
        console.error("[chat/stream] init failed", err);
        finish();
        return;
      }

      const started = Date.now();
      const tick = async () => {
        if (closed) return;
        try {
          const fresh = await listAfter(channel, cursor);
          if (fresh.length) {
            cursor = fresh[fresh.length - 1].id;
            send("messages", { messages: fresh, cursor });
          } else {
            controller.enqueue(encoder.encode(`: ping\n\n`));
          }
        } catch (err) {
          console.error("[chat/stream] poll failed", err);
          send("error", { error: "Lost connection to the database." });
          finish();
          return;
        }
        if (Date.now() - started > MAX_LIFETIME_MS) {
          finish();
          return;
        }
        timer = setTimeout(tick, POLL_MS);
      };
      timer = setTimeout(tick, POLL_MS);
    },
    cancel() {
      closed = true;
      if (timer) clearTimeout(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
