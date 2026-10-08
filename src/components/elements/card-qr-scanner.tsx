import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Camera, ScanLine, X } from "lucide-react";

import { Button } from "../ui/button";

type Content = {
  action: string;
  title: string;
  description: string;
  stop: string;
  unsupported: string;
  denied: string;
  invalid: string;
};

export function CardQrScanner({ content, onScan }: { content: Content; onScan: (value: string) => boolean }) {
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
      return;
    }
    stop();
    setError("");
    setOpen(true);
    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const video = videoRef.current;
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
      stop();
    }
  }

  return <div className="grid gap-3">
    <Button type="button" variant="outline" className="h-11 justify-self-start px-4" onClick={() => void start()}>
      <ScanLine />{content.action}
    </Button>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {open && <div className="overflow-hidden rounded-2xl border border-[#bce8ef] bg-[#e8f8fb] p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="font-bold">{content.title}</p><p className="mt-1 text-sm text-[#52636a]">{content.description}</p></div>
        <Button type="button" size="icon" variant="ghost" aria-label={content.stop} onClick={stop}><X /></Button>
      </div>
      <div className="relative mt-4 overflow-hidden rounded-xl bg-[#172029]">
        <video ref={videoRef} muted playsInline className="aspect-video w-full object-cover" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-6 rounded-xl border-2 border-[#ffb332] shadow-[0_0_0_999px_rgba(23,32,41,0.25)]" />
        <Camera aria-hidden="true" className="absolute top-1/2 left-1/2 size-7 -translate-1/2 text-white" />
      </div>
    </div>}
  </div>;
}
