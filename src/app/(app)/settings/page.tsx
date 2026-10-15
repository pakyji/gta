import { SettingsPanel } from "@/modules/session/SettingsPanel";
import { feedStatus } from "@/modules/news/server";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="px-safe space-y-4 pb-10 pt-4">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted">Install the app, update your profile and check service status.</p>
      </div>
      <SettingsPanel newsFeedConfigured={feedStatus().configured} />
    </div>
  );
}
