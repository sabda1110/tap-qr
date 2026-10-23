import { Maximize2, RotateCcw, Scan } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Messages } from "../../i18n";
import { useStoryImageGestures } from "../../hooks/use-story-image-gestures";
import {
  drawStoryImage, exportStoryImage, getStoryImageLayout,
  type StoryImageTransform,
} from "../../lib/story-image";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";

const initialTransform: StoryImageTransform = {
  zoom: 1, positionX: 0, positionY: 0,
};

export function StoryImageEditor({ file, content, onApply, onCancel }: {
  file: File;
  content: Messages["outletGallery"];
  onApply: (file: File) => Promise<void>;
  onCancel: () => void;
}) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState(initialTransform);
  const [processing, setProcessing] = useState(false);
  const [applyFailed, setApplyFailed] = useState(false);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    let active = true;
    const url = URL.createObjectURL(file);
    const source = new Image();
    source.onload = () => { if (active) setImage(source); };
    source.onerror = () => { if (active) onCancelRef.current(); };
    source.src = url;
    return () => {
      active = false;
      source.onload = null;
      source.onerror = null;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    if (image && canvas) drawStoryImage(canvas, image, transform);
  }, [canvas, image, transform]);

  const fillZoom = image
    ? getStoryImageLayout(
        image.naturalWidth, image.naturalHeight, 360, 640, initialTransform,
      ).fillZoom
    : 1;
  const maximumZoom = Math.max(4, Math.ceil(fillZoom * 10) / 10);
  const gestures = useStoryImageGestures(
    image, transform, maximumZoom, processing, setTransform,
  );

  async function apply() {
    if (!image) return;
    setProcessing(true);
    setApplyFailed(false);
    try {
      await onApply(await exportStoryImage(image, transform, file.name));
    } catch {
      setApplyFailed(true);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Dialog
      title={content.cropTitle}
      closeLabel={content.cancelCrop}
      icon={Scan}
      busy={processing}
      dismissOnOutsidePress={false}
      onClose={onCancel}
    >
      <DialogBody className="bg-[#111] p-2 sm:p-4">
        <div
          className="relative mx-auto aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-xl bg-[#172029] text-white"
          style={{ maxHeight: "calc(100dvh - 240px)", width: "min(100%, calc((100dvh - 240px) * 9 / 16))" }}
        >
          {!image && (
            <p role="status" className="absolute inset-0 grid place-items-center p-4 text-center text-sm">
              {content.loadingPreview}
            </p>
          )}
          <canvas
            ref={setCanvas}
            width={360}
            height={640}
            role="img"
            aria-label={content.previewLabel}
            className="absolute inset-0 size-full touch-none"
            {...gestures}
            onWheel={(event) => {
              if (!image || processing) return;
              const delta = event.deltaY;
              setTransform((current) => ({
                ...current,
                zoom: Math.max(1, Math.min(maximumZoom, current.zoom - delta * 0.002)),
              }));
            }}
            onKeyDown={(event) => {
              if (processing) return;
              const directions: Record<string, [number, number]> = {
                ArrowLeft: [-5, 0], ArrowRight: [5, 0],
                ArrowUp: [0, -5], ArrowDown: [0, 5],
              };
              const direction = directions[event.key];
              if (!direction) return;
              event.preventDefault();
              setTransform((current) => ({
                ...current,
                positionX: Math.max(-100, Math.min(100, current.positionX + direction[0])),
                positionY: Math.max(-100, Math.min(100, current.positionY + direction[1])),
              }));
            }}
            tabIndex={image && !processing ? 0 : -1}
          />
          <p className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-3 pb-10 text-center text-xs leading-5">
            {content.dragHelp}
          </p>
          <fieldset
            disabled={processing || !image}
            className="absolute inset-x-0 bottom-0 grid gap-2 border-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pt-12 pb-3"
          >
            <div className="flex justify-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="size-11 rounded-full bg-black/50 text-white hover:bg-white/20 hover:text-white"
                aria-label={content.fitImage} title={content.fitImage}
                onClick={() => setTransform(initialTransform)}>
                <Maximize2 />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-11 rounded-full bg-black/50 text-white hover:bg-white/20 hover:text-white"
                aria-label={content.fillFrame} title={content.fillFrame}
                onClick={() => setTransform({ zoom: fillZoom, positionX: 0, positionY: 0 })}>
                <Scan />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-11 rounded-full bg-black/50 text-white hover:bg-white/20 hover:text-white"
                title={content.resetCrop}
                aria-label={content.resetCrop} onClick={() => setTransform(initialTransform)}>
                <RotateCcw />
              </Button>
            </div>
            <label className="flex min-h-11 items-center gap-3 text-xs">
              <span className="sr-only">{content.zoomLabel}</span>
              <span aria-hidden="true">−</span>
              <input type="range" min={1} max={maximumZoom} step={0.01}
                value={transform.zoom} className="h-11 min-w-0 flex-1 accent-white"
                onChange={(event) => {
                  const zoom = event.currentTarget.valueAsNumber;
                  setTransform((current) => ({ ...current, zoom }));
                }} />
              <output className="w-10 text-right tabular-nums">{Math.round(transform.zoom * 100)}%</output>
            </label>
          </fieldset>
        </div>
        {applyFailed && <p role="alert" className="mt-3 text-center text-sm text-red-300">{content.processingFailed}</p>}
      </DialogBody>
      <DialogFooter className="flex-row [&_button]:flex-1">
        <Button type="button" variant="outline" disabled={processing} onClick={onCancel}>{content.cancelCrop}</Button>
        <Button type="button" disabled={processing || !image} onClick={() => void apply()}>
          {processing ? content.processingImage : content.applyCrop}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
