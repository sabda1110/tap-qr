import { useEffect, useRef } from "react";
import { useI18n } from "../../i18n";
import { trackOutletProfileView } from "../../server/outlets/public-profile.functions";
import type { PublicOutletProfile } from "../../server/outlets/public-profile.types";
import { OutletProfileSection } from "../organisms/outlet-profile-section";

export function OutletProfilePage({ profile, failed = false }: {
  profile: PublicOutletProfile | null;
  failed?: boolean;
}) {
  const { messages } = useI18n();
  const content = messages.outletProfile;
  const trackedOutlet = useRef<string | null>(null);
  useEffect(() => {
    if (!profile || trackedOutlet.current === profile.id) return;
    trackedOutlet.current = profile.id;
    void trackOutletProfileView({ data: { id: profile.id } }).catch(() => {});
  }, [profile]);
  return (
    <main className="flex min-h-dvh flex-col items-center bg-muted/40 px-4 py-8 text-foreground sm:py-12">
      {profile ? <OutletProfileSection profile={profile} content={content} /> : (
        <section className="w-full max-w-md rounded-3xl border bg-background px-6 py-12 text-center">
          <h1 className="text-xl font-bold">{failed ? content.error : content.unavailable}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{failed ? content.errorDescription : content.unavailableDescription}</p>
        </section>
      )}
      <p className="mt-8 text-xs text-muted-foreground">{content.poweredBy} <span className="font-bold text-foreground">Tap<span className="text-[#d08b16]">QR</span></span></p>
    </main>
  );
}
