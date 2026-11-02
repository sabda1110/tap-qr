import { useI18n } from "../../i18n";
import type { MemberPass } from "../../server/membership/membership.types";
import { MembershipPassCard } from "../organisms/membership-pass-card";
export function MembershipPassPage({ pass }: { pass: MemberPass | null }) {
  const { messages } = useI18n();
  if (!pass) return <main className="grid min-h-dvh place-items-center bg-[#fff4a8] p-6"><div className="max-w-sm border-4 border-black bg-white p-8 text-center shadow-[7px_7px_0_#000]"><h1 className="text-xl font-black uppercase">{messages.membership.pass.unavailable}</h1><p className="mt-3">{messages.membership.pass.unavailableDescription}</p></div></main>;
  return <main className="min-h-dvh bg-[#fff4a8]"><MembershipPassCard pass={pass} content={messages.membership.pass} /></main>;
}
