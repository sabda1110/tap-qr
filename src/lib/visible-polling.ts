type PollingDocument = Pick<Document, "visibilityState" | "addEventListener" | "removeEventListener">;
type PollingWindow = Pick<Window, "setInterval" | "clearInterval">;

export function startVisiblePolling(refresh: () => void, intervalMs: number, page: PollingDocument, timers: PollingWindow) {
  let interval: number | undefined;
  const stop = () => {
    if (interval !== undefined) timers.clearInterval(interval);
    interval = undefined;
  };
  const start = () => {
    if (page.visibilityState === "visible" && interval === undefined) {
      interval = timers.setInterval(refresh, intervalMs);
    }
  };
  const visibilityChanged = () => {
    stop();
    if (page.visibilityState !== "visible") return;
    refresh();
    start();
  };
  start();
  page.addEventListener("visibilitychange", visibilityChanged);
  return () => { stop(); page.removeEventListener("visibilitychange", visibilityChanged); };
}
