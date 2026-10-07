import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, CircleAlert, Info, X, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";
type Notice = { id: number; message: string; type: ToastType };
type ToastContextValue = { showToast: (message: string, type: ToastType) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const dismiss = useCallback((id: number) => setNotices((items) => items.filter((item) => item.id !== id)), []);
  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now() + Math.random();
    setNotices((items) => [...items, { id, message, type }].slice(-3));
    window.setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  return <ToastContext.Provider value={{ showToast }}>{children}<aside aria-live="polite" className="fixed right-4 bottom-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">{notices.map((notice) => <ToastNotice key={notice.id} notice={notice} onDismiss={dismiss} />)}</aside></ToastContext.Provider>;
}

function ToastNotice({ notice, onDismiss }: { notice: Notice; onDismiss: (id: number) => void }) {
  const Icon = notice.type === "success" ? CheckCircle2 : notice.type === "error" ? XCircle : notice.type === "warning" ? CircleAlert : Info;
  const tone = notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : notice.type === "error" ? "border-red-200 bg-red-50 text-red-800" : notice.type === "warning" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-cyan-200 bg-cyan-50 text-cyan-900";
  return <div className={`flex items-center gap-3 rounded-xl border p-4 shadow-xl ${tone}`} role="status"><Icon className="size-5 shrink-0" /><p className="flex-1 text-sm font-semibold">{notice.message}</p><button aria-label="Close notification" className="rounded p-1 opacity-60 hover:bg-black/5 hover:opacity-100" onClick={() => onDismiss(notice.id)} type="button"><X className="size-4" /></button></div>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToasterProvider.");
  return context;
}
