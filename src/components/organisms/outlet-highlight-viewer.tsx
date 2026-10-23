import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Messages } from "../../i18n";
import { useHighlightZoom } from "../../hooks/use-highlight-zoom";
import { getCloudinaryStoryPreviewUrl } from "../../lib/cloudinary-image";
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

  const zoom = useHighlightZoom(previous, next);
  const stopped = paused || zoom.holding || zoom.view.scale > 1.01;
  useEffect(() => {
    zoom.reset();
  }, [image.id, zoom.reset]);

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
    if (stopped) return;
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
  }, [highlight.id, image.id, next, stopped]);

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
        <div key={image.id} className="outlet-story__media">
          <img
            className="outlet-story__background"
            src={getCloudinaryStoryPreviewUrl(image.url)}
            alt=""
            aria-hidden="true"
          />
          <img
            className="outlet-story__image"
            style={{
              transform: `translate(${zoom.view.x}px, ${zoom.view.y}px) scale(${zoom.view.scale})`,
            }}
            src={image.url}
            alt={content.storyImageAlt
              .replace("{title}", highlight.title)
              .replace("{current}", String(imageIndex + 1))
              .replace("{total}", String(highlight.images.length))}
          />
        </div>
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
          type="button"
          className="outlet-story__close outlet-story__pause"
          aria-label={stopped ? content.playStory : content.pauseStory}
          onClick={() => {
            if (stopped) {
              zoom.reset();
              setPaused(false);
            } else {
              setPaused(true);
            }
          }}
        >
          {stopped ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
        <button
          ref={closeButtonRef}
          type="button"
          className="outlet-story__close"
          aria-label={content.closeViewer}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
        <div
          className="absolute inset-0 z-20 touch-none"
          {...zoom.handlers}
          onContextMenu={(event) => event.preventDefault()}
        >
          <button
            type="button"
            className="outlet-story__nav outlet-story__nav--previous"
            aria-label={content.previousImage}
            onClick={(event) => {
              if (event.detail === 0) previous();
            }}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="outlet-story__nav outlet-story__nav--next"
            aria-label={content.nextImage}
            onClick={(event) => {
              if (event.detail === 0) next();
            }}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
