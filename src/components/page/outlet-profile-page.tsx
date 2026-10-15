import { useEffect, useMemo, useRef } from "react";
import { useI18n } from "../../i18n";
import {
  trackOutletProfileAction,
  trackOutletProfileView,
} from "../../server/outlets/public-profile.functions";
import type { PublicOutletProfile } from "../../server/outlets/public-profile.types";
import { OutletProfileSection } from "../organisms/outlet-profile-section";
import {
  createOutletProfileConfig,
  type OutletProfileAction,
} from "./outlet-profile-config";

export function OutletProfilePage({
  profile,
  failed = false,
}: {
  profile: PublicOutletProfile | null;
  failed?: boolean;
}) {
  const { messages } = useI18n();
  const content = messages.outletProfile;
  const trackedOutlet = useRef<string | null>(null);
  const config = useMemo(
    () => profile ? createOutletProfileConfig(profile, content) : null,
    [content, profile],
  );

  useEffect(() => {
    if (!profile || trackedOutlet.current === profile.id) return;
    trackedOutlet.current = profile.id;
    void trackOutletProfileView({ data: { id: profile.id } }).catch(() => {});
  }, [profile]);

  function trackAction(action: OutletProfileAction) {
    if (!profile) return;
    void trackOutletProfileAction({
      data: { id: profile.id, channel: action.channel },
    }).catch(() => {});
  }

  if (config) {
    return (
      <main className="min-h-dvh bg-[#171717]">
        <OutletProfileSection
          config={config}
          content={content}
          onAction={trackAction}
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#fff4a8] px-4 text-[#111]">
      <section className="w-full max-w-sm border-[4px] border-[#111] bg-[#fffdf4] px-6 py-12 text-center shadow-[7px_7px_0_#111]">
        <h1 className="text-xl font-black uppercase tracking-tight">
          {failed ? content.error : content.unavailable}
        </h1>
        <p className="mt-3 text-sm font-medium leading-6">
          {failed ? content.errorDescription : content.unavailableDescription}
        </p>
      </section>
    </main>
  );
}
