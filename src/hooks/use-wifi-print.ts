import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expandWifiPrintJobs, wifiPrintSchema, type WifiPrintValues } from "../lib/validation/wifi-print-schema";
import type { wifiPrintId } from "../i18n/locales/wifi-print-id";
import { useToast } from "../components/ui/toaster";
import { createBrandedQrDataUrl } from "../lib/branded-qr-code";

export type WifiPrintJob = { id: string; ssid: string; qrDataUrl: string };
export type WifiPrintTheme = "monster" | "mono" | "natural" | "coffee" | "barbershop" | "kraken" | "poster";

export function useWifiPrint(content: typeof wifiPrintId) {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [theme, setTheme] = useState<WifiPrintTheme>("monster");
  const [prepared, setPrepared] = useState<{ signature: string; jobs: WifiPrintJob[] }>();
  const [generating, setGenerating] = useState(false);
  const generationId = useRef(0);
  const { showToast } = useToast();
  const form = useForm<WifiPrintValues>({
    resolver: zodResolver(wifiPrintSchema),
    defaultValues: { payloads: "", copies: 1, title: content.defaultHeadline, footer: content.defaultFooter },
  });
  const values = form.watch();
  const signature = JSON.stringify({ mode, values });
  const jobs = prepared?.signature === signature ? prepared.jobs : [];

  const generate = form.handleSubmit(async (submitted) => {
    const currentGeneration = ++generationId.current;
    setPrepared(undefined);
    if (mode === "single" && (submitted.payloads.split(/\r?\n/).filter((row) => row.trim()).length !== 1 || submitted.copies !== 1)) {
      form.setError("payloads", { message: "single" });
      return;
    }
    setGenerating(true);
    try {
      const expanded = expandWifiPrintJobs(submitted, mode);
      const qrCache = new Map<string, string>();
      const nextJobs: WifiPrintJob[] = [];
      for (const network of expanded) {
        let qrDataUrl = qrCache.get(network.payload);
        if (!qrDataUrl) {
          qrDataUrl = await createBrandedQrDataUrl(network.payload, {
            margin: 4,
            width: 640,
          });
          qrCache.set(network.payload, qrDataUrl);
        }
        nextJobs.push({ id: network.id, ssid: network.ssid, qrDataUrl });
      }
      if (generationId.current === currentGeneration) {
        // Use raw field values for freshness, because Zod trims printable text.
        setPrepared({ signature: JSON.stringify({ mode, values: form.getValues() }), jobs: nextJobs });
      }
    } catch {
      showToast(content.error, "error");
    } finally {
      if (generationId.current === currentGeneration) setGenerating(false);
    }
  });

  function changeMode(next: "single" | "bulk") {
    generationId.current += 1;
    setGenerating(false);
    setMode(next);
    setPrepared(undefined);
    form.clearErrors();
    if (next === "single") form.setValue("copies", 1);
  }

  function errorMessage(code?: string) {
    if (!code) return undefined;
    if (code.startsWith("invalid:")) return content.errors.invalid.replace("{line}", code.split(":")[1]);
    return content.errors[code as keyof typeof content.errors] ?? content.errors.required;
  }

  return { form, mode, changeMode, theme, setTheme, jobs, generating, generate, values, errorMessage };
}
