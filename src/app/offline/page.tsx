import Link from "next/link";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="px-safe flex min-h-dvh flex-col items-center justify-center text-center">
      <div className="text-5xl">📡</div>
      <h1 className="mt-4 text-xl font-bold">You&apos;re offline</h1>
      <p className="mt-2 max-w-xs text-sm text-muted">This page isn&apos;t available without a connection. Reconnect and try again.</p>
      <Link href="/home" className="mt-6 inline-flex min-h-11 items-center rounded-btn bg-surface-2 px-5 text-sm font-semibold ring-1 ring-border">
        Retry
      </Link>
    </main>
  );
}
