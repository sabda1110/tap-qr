import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { updateAdminCardsPrintStatus } from "../server/cards/card.functions";
import { printDocumentIds, runStudioPrintJob } from "../lib/studio-print-job";
import type { AdminPrintStudioContent } from "../components/organisms/admin-print-studio.types";
import type { PrintCardOption } from "../server/print/admin-print.repository.server";
import { useToast } from "../components/ui/toaster";

export function useStudioPrint({ cards, cardIds, content, closeDialog, onPrepareImages }: {
  cards: PrintCardOption[]; cardIds: string[]; content: AdminPrintStudioContent; closeDialog: () => void;
  onPrepareImages?: (cardIds: string[]) => Promise<void>;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isUpdatingStatus, setUpdating] = useState(false);
  const working = useRef(false);
  async function handleConfirmPrint(markAsPrinted: boolean) {
    if (working.current) return;
    working.current = true;
    setUpdating(true);
    try {
      const ids = printDocumentIds(cards, cardIds);
      await runStudioPrintJob({
        ids, markAsPrinted,
        save: async (ids) => {
          const updated = await updateAdminCardsPrintStatus({ data: { ids, status: "printed" } });
          if (updated === ids.length) showToast(content.toastPrintSuccess.replace("{count}", String(updated)), "success");
          return updated;
        },
        print: async () => {
          closeDialog();
          if (onPrepareImages) {
            try {
              await onPrepareImages(cardIds);
            } catch (err) {
              console.warn("[html-to-image] Preparation failed, using standard print:", err);
            }
          }
          await new Promise<void>((resolve) => window.setTimeout(resolve, 200));
          window.print();
        },
        refresh: async () => {
          try { await router.invalidate(); }
          catch { showToast(content.toastPrintRefreshFailure, "warning"); }
        },
      });
    } catch {
      showToast(content.toastPrintFailure, "error");
    } finally {
      working.current = false;
      setUpdating(false);
    }
  }
  return { handleConfirmPrint, isUpdatingStatus };
}
