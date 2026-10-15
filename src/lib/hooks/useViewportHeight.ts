"use client";
import { useEffect } from "react";

/**
 * Keeps --vvh in sync with the visual viewport so chat/AI composers stay above
 * the mobile keyboard. Also compensates for visualViewport.offsetTop on iOS.
 */
export function useViewportHeight() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const vv = window.visualViewport;
      const h = vv ? vv.height : window.innerHeight;
      root.style.setProperty("--vvh", `${Math.round(h)}px`);
      // iOS Safari shifts the layout viewport when the keyboard opens; pin us back.
      if (vv && Math.abs(vv.offsetTop) > 0) {
        root.style.setProperty("--vv-offset", `${Math.round(vv.offsetTop)}px`);
      } else {
        root.style.setProperty("--vv-offset", "0px");
      }
    };
    apply();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", apply);
    vv?.addEventListener("scroll", apply);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      vv?.removeEventListener("resize", apply);
      vv?.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
      root.style.removeProperty("--vvh");
      root.style.removeProperty("--vv-offset");
    };
  }, []);
}

/** Fills the area under the sticky top bar, respecting the visual viewport. */
export const fullScreenUnderTopbar = {
  height: "calc(var(--vvh, 100dvh) - var(--topbar-h) - var(--sat))",
  maxHeight: "calc(var(--vvh, 100dvh) - var(--topbar-h) - var(--sat))",
} as const;
