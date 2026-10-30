import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useToast } from "../components/ui/toaster";
import { consultationAdminError, type ConsultationAdminCopy, type ConsultationMutation } from "../lib/consultation-admin-view";

export function useConsultationAdmin(serverNow: string, waiting: number, copy: ConsultationAdminCopy) {
  const router = useRouter();
  const { showToast } = useToast();
  const [now, setNow] = useState(Date.parse(serverNow));
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const working = useRef(false);
  const fetching = useRef(false);
  useEffect(() => {
    const receivedAt = Date.now();
    const tick = () => setNow(Date.parse(serverNow) + Date.now() - receivedAt);
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [serverNow]);
  useEffect(() => {
    const original = document.title;
    document.title = `${waiting ? `(${waiting}) ` : ""}${copy.navigation} · TapQR`;
    return () => { document.title = original; };
  }, [waiting, copy.navigation]);
  const refresh = useCallback(async () => {
    if (fetching.current || working.current) return;
    fetching.current = true;
    setRefreshing(true);
    try { await router.invalidate(); setLoadError(false); }
    catch { setLoadError(true); }
    finally { fetching.current = false; setRefreshing(false); }
  }, [router]);
  useEffect(() => {
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 25_000);
    const onFocus = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onFocus);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", onFocus); };
  }, [refresh]);
  const mutate: ConsultationMutation = async (work) => {
    if (working.current) return false;
    working.current = true;
    setBusy(true);
    try {
      const result = await work();
      if (result.success) showToast(copy.saved, "success");
      else showToast(consultationAdminError(result.reason, copy), result.reason === "notificationFailed" ? "warning" : "error");
      try { await router.invalidate(); setLoadError(false); }
      catch { setLoadError(true); }
      return result.success;
    } catch { showToast(copy.error, "error"); return false; }
    finally { working.current = false; setBusy(false); }
  };
  return { now, busy, refreshing, loadError, refresh, mutate };
}
