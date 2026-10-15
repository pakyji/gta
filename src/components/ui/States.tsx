"use client";
/**
 * Shared loading / empty / error / offline state views.
 */
import type { ReactNode } from "react";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-muted" role="status">
      <Spinner size={28} className="text-neon-purple" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-5 py-10 text-center">
      {icon && <div className="text-3xl">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      {body && <p className="max-w-xs text-sm text-muted">{body}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message, onRetry, retrying }: { title?: string; message: string; onRetry?: () => void; retrying?: boolean }) {
  return (
    <div className="card border-neon-red/30 bg-neon-red/5 px-4 py-5" role="alert">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-red/15 text-neon-red" aria-hidden>
          !
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          <p className="mt-1 break-words text-sm text-muted">{message}</p>
          {onRetry && (
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry} loading={retrying}>
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function InlineError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm text-neon-red" role="alert">
      {message}
    </p>
  );
}

export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="card animate-pulse p-4">
      <div className="h-4 w-2/3 rounded bg-surface-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mt-2 h-3 w-full rounded bg-surface-3" />
      ))}
    </div>
  );
}
