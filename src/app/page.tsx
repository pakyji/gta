/**
 * Welcome screen. Cookie-authenticated users go straight to /home.
 * Token-only users (iframe / Brave) are restored by WelcomeScreen on the client.
 */
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/session/server";
import { WelcomeScreen } from "@/modules/session/WelcomeScreen";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  let dbError: string | null = null;
  try {
    const user = await getCurrentUser();
    if (user) redirect("/home");
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")) throw err;
    dbError = "The database is unreachable right now. Check DATABASE_URL and that PostgreSQL is running.";
  }
  return <WelcomeScreen dbError={dbError} />;
}
