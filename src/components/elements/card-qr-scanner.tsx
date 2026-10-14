import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Camera, ScanLine, X } from "lucide-react";

import { Button } from "../ui/button";
import { Dialog, DialogBody } from "../ui/dialog";
import { cn } from "../../lib/utils";

export type CardQrScannerContent = {
  action: string;
  title: string;
  description: string;
  stop: string;
  unsupported: string;
  denied: string;
  invalid: string;
};

export type CardQrScannerProps = {
  content: CardQrScannerContent;
  onScan: (value: string) => boolean;
  mode?: "inline" | "dialog";
  buttonClassName?: string;
  disabled?: boolean;
};

export function CardQrScanner({
  content,
  onScan,
  mode = "inline",
  buttonClassName,
  disabled = false,
}: CardQrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setOpen(false);
  }, []);

  useEffect(() => stop, [stop]);

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(content.unsupported);
      if (mode === "dialog") setOpen(true);
      return;
    }
    stop();
    setError("");
    setOpen(true);
    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      let video = videoRef.current;
      if (!video) {
        await new Promise<void>((resolve) => setTimeout(resolve, 60));
        video = videoRef.current;
      }
      if (!video) {
        stop();
        return;
      }
      const reader = new BrowserQRCodeReader();
      const controls = await reader.decodeFromConstraints(
        { audio: false, video: { facingMode: { ideal: "environment" } } },
        video,
        (result) => {
          if (!result) return;
          if (onScan(result.getText())) {
            controls.stop();
            controlsRef.current = null;
            setOpen(false);
            return;
          }
          setError(content.invalid);
        },
      );
      controlsRef.current = controls;
    } catch {
      setError(content.denied);
      if (mode !== "dialog") stop();
    }
  }

  const triggerButton = (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      className={cn("h-11 justify-self-start px-4", buttonClassName)}
      onClick={() => void start()}
    >
      <ScanLine />
      {content.action}
    </Button>
  );

  if (mode === "dialog") {
    return (
      <>
        {triggerButton}
        {open && (
          <Dialog
            title={content.title}
            description={content.description}
            closeLabel={content.stop}
            onClose={stop}
            icon={ScanLine}
          >
            <DialogBody className="bg-white p-5 sm:p-6">
              <div className="mx-auto w-full max-w-lg space-y-4">
                {error && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}
                <div className="relative overflow-hidden rounded-2xl bg-[#172029]">
                  <video ref={videoRef} muted playsInline className="aspect-video w-full object-cover" />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-6 rounded-xl border-2 border-[#ffb332] shadow-[0_0_0_999px_rgba(23,32,41,0.25)]"
                  />
                  <Camera aria-hidden="true" className="absolute top-1/2 left-1/2 size-7 -translate-1/2 text-white/80" />
                </div>
              </div>
            </DialogBody>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <div className="grid gap-3">
      {triggerButton}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {open && (
        <div className="overflow-hidden rounded-2xl border border-[#bce8ef] bg-[#e8f8fb] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold">{content.title}</p>
              <p className="mt-1 text-sm text-[#52636a]">{content.description}</p>
            </div>
            <Button type="button" size="icon" variant="ghost" aria-label={content.stop} onClick={stop}>
              <X />
            </Button>
          </div>
          <div className="relative mt-4 overflow-hidden rounded-xl bg-[#172029]">
            <video ref={videoRef} muted playsInline className="aspect-video w-full object-cover" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-6 rounded-xl border-2 border-[#ffb332] shadow-[0_0_0_999px_rgba(23,32,41,0.25)]"
            />
            <Camera aria-hidden="true" className="absolute top-1/2 left-1/2 size-7 -translate-1/2 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
