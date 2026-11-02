import { useState } from "react";
import QRCode from "qrcode";
import type { Language, Messages } from "../../i18n";
import { registerCashierMember, reissueCashierMemberPass } from "../../server/membership/membership.functions";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";

export function CashierRegistration({ outletId, language, content }: { outletId: string; language: Language; content: Messages["membership"]["cashier"] }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [errorSource, setErrorSource] = useState<"register" | "reissue">("register"); const [passQr, setPassQr] = useState(""); const [dialogTitle, setDialogTitle] = useState(content.success);
  function validPhone(value: string) {
    const compact = value.trim().replace(/[\s().-]/g, "");
    const digits = compact.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15 && (/^08\d+$/.test(compact) || /^62\d+$/.test(compact) || /^\+62\d+$/.test(compact));
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setErrorSource("register");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (!validPhone(String(form.get("phone")))) { setError(content.phoneInvalid); setBusy(false); return; }
    try {
      const result = await registerCashierMember({ data: { outletId, name: String(form.get("name")), phone: String(form.get("phone")), notes: String(form.get("notes")) || undefined } });
      const url = `${window.location.origin}/${language}/m/${result.token}`;
      setDialogTitle(content.success); setPassQr(await QRCode.toDataURL(url, { width: 700, margin: 2 })); formElement.reset();
    } catch (cause) { setError(cause instanceof Error && cause.message.includes("MEMBER_PHONE_EXISTS") ? content.duplicate : content.actionError); }
    finally { setBusy(false); }
  }
  async function reissue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setErrorSource("reissue");
    const formElement = event.currentTarget; const phone = String(new FormData(formElement).get("phone"));
    if (!validPhone(phone)) { setError(content.phoneInvalid); setBusy(false); return; }
    try {
      const result = await reissueCashierMemberPass({ data: { outletId, phone } });
      const url = `${window.location.origin}/${language}/m/${result.token}`;
      setDialogTitle(content.reissueSuccess); setPassQr(await QRCode.toDataURL(url, { width: 700, margin: 2 })); formElement.reset();
    } catch (cause) { setError(cause instanceof Error && cause.message.includes("MEMBER_NOT_FOUND") ? content.memberMissing : content.actionError); }
    finally { setBusy(false); }
  }
  return <>
    <form onSubmit={submit} className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000]"><h2 className="text-lg font-black uppercase">{content.register}</h2><div className="mt-4 grid gap-3"><label className="text-sm font-bold">{content.name}<Input name="name" required maxLength={40} className="mt-1" /></label><label className="text-sm font-bold">{content.phone}<Input name="phone" required inputMode="tel" autoComplete="tel" aria-invalid={errorSource === "register" && error === content.phoneInvalid} aria-describedby={errorSource === "register" && error === content.phoneInvalid ? "cashier-phone-error" : undefined} className="mt-1" /></label><label className="text-sm font-bold">{content.notes}<Input name="notes" maxLength={100} className="mt-1" /></label>{error && errorSource === "register" ? <p id={error === content.phoneInvalid ? "cashier-phone-error" : undefined} role="alert" className="text-sm font-bold text-red-600">{error}</p> : null}<Button type="submit" disabled={busy} className="min-h-12 rounded-none bg-black text-white">{busy ? content.registering : content.submit}</Button></div></form>
    <form onSubmit={reissue} className="mt-5 border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000]"><h2 className="text-lg font-black uppercase">{content.reissue}</h2><p className="mt-1 text-sm">{content.reissueHelp}</p><Input className="mt-3" name="phone" required inputMode="tel" autoComplete="tel" placeholder={content.phone} disabled={busy} aria-invalid={errorSource === "reissue" && Boolean(error)} aria-describedby={errorSource === "reissue" && error ? "cashier-reissue-error" : undefined} />{error && errorSource === "reissue" ? <p id="cashier-reissue-error" role="alert" className="mt-3 text-sm font-bold text-red-600">{error}</p> : null}<Button type="submit" disabled={busy} variant="outline" className="mt-3 min-h-12 w-full rounded-none border-2 border-black">{content.reissueSubmit}</Button></form>
    {passQr ? <Dialog title={dialogTitle} description={content.scanPass} closeLabel={content.done} onClose={() => setPassQr("")}><DialogBody><img src={passQr} alt="" className="mx-auto w-full max-w-sm border-4 border-black" /></DialogBody><DialogFooter><Button onClick={() => setPassQr("")} className="min-h-12 bg-black text-white">{content.done}</Button></DialogFooter></Dialog> : null}
  </>;
}
