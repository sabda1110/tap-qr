import { PrintDocument, PrintSheet } from "../elements/print-document";
import { Wifi } from "lucide-react";
import type { wifiPrintId } from "../../i18n/locales/wifi-print-id";
import type { WifiPrintJob, WifiPrintTheme } from "../../hooks/use-wifi-print";
import type { PrintDimensions } from "../elements/print-size-selector";
import { PrintCardScaledFrame } from "../elements/print-card-scaled-frame";
import { PrintCropMarks } from "../elements/print-crop-marks";
import { WifiPrintCard } from "./wifi-print-card";

type Props = {
  jobs: WifiPrintJob[];
  theme: WifiPrintTheme;
  mode: "single" | "bulk";
  title: string;
  footer: string;
  content: typeof wifiPrintId;
  dimensions: PrintDimensions;
  cropMarks: boolean;
};

export function WifiPrintPreview({ jobs, theme, mode, title, footer, content, dimensions, cropMarks }: Props) {
  if (!jobs.length) return (
    <div className="rounded-3xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
      <Wifi aria-hidden="true" className="mx-auto size-10 text-[#087e91]" />
      <h2 className="mt-5 text-lg font-bold">{content.emptyTitle}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#69737d]">{content.emptyDescription}</p>
    </div>
  );
  return (
    <section className="min-w-0 space-y-4" aria-label={content.previewTitle}>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/8 bg-white p-4 text-sm">
        <p className="font-bold">{content.ready.replace("{count}", String(jobs.length))}</p>
        <p className="text-[#087e91]">{dimensions.widthMm} × {dimensions.heightMm} mm</p>
      </div>
      <div className={`grid gap-4 ${mode === "bulk" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
        {jobs.map((job) => (
          <div key={job.id} className="min-w-0 rounded-2xl border border-black/8 bg-[#f3f5f7] p-4">
            <div className="relative mx-auto w-full max-w-[380px]">
              {cropMarks && <PrintCropMarks />}
              <PrintCardScaledFrame>
                <WifiPrintCard job={job} theme={theme} title={title} footer={footer} content={content} />
              </PrintCardScaledFrame>
            </div>
          </div>
        ))}
      </div>
      <PrintDocument>
        {jobs.map((job) => (
          <PrintSheet key={job.id} dimensions={dimensions} cropMarks={cropMarks}>
            <WifiPrintCard job={job} theme={theme} title={title} footer={footer} content={content} />
          </PrintSheet>
        ))}
      </PrintDocument>
    </section>
  );
}
