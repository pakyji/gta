"use client";
import { useEffect } from "react";

/** Locks body scroll (iOS-safe) while `active` is true, restoring position afterwards. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const y = window.scrollY;
    const body = document.body;
    body.classList.add("scroll-locked");
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return () => {
      body.classList.remove("scroll-locked");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [active]);
}
