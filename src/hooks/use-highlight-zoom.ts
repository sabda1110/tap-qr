import { useCallback, useRef, useState, type PointerEvent } from "react";

type Point = { x: number; y: number };
const clamp = (n: number, limit: number) => Math.max(-limit, Math.min(limit, n));

export function useHighlightZoom(onPrevious: () => void, onNext: () => void) {
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [holding, setHolding] = useState(false);
  const points = useRef(new Map<number, Point>());
  const start = useRef<{
    points: Point[]; view: typeof view; time: number; multiple: boolean;
  } | null>(null);
  const reset = useCallback(() => setView({ scale: 1, x: 0, y: 0 }), []);

  function rebase(multiple: boolean) {
    start.current = {
      points: [...points.current.values()], view,
      time: performance.now(), multiple,
    };
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    rebase(points.current.size > 1 || !!start.current?.multiple);
    setHolding(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!points.current.has(event.pointerId)) return;
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const initial = start.current;
    const current = [...points.current.values()];
    if (!initial?.points[0] || !current[0]) return;
    const a = initial.points[0];
    const b = current[0];
    let scale = initial.view.scale;
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    if (initial.points[1] && current[1]) {
      const c = initial.points[1], d = current[1];
      scale = Math.max(1, Math.min(4, scale *
        Math.hypot(b.x - d.x, b.y - d.y) /
        Math.max(1, Math.hypot(a.x - c.x, a.y - c.y))));
      dx = (b.x + d.x - a.x - c.x) / 2;
      dy = (b.y + d.y - a.y - c.y) / 2;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    setView({
      scale,
      x: clamp(initial.view.x + dx, bounds.width * (scale - 1) / 2),
      y: clamp(initial.view.y + dy, bounds.height * (scale - 1) / 2),
    });
  }

  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    if (!points.current.has(event.pointerId)) return;
    const initial = start.current;
    points.current.delete(event.pointerId);
    if (points.current.size) {
      rebase(true);
      return;
    }
    start.current = null;
    setHolding(false);
    if (cancelled || !initial || initial.multiple || view.scale > 1.01) return;
    const first = initial.points[0]!;
    const dx = event.clientX - first.x;
    const dy = event.clientY - first.y;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) onPrevious(); else onNext();
    } else if (Math.hypot(dx, dy) < 12 && performance.now() - initial.time < 450) {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left + bounds.width / 2) onPrevious();
      else onNext();
    }
  }

  return {
    view, holding,
    reset,
    handlers: {
      onPointerDown, onPointerMove,
      onPointerUp: (event: PointerEvent<HTMLDivElement>) => finish(event),
      onPointerCancel: (event: PointerEvent<HTMLDivElement>) => finish(event, true),
      onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) => finish(event, true),
    },
  };
}
