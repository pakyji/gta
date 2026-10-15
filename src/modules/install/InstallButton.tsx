"use client";
/**
 * INSTALL APP button + dismissible installation guide dialog.
 * Never shows a fake "installed" message: the installed state is derived only
 * from display-mode / navigator.standalone, and the Android prompt result comes
 * from the browser's own userChoice promise.
 */
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconClose, IconDownload, IconPlus, IconShare } from "@/components/ui/Icons";
import { useScrollLock } from "@/lib/hooks/useScrollLock";
import { useInstall } from "./useInstall";

export function InstallButton({ size = "lg", block = true, variant = "primary" as const }: { size?: "md" | "lg"; block?: boolean; variant?: "primary" | "secondary" }) {
  const { state, env, installing, outcome, promptInstall } = useInstall();
  const [guideOpen, setGuideOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const onClick = async () => {
    setNotice(null);
    if (state === "installed") {
      setNotice("You're already using the installed app.");
      return;
    }
    if (state === "prompt") {
      const result = await promptInstall();
      if (result === "accepted") setNotice("Installation started. Check your home screen in a moment.");
      else if (result === "dismissed") setNotice("Installation was cancelled. You can try again anytime.");
      else setGuideOpen(true);
      return;
    }
    setGuideOpen(true);
  };

  const label =
    state === "installed" ? "APP INSTALLED" : state === "prompt" ? "INSTALL APP" : state === "ios" ? "INSTALL ON IPHONE" : state === "unknown" ? "INSTALL APP" : "HOW TO INSTALL";

  return (
    <div className={block ? "w-full" : ""}>
      <Button
        size={size}
        block={block}
        variant={state === "installed" ? "secondary" : variant}
        onClick={onClick}
        loading={installing || state === "unknown"}
        success={state === "installed"}
        icon={<IconDownload size={18} />}
        aria-haspopup="dialog"
      >
        {label}
      </Button>
      {notice && <p className="mt-2 text-center text-xs text-muted">{notice}</p>}
      {outcome === "dismissed" && !notice && <p className="mt-2 text-center text-xs text-muted">Changed your mind? Tap again to install.</p>}
      {guideOpen && <InstallGuide onClose={() => setGuideOpen(false)} mode={state === "ios" ? "ios" : env.isAndroid ? "android" : "generic"} iosSafari={env.isIOSSafari} />}
    </div>
  );
}

function Step({ n, icon, children }: { n: number; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon-purple/20 text-xs font-bold text-[#d8b4fe]">{n}</span>
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-muted">
        <span className="inline-flex flex-wrap items-center gap-1.5">{children}{icon}</span>
      </div>
    </li>
  );
}

export function InstallGuide({ onClose, mode, iosSafari }: { onClose: () => void; mode: "ios" | "android" | "generic"; iosSafari: boolean }) {
  useScrollLock(true);
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center" role="dialog" aria-modal="true" aria-labelledby="install-title">
      <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close" onClick={onClose} />
      <div className="anim-fade-up relative w-full max-w-[640px] rounded-t-3xl border border-border bg-surface px-5 pt-4" style={{ paddingBottom: "calc(1.25rem + var(--sab))", maxHeight: "88dvh", overflowY: "auto" }}>
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border-strong" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="install-title" className="text-lg font-bold">
              {mode === "ios" ? "Add to your iPhone home screen" : mode === "android" ? "Install on Android" : "Install this app"}
            </h2>
            <p className="mt-1 text-xs text-muted">This installs the web app (PWA) to your home screen. It is not a native App Store / APK app.</p>
          </div>
          <button type="button" onClick={onClose} className="tap inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2" aria-label="Close guide">
            <IconClose size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {mode === "ios" && (
            <>
              {!iosSafari && (
                <p className="rounded-xl border border-neon-amber/30 bg-neon-amber/10 p-3 text-sm text-[#fcd34d]">
                  You seem to be in a non-Safari browser. On iPhone, installing only works from <strong>Safari</strong>.
                </p>
              )}
              <ol className="space-y-3">
                <Step n={1}>Open this website in <strong className="text-text">Safari</strong>.</Step>
                <Step n={2} icon={<IconShare size={18} className="text-neon-blue" />}>Tap the <strong className="text-text">Share</strong> button at the bottom of the screen.</Step>
                <Step n={3} icon={<IconPlus size={18} className="text-neon-blue" />}>Scroll down and select <strong className="text-text">&quot;Add to Home Screen&quot;</strong>.</Step>
                <Step n={4}>Confirm by tapping <strong className="text-text">&quot;Add&quot;</strong> in the top-right corner.</Step>
              </ol>
            </>
          )}
          {mode === "android" && (
            <>
              <p className="text-sm text-muted">Your browser didn&apos;t offer an automatic install prompt. You can still install manually:</p>
              <ol className="space-y-3">
                <Step n={1}>Open this site in <strong className="text-text">Chrome</strong>, Edge or Samsung Internet.</Step>
                <Step n={2}>Tap the <strong className="text-text">⋮ menu</strong> (top-right).</Step>
                <Step n={3} icon={<IconDownload size={18} className="text-neon-blue" />}>Choose <strong className="text-text">&quot;Install app&quot;</strong> or <strong className="text-text">&quot;Add to Home screen&quot;</strong>.</Step>
                <Step n={4}>Confirm with <strong className="text-text">Install</strong>.</Step>
              </ol>
              <p className="text-xs text-faint">If the option is missing, the site must be served over HTTPS and you may need to visit it once more before Chrome allows installation.</p>
            </>
          )}
          {mode === "generic" && (
            <>
              <p className="text-sm text-muted">This browser doesn&apos;t support automatic installation. Use one of these:</p>
              <ol className="space-y-3">
                <Step n={1}><strong className="text-text">Android:</strong> open in Chrome → ⋮ menu → &quot;Install app&quot; / &quot;Add to Home screen&quot;.</Step>
                <Step n={2}><strong className="text-text">iPhone:</strong> open in Safari → Share → &quot;Add to Home Screen&quot; → &quot;Add&quot;.</Step>
              </ol>
            </>
          )}
        </div>

        <Button variant="secondary" block className="mt-5" onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  );
}
