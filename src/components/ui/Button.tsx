"use client";
/**
 * Button with visible active / disabled / loading / success states.
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  success?: boolean;
  block?: boolean;
  icon?: ReactNode;
}

const base =
  "tap inline-flex items-center justify-center gap-2 rounded-btn font-semibold tracking-wide transition-[transform,background-color,box-shadow,opacity] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/60 select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-gradient-to-r from-neon-purple-deep to-neon-purple text-white shadow-glow-purple hover:brightness-110",
  secondary: "bg-surface-2 text-text border border-border hover:border-border-strong",
  ghost: "bg-transparent text-muted hover:text-text hover:bg-surface-2",
  danger: "bg-gradient-to-r from-[#c81e3f] to-neon-red text-white shadow-glow-red",
  success: "bg-gradient-to-r from-emerald-600 to-neon-green text-black",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-[15px]",
  lg: "min-h-13 px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, success, block, icon, className = "", children, disabled, ...rest },
  ref,
) {
  const v = success ? "success" : variant;
  return (
    <button
      ref={ref}
      className={`${base} ${variants[v]} ${sizes[size]} ${block ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={16} /> : icon}
      <span className="truncate">{children}</span>
    </button>
  );
});
