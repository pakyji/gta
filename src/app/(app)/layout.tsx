/**
 * Authenticated area shell.
 * Middleware may have forwarded ?t= / client-cookie into x-session-token, so
 * getCurrentUser() can succeed on the server even without the httpOnly cookie.
 * AuthGate finishes the job on the client when the server still sees nothing.
 */
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { AuthGate } from "@/modules/session/AuthGate";
import { SessionProvider } from "@/modules/session/SessionProvider";
import { MusicPlayerProvider } from "@/modules/music/MusicPlayerContext";
import { getCurrentUser } from "@/modules/session/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser().catch(() => null);
  return (
    <SessionProvider initialUser={user}>
      <MusicPlayerProvider>
        <AppShell>
          <AuthGate>{children}</AuthGate>
        </AppShell>
      </MusicPlayerProvider>
    </SessionProvider>
  );
}
