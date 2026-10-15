import { useEffect, useRef, useState, type ReactNode } from "react";

export const BASE_CARD_WIDTH = 380;
export const BASE_CARD_HEIGHT = 550;

type PrintCardScaledFrameProps = {
  targetWidth?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Renders a card canvas scaled proportionally to fit any container width
 * without altering internal font sizes, paddings, or clipping elements.
 */
export function PrintCardScaledFrame({
  targetWidth,
  className = "",
  children,
}: PrintCardScaledFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedWidth, setComputedWidth] = useState<number>(targetWidth || BASE_CARD_WIDTH);

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
  }, [targetWidth]);

  const scale = computedWidth / BASE_CARD_WIDTH;
  const computedHeight = Math.round(computedWidth * (BASE_CARD_HEIGHT / BASE_CARD_WIDTH));

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[380px] overflow-hidden rounded-2xl mx-auto ${className}`}
      style={{
        height: computedHeight,
      }}
    >
      <div
        style={{
          width: BASE_CARD_WIDTH,
          height: BASE_CARD_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
