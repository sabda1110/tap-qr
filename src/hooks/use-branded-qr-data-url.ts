import { useEffect, useState } from "react";
import { createBrandedQrDataUrl } from "../lib/branded-qr-code";

export function useBrandedQrDataUrl(value: string, margin = 1, width = 320) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let isCancelled = false;
    setDataUrl("");
    if (!value) return;

    void createBrandedQrDataUrl(value, { margin, width })
      .then((nextDataUrl) => {
        if (!isCancelled) setDataUrl(nextDataUrl);
      })
      .catch((error) => {
        console.error("Failed to generate branded QR", error);
      });

    return () => {
      isCancelled = true;
    };
  }, [margin, value, width]);

  return dataUrl;
}
