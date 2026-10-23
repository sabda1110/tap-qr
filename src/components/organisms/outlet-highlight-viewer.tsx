import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import type { Messages } from "../../i18n";
import type { PublicOutletHighlight } from "../../server/outlets/outlet-highlights";

const storyDuration = 5_000;

export function OutletHighlightViewer({
  highlights,
  initialHighlightIndex,
  content,
  onClose,
  onHighlightOpen,
}: {
  highlights: PublicOutletHighlight[];
  initialHighlightIndex: number;
  content: Messages["outletGallery"];
  onClose: () => void;
  onHighlightOpen: (highlightId: string) => void;
}) {
  const [highlightIndex, setHighlightIndex] = useState(initialHighlightIndex);
  const [imageIndex, setImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressRef = useRef(0);
  const pointerRef = useRef<{ x: number; startedAt: number } | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const highlight = highlights[highlightIndex]!;
  const image = highlight.images[imageIndex]!;

  const show = useCallback((nextHighlight: number, nextImage: number) => {
    progressRef.current = 0;
    setProgress(0);
    setHighlightIndex(nextHighlight);
    setImageIndex(nextImage);
  }, []);

  const next = useCallback(() => {
    if (imageIndex < highlight.images.length - 1) {
      show(highlightIndex, imageIndex + 1);
      return;
    }
    if (highlightIndex < highlights.length - 1) {
      show(highlightIndex + 1, 0);
      return;
    }
    onClose();
  }, [highlight.images.length, highlightIndex, highlights.length, imageIndex, onClose, show]);

  const previous = useCallback(() => {
    if (imageIndex > 0) {
      show(highlightIndex, imageIndex - 1);
      return;
    }
    if (highlightIndex > 0) {
      const previousHighlight = highlights[highlightIndex - 1]!;
      show(highlightIndex - 1, previousHighlight.images.length - 1);
    }
  }, [highlightIndex, highlights, imageIndex, show]);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  useEffect(() => {
    onHighlightOpen(highlight.id);
  }, [highlight.id, onHighlightOpen]);

  useEffect(() => {
    const nextImage =
      highlight.images[imageIndex + 1] ??
      highlights[highlightIndex + 1]?.images[0];
    if (!nextImage) return;
    const preload = new Image();
    preload.src = nextImage.url;
  }, [highlight.images, highlightIndex, highlights, imageIndex]);

  useEffect(() => {
    if (paused) return;
    let previousTick = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const nextProgress =
        progressRef.current + (now - previousTick) / storyDuration;
      previousTick = now;
      if (nextProgress >= 1) {
        window.clearInterval(timer);
        next();
        return;
      }
      progressRef.current = nextProgress;
      setProgress(nextProgress);
    }, 50);
    return () => window.clearInterval(timer);
  }, [highlight.id, image.id, next, paused]);

  function pointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = { x: event.clientX, startedAt: performance.now() };
    setPaused(true);
  }

  function pointerUp(
    event: PointerEvent<HTMLButtonElement>,
    direction: "previous" | "next",
  ) {
    const pointer = pointerRef.current;
    pointerRef.current = null;
    setPaused(false);
    if (!pointer) return;
    const distance = event.clientX - pointer.x;
    if (Math.abs(distance) >= 48) {
      if (distance > 0) previous();
      else next();
      return;
    }
    if (performance.now() - pointer.startedAt < 450) {
      if (direction === "previous") previous();
      else next();
    }
  }

  return (
    <div
      className="outlet-story-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={highlight.title}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
        if (event.key === " ") {
          event.preventDefault();
          setPaused((value) => !value);
        }
      }}
    >
      <div className="outlet-story">
        <img
          key={image.id}
          className="outlet-story__image"
          src={image.url}
          alt={content.storyImageAlt
            .replace("{title}", highlight.title)
            .replace("{current}", String(imageIndex + 1))
            .replace("{total}", String(highlight.images.length))}
        />
        <div className="outlet-story__shade" aria-hidden="true" />
        <div className="outlet-story__progress" aria-hidden="true">
          {highlight.images.map((storyImage, index) => (
            <span key={storyImage.id}>
              <span
                style={{
                  width:
                    index < imageIndex
                      ? "100%"
                      : index === imageIndex
                        ? `${progress * 100}%`
                        : "0%",
                }}
              />
            </span>
          ))}
        </div>
        <div className="outlet-story__header">
          <img src={highlight.coverUrl} alt="" />
          <strong>{highlight.title}</strong>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          className="outlet-story__close"
          aria-label={content.closeViewer}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
        <button
          type="button"
          className="outlet-story__nav outlet-story__nav--previous"
          aria-label={content.previousImage}
          onPointerDown={pointerDown}
          onPointerUp={(event) => pointerUp(event, "previous")}
          onPointerCancel={() => {
            pointerRef.current = null;
            setPaused(false);
          }}
          onContextMenu={(event) => event.preventDefault()}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="outlet-story__nav outlet-story__nav--next"
          aria-label={content.nextImage}
          onPointerDown={pointerDown}
          onPointerUp={(event) => pointerUp(event, "next")}
          onPointerCancel={() => {
            pointerRef.current = null;
            setPaused(false);
          }}
          onContextMenu={(event) => event.preventDefault()}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
