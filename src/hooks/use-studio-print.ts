import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { updateAdminCardsPrintStatus } from "../server/cards/card.functions";
import { printDocumentIds, runStudioPrintJob } from "../lib/studio-print-job";
import type { AdminPrintStudioContent } from "../components/organisms/admin-print-studio.types";
import type { PrintCardOption } from "../server/print/admin-print.repository.server";
import { useToast } from "../components/ui/toaster";

export function useStudioPrint({ cards, cardIds, content, closeDialog }: {
  cards: PrintCardOption[]; cardIds: string[]; content: AdminPrintStudioContent; closeDialog: () => void;
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
          await new Promise<void>((resolve) => window.setTimeout(resolve, 150));
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
