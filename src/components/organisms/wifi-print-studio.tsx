import { useId, useState } from "react";
import { Printer, Wifi } from "lucide-react";
import type { AdminPrintStudioContent } from "./admin-print-studio.types";
import { useWifiPrint } from "../../hooks/use-wifi-print";
import { PrintSizeSelector, type PrintDimensions } from "../elements/print-size-selector";
import { PrintStudioStyles } from "../elements/print-studio-styles";
import { AdminPrintStudioHeader } from "../molecules/admin-print-studio-header";
import { WifiPrintPreview } from "../molecules/wifi-print-preview";
import { WifiPrintThemePicker } from "../molecules/wifi-print-theme-picker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function WifiPrintStudio({ content }: { content: AdminPrintStudioContent }) {
  const wifi = content.wifi;
  const print = useWifiPrint(wifi);
  const { form, errorMessage } = print;
  const [dimensions, setDimensions] = useState<PrintDimensions>({ preset: "a6", widthMm: 105, heightMm: 148 });
  const [cropMarks, setCropMarks] = useState(false);
  const fieldId = useId();
  const errors = form.formState.errors;
  const canPrint = print.jobs.length > 0 && !print.generating;

  function printCards() {
    if (canPrint) window.print();
  }

  return (
    <section className="space-y-6">
      <PrintStudioStyles activeTab={print.mode} dimensions={dimensions} />
      <AdminPrintStudioHeader
        kicker={wifi.kicker} title={wifi.title} description={wifi.description}
        activeTab={print.mode} onTabChange={print.changeMode}
        tabSingleLabel={content.tabSingle} tabBulkLabel={content.tabBulk}
        printNowLabel={wifi.print} onPrintClick={printCards} isPrintDisabled={!canPrint}
      />
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-12">
        <div className="min-w-0 space-y-4 rounded-3xl border border-black/8 bg-[#f5f7f8] p-3 sm:p-4 lg:col-span-5 xl:col-span-4">
          <PrintSizeSelector dimensions={dimensions} onChangeDimensions={setDimensions} showCropMarks={cropMarks} onToggleCropMarks={setCropMarks} labels={content} />
          <form onSubmit={print.generate} noValidate className="space-y-4">
            <fieldset disabled={print.generating} className="space-y-4">
              <section className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
                <h2 className="flex items-center gap-2 text-sm font-bold"><Wifi aria-hidden="true" className="size-4 text-[#087e91]" />{wifi.inputTitle}</h2>
                <label htmlFor={`${fieldId}-payload`} className="mt-4 block text-xs font-semibold">{wifi.payloadLabel}</label>
                <p id={`${fieldId}-help`} className="mt-1 text-xs leading-5 text-[#69737d]">{print.mode === "single" ? wifi.singleHelp : wifi.bulkHelp}</p>
                <textarea
                  {...form.register("payloads")}
                  id={`${fieldId}-payload`} rows={print.mode === "bulk" ? 6 : 3}
                  aria-invalid={!!errors.payloads}
                  aria-describedby={`${fieldId}-help${errors.payloads ? ` ${fieldId}-error` : ""}`}
                  placeholder={wifi.placeholder} autoComplete="off" autoCorrect="off" spellCheck={false}
                  className="mt-3 block w-full min-w-0 resize-y rounded-xl border border-black/10 bg-[#f8fafc] p-3 font-mono text-sm outline-none focus:border-[#087e91] focus:ring-3 focus:ring-[#087e91]/15 aria-invalid:border-red-500"
                />
                {errors.payloads && <p id={`${fieldId}-error`} role="alert" className="mt-2 text-xs leading-5 text-red-600">{errorMessage(errors.payloads.message)}</p>}
                {print.mode === "bulk" && (
                  <div className="mt-4">
                    <label htmlFor={`${fieldId}-copies`} className="text-xs font-semibold">{wifi.copies}</label>
                    <Input {...form.register("copies", { valueAsNumber: true })} id={`${fieldId}-copies`} type="number" min={1} max={100} step={1} aria-invalid={!!errors.copies} className="mt-1.5 h-11" />
                    {errors.copies && <p role="alert" className="mt-2 text-xs text-red-600">{errorMessage(errors.copies.message)}</p>}
                  </div>
                )}
                <p className="mt-3 text-xs leading-5 text-[#69737d]">{wifi.privacy}</p>
                <p className="mt-2 text-xs leading-5 text-[#69737d]">{wifi.nfcNote}</p>
              </section>
              <WifiPrintThemePicker theme={print.theme} onChange={print.setTheme} content={wifi} />
              <section className="space-y-3 rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
                <h2 className="text-sm font-bold">{wifi.copyTitle}</h2>
                <div>
                  <label htmlFor={`${fieldId}-title`} className="text-xs font-semibold">{wifi.headlineLabel}</label>
                  <Input {...form.register("title")} id={`${fieldId}-title`} maxLength={65} aria-invalid={!!errors.title} className="mt-1.5 h-11" />
                  {errors.title && <p role="alert" className="mt-2 text-xs text-red-600">{errorMessage(errors.title.message)}</p>}
                </div>
                <div>
                  <label htmlFor={`${fieldId}-footer`} className="text-xs font-semibold">{wifi.footerLabel}</label>
                  <Input {...form.register("footer")} id={`${fieldId}-footer`} maxLength={100} aria-invalid={!!errors.footer} className="mt-1.5 h-11" />
                  {errors.footer && <p role="alert" className="mt-2 text-xs text-red-600">{errorMessage(errors.footer.message)}</p>}
                </div>
              </section>
              <Button type="submit" className="h-11 w-full">{print.generating ? wifi.generating : wifi.generate}</Button>
            </fieldset>
          </form>
          {print.mode === "bulk" && <Button type="button" onClick={printCards} disabled={!canPrint} className="h-11 w-full" variant="warning"><Printer aria-hidden="true" />{wifi.print}</Button>}
        </div>
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          <WifiPrintPreview jobs={print.jobs} theme={print.theme} mode={print.mode} title={print.values.title} footer={print.values.footer} content={wifi} dimensions={dimensions} cropMarks={cropMarks} />
        </div>
      </div>
    </section>
  );
}
