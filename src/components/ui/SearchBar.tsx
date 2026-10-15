"use client";
import { IconClose, IconSearch } from "./Icons";

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <IconSearch size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search…"}
        className="field pl-10 pr-10"
        enterKeyHint="search"
        autoCorrect="off"
        autoCapitalize="none"
        aria-label={placeholder ?? "Search"}
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="tap absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted" aria-label="Clear search">
          <IconClose size={16} />
        </button>
      )}
    </div>
  );
}

export function FilterChips<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`tap inline-flex min-h-9 shrink-0 items-center rounded-full border px-3.5 text-sm font-semibold transition-colors ${active ? "border-neon-purple bg-neon-purple/20 text-[#e9d5ff]" : "border-border bg-surface-2 text-muted"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
