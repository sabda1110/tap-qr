import { useRef, type PointerEvent } from "react";
import { getStoryImageLayout, type StoryImageTransform } from "../lib/story-image";

type Point = { x: number; y: number };
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export function useStoryImageGestures(
  image: HTMLImageElement | null,
  transform: StoryImageTransform,
  maximumZoom: number,
  disabled: boolean,
  onChange: (value: StoryImageTransform) => void,
) {
  const pointers = useRef(new Map<number, Point>());
  const snapshot = useRef<{
    points: Point[];
    transform: StoryImageTransform;
  } | null>(null);

  function rebase() {
    snapshot.current = {
      points: [...pointers.current.values()],
      transform,
    };
  }

  function onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (disabled || !image) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    rebase();
  }

  function onPointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (disabled || !image || !pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const start = snapshot.current;
    const current = [...pointers.current.values()];
    if (!start?.points.length || !current.length) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const first = start.points[0]!;
    const point = current[0]!;
    let zoom = start.transform.zoom;
    let dx = point.x - first.x;
    let dy = point.y - first.y;
    if (start.points[1] && current[1]) {
      const second = start.points[1];
      const other = current[1];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      zoom = clamp(
        zoom * Math.hypot(point.x - other.x, point.y - other.y) / Math.max(1, distance),
        1,
        maximumZoom,
      );
      dx = (point.x + other.x - first.x - second.x) / 2;
      dy = (point.y + other.y - first.y - second.y) / 2;
    }
    const layout = getStoryImageLayout(
      image.naturalWidth, image.naturalHeight, bounds.width, bounds.height,
      { ...start.transform, zoom },
    );
    const move = (position: number, delta: number, space: number) =>
      space < 1 ? 0 : clamp(position + delta * 200 / space, -100, 100);
    onChange({
      zoom,
      positionX: move(start.transform.positionX, dx, Math.abs(bounds.width - layout.drawWidth)),
      positionY: move(start.transform.positionY, dy, Math.abs(bounds.height - layout.drawHeight)),
    });
  }

  function onPointerUp(event: PointerEvent<HTMLCanvasElement>) {
    pointers.current.delete(event.pointerId);
    rebase();
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onLostPointerCapture: onPointerUp,
  };
}
