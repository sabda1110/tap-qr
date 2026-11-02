import { useEffect } from "react";
import { startVisiblePolling } from "../lib/visible-polling";

// Initial data stays owned by the route; resume refreshes immediately after a hidden tab.
export function useVisiblePolling(refresh: () => Promise<void>, intervalMs: number) {
  useEffect(() => startVisiblePolling(() => { void refresh(); }, intervalMs, document, window), [refresh, intervalMs]);
}
