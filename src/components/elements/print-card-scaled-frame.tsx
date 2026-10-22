import { useEffect, useRef, useState, type ReactNode } from "react";

export const BASE_CARD_WIDTH = 380;
export const BASE_CARD_HEIGHT = 550;

type PrintCardScaledFrameProps = {
  targetWidth?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  maxWidth?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Renders a card canvas scaled proportionally to fit any container width
 * without altering internal font sizes, paddings, or clipping elements.
 */
export function PrintCardScaledFrame({
  targetWidth,
  canvasWidth = BASE_CARD_WIDTH,
  canvasHeight = BASE_CARD_HEIGHT,
  maxWidth = BASE_CARD_WIDTH,
  className = "",
  children,
}: PrintCardScaledFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedWidth, setComputedWidth] = useState<number>(targetWidth ?? maxWidth);

  useEffect(() => {
    if (targetWidth) {
      setComputedWidth(targetWidth);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setComputedWidth(w);
      }
    };

    updateWidth();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) {
          setComputedWidth(w);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetWidth, maxWidth]);

  const scale = computedWidth / canvasWidth;
  const computedHeight = Math.round(computedWidth * (canvasHeight / canvasWidth));

  return (
    <div
      ref={containerRef}
      className={`print-card-scaled-frame relative mx-auto w-full overflow-hidden rounded-2xl ${className}`}
      style={{
        height: computedHeight,
        maxWidth: targetWidth ?? maxWidth,
      }}
    >
      <div
        className="print-card-scale-layer"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
