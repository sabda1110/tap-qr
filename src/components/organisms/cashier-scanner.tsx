import { useState } from "react";
import type { Messages } from "../../i18n";
import { actOnCashierMember, verifyCashierMember } from "../../server/membership/membership.functions";
import type { MemberView } from "../../server/membership/membership.types";
import { MembershipStampGrid } from "../elements/membership-stamp-grid";
import { CardQrScanner } from "../elements/card-qr-scanner";
import { Button } from "../ui/button";

type Result = { member: MemberView; reward: { enabled: boolean; targetVisits: number; title: string } };
function tokenFromQr(value: string) { try { const parts = new URL(value).pathname.split("/"); const index = parts.indexOf("m"); return index >= 0 ? parts[index + 1] : ""; } catch { return ""; } }
export function CashierScanner({ outletId, content }: { outletId: string; content: Messages["membership"]["cashier"] }) {
  const [token, setToken] = useState(""); const [result, setResult] = useState<Result | null>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function scan(value: string) { const next = tokenFromQr(value); if (!next) return false; setToken(next); setError(""); try { setResult(await verifyCashierMember({ data: { outletId, token: next } })); } catch { setError(content.invalidQr); setResult(null); } return true; }
  async function act(action: "stamp" | "claim") { setBusy(true); setError(""); try { setResult(await actOnCashierMember({ data: { outletId, token, action } })); } catch { setError(content.actionError); } finally { setBusy(false); } }
  const ready = result ? result.member.currentStamps >= result.reward.targetVisits : false;
  return <section className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000]"><h2 className="text-lg font-black uppercase">{content.scanner}</h2><p className="mt-1 text-sm">{content.scanHelp}</p><div className="mt-4"><CardQrScanner mode="dialog" content={{ action: content.startCamera, title: content.scanner, description: content.scanHelp, stop: content.stopCamera, unsupported: content.cameraError, denied: content.cameraError, invalid: content.invalidQr }} onScan={(value) => { void scan(value); return Boolean(tokenFromQr(value)); }} buttonClassName="min-h-12 rounded-none border-2 border-black" /></div>{error ? <p className="mt-3 text-sm font-bold text-red-600">{error}</p> : null}{result ? <div className="mt-5 border-t-2 border-black pt-5"><div className="flex justify-between gap-3"><div><p className="text-xs font-black uppercase">{content.result}</p><h3 className="text-xl font-black">{result.member.name}</h3><p className="text-sm">{result.member.maskedPhone}</p></div><span className="h-fit border-2 border-black bg-[#7ee2a8] px-2 py-1 text-xs font-black uppercase">{result.member.status}</span></div><p className="mt-4 font-bold">{content.visits}: {result.member.totalVisits}</p>{result.reward.enabled ? <><div className="mt-3"><MembershipStampGrid current={result.member.currentStamps} target={result.reward.targetVisits} /></div>{ready ? <p className="mt-3 border-2 border-black bg-[#7ee2a8] p-3 font-black">{content.rewardReady.replace("{reward}", result.reward.title)}</p> : null}<Button disabled={busy} onClick={() => void act(ready ? "claim" : "stamp")} className="mt-4 min-h-14 w-full rounded-none bg-black text-white">{ready ? content.claim : content.addStamp}</Button></> : null}</div> : null}</section>;
}
