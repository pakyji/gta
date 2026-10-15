import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="px-safe flex flex-1 flex-col items-center justify-center py-20 text-center">
      <p className="neon-text text-5xl font-black">404</p>
      <h1 className="mt-3 text-lg font-bold">Page not found</h1>
      <p className="mt-1 max-w-xs text-sm text-muted">That section doesn&apos;t exist. Use the menu to get around.</p>
      <Link href="/home" className="tap mt-6 inline-flex min-h-11 items-center rounded-btn bg-surface-2 px-5 text-sm font-semibold ring-1 ring-border">
        Go home
      </Link>
    </div>
  );
}
