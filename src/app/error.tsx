"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app] render error", error);
  }, [error]);
  const msg = error?.message ?? "";
  const dbIssue = /ECONNREFUSED|database|relation .* does not exist/i.test(msg);
  return (
    <main className="px-safe flex min-h-dvh flex-col items-center justify-center text-center">
      <p className="text-4xl" aria-hidden>
        ⚠️
      </p>
      <h1 className="mt-3 text-lg font-bold">Something went wrong</h1>
      <p className="mt-1 max-w-xs text-sm text-muted">
        {dbIssue
          ? "The database is unreachable. Check DATABASE_URL and that PostgreSQL is running, then try again."
          : "An unexpected error occurred. Please try again."}
      </p>
      {msg && !dbIssue && (
        <p className="mt-2 max-w-xs break-words text-[11px] text-faint" role="status">
          {msg.slice(0, 180)}
        </p>
      )}
      {error.digest && <p className="mt-1 text-[11px] text-faint">Ref: {error.digest}</p>}
      <div className="mt-6 flex flex-col gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button
          variant="secondary"
          onClick={() => {
            try {
              window.location.assign("/");
            } catch {
              window.location.href = "/";
            }
          }}
        >
          Go to welcome
        </Button>
      </div>
    </main>
  );
}
