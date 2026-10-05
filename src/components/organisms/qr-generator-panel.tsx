import { useState, type FormEvent } from "react";
import { Download, Link2, QrCode } from "lucide-react";
import { toDataURL } from "qrcode";
import { z } from "zod";

import { CustomInputText } from "../elements/custom-input-text";
import { Button } from "../ui/button";

type QrGeneratorPanelProps = {
  content: {
    download: string;
    emptyPreview: string;
    generate: string;
    inputLabel: string;
    inputPlaceholder: string;
    invalidUrl: string;
    kicker: string;
    previewAlt: string;
    previewTitle: string;
    title: string;
  };
};

const destinationSchema = z.url().refine((value) => /^https?:\/\//.test(value));

export function QrGeneratorPanel({ content }: QrGeneratorPanelProps) {
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>();

  async function generateQr(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedDestination = destinationSchema.safeParse(destination.trim());
    if (!parsedDestination.success) {
      setError(content.invalidUrl);
      return;
    }

    setError(undefined);
    setIsGenerating(true);
    try {
      setQrDataUrl(
        await toDataURL(parsedDestination.data, {
          color: { dark: "#171a20", light: "#ffffff" },
          errorCorrectionLevel: "M",
          margin: 2,
          width: 640,
        }),
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-xs font-bold tracking-[0.16em] text-[#0798ad] uppercase">{content.kicker}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{content.title}</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8" noValidate onSubmit={generateQr}>
          <CustomInputText
            autoComplete="url"
            error={error}
            icon={Link2}
            label={content.inputLabel}
            onChange={(event) => setDestination(event.target.value)}
            placeholder={content.inputPlaceholder}
            type="url"
            value={destination}
          />
          <Button className="mt-6 h-12 rounded-xl px-5 font-semibold" disabled={isGenerating} type="submit">
            <QrCode className="size-4" />
            {isGenerating ? "..." : content.generate}
          </Button>
        </form>

        <article className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-[#d8edf1] bg-[#eaf9fb] p-6 text-center">
          <h2 className="text-sm font-bold">{content.previewTitle}</h2>
          {qrDataUrl ? (
            <>
              <img alt={content.previewAlt} className="mt-5 size-52 rounded-xl bg-white p-3" src={qrDataUrl} />
              <a
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-black px-4 text-sm font-semibold text-white no-underline"
                download="tapqr-code.png"
                href={qrDataUrl}
              >
                <Download className="size-4" />
                {content.download}
              </a>
            </>
          ) : (
            <div className="mt-5 grid size-52 place-items-center rounded-xl border border-dashed border-[#91cfd8] bg-white/60 text-sm leading-6 text-[#5d7479]">
              <QrCode className="mb-2 size-8 text-[#0798ad]" />
              <span className="max-w-32">{content.emptyPreview}</span>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
