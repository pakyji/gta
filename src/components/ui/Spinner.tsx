export function Spinner({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Typing">
      <span className="anim-dot h-2 w-2 rounded-full bg-muted" />
      <span className="anim-dot h-2 w-2 rounded-full bg-muted [animation-delay:200ms]" />
      <span className="anim-dot h-2 w-2 rounded-full bg-muted [animation-delay:400ms]" />
    </span>
  );
}
