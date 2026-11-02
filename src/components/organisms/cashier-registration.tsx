import { useState } from "react";
import QRCode from "qrcode";
import type { Language, Messages } from "../../i18n";
import { registerCashierMember } from "../../server/membership/membership.functions";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";

export function CashierRegistration({ outletId, language, content }: { outletId: string; language: Language; content: Messages["membership"]["cashier"] }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [passQr, setPassQr] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await registerCashierMember({ data: { outletId, name: String(form.get("name")), phone: String(form.get("phone")), notes: String(form.get("notes")) || undefined } });
      const url = `${window.location.origin}/${language}/m/${result.token}`;
      setPassQr(await QRCode.toDataURL(url, { width: 700, margin: 2 })); event.currentTarget.reset();
    } catch (cause) { setError(cause instanceof Error && cause.message.includes("MEMBER_PHONE_EXISTS") ? content.duplicate : content.actionError); }
    finally { setBusy(false); }
  }
  return <>
    <form onSubmit={submit} className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000]"><h2 className="text-lg font-black uppercase">{content.register}</h2><div className="mt-4 grid gap-3"><label className="text-sm font-bold">{content.name}<Input name="name" required maxLength={40} className="mt-1" /></label><label className="text-sm font-bold">{content.phone}<Input name="phone" required inputMode="tel" className="mt-1" /></label><label className="text-sm font-bold">{content.notes}<Input name="notes" maxLength={100} className="mt-1" /></label>{error ? <p role="alert" className="text-sm font-bold text-red-600">{error}</p> : null}<Button disabled={busy} className="min-h-12 rounded-none bg-black text-white">{busy ? content.registering : content.submit}</Button></div></form>
    {passQr ? <Dialog title={content.success} description={content.scanPass} closeLabel={content.done} onClose={() => setPassQr("")}><DialogBody><img src={passQr} alt="" className="mx-auto w-full max-w-sm border-4 border-black" /></DialogBody><DialogFooter><Button onClick={() => setPassQr("")} className="min-h-12 bg-black text-white">{content.done}</Button></DialogFooter></Dialog> : null}
  </>;
}
