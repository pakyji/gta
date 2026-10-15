"use client";
/**
 * Install-to-home-screen state machine.
 *  - "installed": running in standalone mode (reliably detectable)
 *  - "prompt": Chromium browser fired beforeinstallprompt -> we can trigger the real prompt
 *  - "ios": iPhone/iPad Safari -> show Share > Add to Home Screen guide
 *  - "manual": other browsers -> show generic instructions
 *  - "unknown": still detecting (first render / SSR)
 */
import { useCallback, useEffect, useState } from "react";

export type InstallState = "unknown" | "installed" | "prompt" | "ios" | "manual";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

declare global {
  interface Window {
    __gtacInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  // Pick up an event captured by the inline <head> script before hydration
  if (window.__gtacInstallPrompt) deferredPrompt = window.__gtacInstallPrompt;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.__gtacInstallPrompt = e;
    listeners.forEach((l) => l());
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    window.__gtacInstallPrompt = null;
    listeners.forEach((l) => l());
  });
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches || nav.standalone === true;
}

export function detectEnv() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome/.test(ua);
  const isAndroid = /Android/.test(ua);
  return { isIOS, isIOSSafari: isIOS && isSafari, isAndroid };
}

export function useInstall() {
  const [state, setState] = useState<InstallState>("unknown");
  const [env, setEnv] = useState({ isIOS: false, isIOSSafari: false, isAndroid: false });
  const [installing, setInstalling] = useState(false);
  const [outcome, setOutcome] = useState<"accepted" | "dismissed" | null>(null);

  const recompute = useCallback(() => {
    const e = detectEnv();
    setEnv(e);
    if (isStandalone()) return setState("installed");
    if (deferredPrompt) return setState("prompt");
    if (e.isIOS) return setState("ios");
    setState("manual");
  }, []);

  useEffect(() => {
    const boot = window.setTimeout(() => {
      try {
        recompute();
      } catch {
        setState("manual");
      }
    }, 0);
    listeners.add(recompute);
    let mq: MediaQueryList | null = null;
    try {
      mq = window.matchMedia("(display-mode: standalone)");
      if (mq.addEventListener) mq.addEventListener("change", recompute);
      else if (mq.addListener) mq.addListener(recompute);
    } catch {
      /* ignore */
    }
    return () => {
      window.clearTimeout(boot);
      listeners.delete(recompute);
      try {
        if (mq?.removeEventListener) mq.removeEventListener("change", recompute);
        else if (mq && "removeListener" in mq) (mq as MediaQueryList & { removeListener: (cb: () => void) => void }).removeListener(recompute);
      } catch {
        /* ignore */
      }
    };
  }, [recompute]);

  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!deferredPrompt) return "unavailable";
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setOutcome(choice.outcome);
      if (choice.outcome === "accepted") {
        deferredPrompt = null;
        window.__gtacInstallPrompt = null;
      }
      recompute();
      return choice.outcome;
    } catch {
      return "unavailable";
    } finally {
      setInstalling(false);
    }
  }, [recompute]);

  return { state, env, installing, outcome, promptInstall };
}
