import { toPng } from "html-to-image";

export async function captureCardElementToPng(
  element: HTMLElement,
  width?: number,
  height?: number,
): Promise<string> {
  return toPng(element, {
    pixelRatio: 2.5,
    cacheBust: true,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  });
}

export async function captureCardElementsByIds(
  cardIds: string[],
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  for (const id of cardIds) {
    const el = document.querySelector<HTMLElement>(
      `[data-print-card-canvas="${id}"]`,
    );
    if (el) {
      try {
        const png = await captureCardElementToPng(el);
        results[id] = png;
      } catch (err) {
        console.warn(`[html-to-image] Failed to capture card ${id}:`, err);
      }
    }
  }
  return results;
}
