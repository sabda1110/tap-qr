import { Download, Star } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Messages } from "../../i18n";
import { downloadMembershipCard } from "../../lib/membership-card-download";
import type { MemberPass } from "../../server/membership/membership.types";
import { MembershipStampGrid } from "../elements/membership-stamp-grid";
import { Button } from "../ui/button";

export function MembershipPassCard({ pass, content }: { pass: MemberPass; content: Messages["membership"]["pass"] }) {
  const [qr, setQr] = useState("");
  const [downloading, setDownloading] = useState(false);
  useEffect(() => { void QRCode.toDataURL(window.location.href, { width: 700, margin: 2, errorCorrectionLevel: "M" }).then(setQr); }, []);
  const status = pass.status === "active" ? content.active : pass.status === "expired" ? content.expired : content.suspended;
  const validity = pass.expiryType === "lifetime" ? content.lifetime : content.validUntil.replace("{date}", new Date(pass.expiresAt!).toLocaleDateString());
  const remaining = Math.max(0, pass.reward.targetVisits - pass.currentStamps);
  async function download() {
    if (!qr) return; setDownloading(true);
    try { await downloadMembershipCard({ qrUrl: qr, outlet: pass.outlet.name, name: pass.name, id: pass.id, status: validity, stamps: `${pass.currentStamps}/${pass.reward.targetVisits}`, reward: pass.reward.title }); }
    finally { setDownloading(false); }
  }
  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <section className="border-[3px] border-black bg-[#fffdf4] p-5 shadow-[7px_7px_0_#000]">
        <div className="flex items-center gap-3 border-b-2 border-black pb-4">
          {pass.outlet.logoUrl ? <img src={pass.outlet.logoUrl} alt="" className="size-12 border-2 border-black object-cover" /> : null}
          <div><p className="text-xs font-black uppercase tracking-[.16em]">{content.title}</p><h1 className="text-xl font-black uppercase">{pass.outlet.name}</h1></div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-3"><div><p className="text-2xl font-black uppercase">{pass.name}</p><p className="mt-1 font-bold">{content.memberId}: {pass.id}</p></div><span className={`border-2 border-black px-2 py-1 text-xs font-black uppercase ${pass.status === "active" ? "bg-[#7ee2a8]" : "bg-[#ff8b8b]"}`}>{status}</span></div>
        <p className="mt-3 border-y-2 border-black py-2 text-sm font-black uppercase">{validity}</p>
        {pass.reward.enabled ? <div className="mt-5"><p className="mb-3 text-sm font-black uppercase">{content.stamps}</p><MembershipStampGrid current={pass.currentStamps} target={pass.reward.targetVisits} /><p className="mt-3 text-sm font-bold">{remaining === 0 ? content.ready : content.remaining.replace("{count}", String(remaining)).replace("{reward}", pass.reward.title)}</p></div> : null}
        <div className="mt-6 text-center">{qr ? <img src={qr} alt={content.qrAlt} className="mx-auto size-52 border-2 border-black" /> : <div className="mx-auto size-52 animate-pulse bg-black/10" />}<p className="mt-2 text-xs font-black uppercase">{content.showQr}</p></div>
      </section>
      <Button className="mt-7 min-h-14 w-full rounded-none border-2 border-black bg-[#ffb332] font-black text-black shadow-[4px_4px_0_#000]" onClick={download} disabled={!qr || downloading}><Download />{downloading ? content.downloading : content.download}</Button>
      {pass.outlet.reviewUrl ? <a className="mt-4 flex min-h-12 items-center justify-center gap-2 border-2 border-black bg-white px-4 font-black text-black shadow-[3px_3px_0_#000]" href={pass.outlet.reviewUrl} target="_blank" rel="noreferrer"><Star className="fill-[#ffb332]" />{content.review}</a> : null}
    </div>
  );
}
