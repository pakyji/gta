import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-safe flex min-h-dvh flex-col items-center justify-center text-center">
      <p className="text-5xl font-black neon-text">404</p>
      <h1 className="mt-3 text-lg font-bold">Page not found</h1>
      <p className="mt-1 max-w-xs text-sm text-muted">That link doesn&apos;t exist or has moved.</p>
      <Link href="/home" className="tap mt-6 inline-flex min-h-11 items-center rounded-btn bg-surface-2 px-5 text-sm font-semibold ring-1 ring-border">
        Go home
      </Link>
    </main>
  );
}
