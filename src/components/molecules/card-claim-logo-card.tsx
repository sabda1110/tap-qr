import { useState } from "react";
import { Image as ImageIcon, Plus, Sparkles, Upload, UploadCloud } from "lucide-react";

import type { Messages } from "../../i18n";
import { validateImageFile } from "../../lib/validation/image-upload";
import { uploadOutletLogo } from "../../server/uploads/image-upload.functions";
import { useToast } from "../ui/toaster";

type Props = {
  logoUrl: string | null;
  onLogoChange: (url: string | null) => void;
  onUploadBusyChange: (busy: boolean) => void;
  content: Messages["cardClaim"];
  onboardingLogo: Messages["adminDashboard"]["activation"]["onboarding"]["logo"];
};

export function CardClaimLogoCard({
  logoUrl,
  onLogoChange,
  onUploadBusyChange,
  content,
  onboardingLogo,
}: Props) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(file: File) {
    const invalid = validateImageFile(file);
    if (invalid) {
      showToast(onboardingLogo[invalid], "error");
      return;
    }
    setUploading(true);
    onUploadBusyChange(true);
    try {
      const payload = new FormData();
      payload.set("file", file);
      const res = await uploadOutletLogo({ data: payload });
      onLogoChange(res.url);
      showToast(onboardingLogo.success, "success");
    } catch {
      showToast(onboardingLogo.failed, "error");
    } finally {
      setUploading(false);
      onUploadBusyChange(false);
    }
  }

  return (
    <div className="rounded-xl border border-black/8 bg-[#faf9f6] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e8f8fb] text-[#087e91]">
              <UploadCloud className="size-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{content.logoTitle}</h4>
              <p className="text-[11px] text-slate-500">{content.logoSubtitle}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-black/10 bg-white p-2.5">
            <label className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#087e91] transition-colors hover:bg-[#fff8e9] focus-within:ring-2 focus-within:ring-[#087e91]/30">
              <Upload className="size-3.5" />
              <span>{uploading ? onboardingLogo.uploading : content.chooseFile}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploading}
                className="sr-only"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  e.currentTarget.value = "";
                  if (file) void handleFileUpload(file);
                }}
              />
            </label>
            <span className="text-xs text-slate-500 truncate max-w-[200px]">
              {logoUrl ? content.fileUploaded : content.noFileChosen}
            </span>
            {logoUrl && (
              <button
                type="button"
                onClick={() => onLogoChange(null)}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                {onboardingLogo.remove}
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">{onboardingLogo.help}</p>
        </div>

        <div className="relative hidden shrink-0 items-center justify-center p-2 sm:flex">
          <div className="relative flex h-16 w-20 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white shadow-xs">
            {logoUrl ? (
              <img src={logoUrl} alt={content.logoTitle} className="w-full h-full object-contain p-1" />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#087e91]/60">
                <ImageIcon className="size-7" />
              </div>
            )}
            <div className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-[#087e91] text-white shadow-xs">
              <Plus className="size-3.5 stroke-[3]" />
            </div>
          </div>
          <Sparkles aria-hidden="true" className="absolute -top-1 -right-1 size-4 text-[#e5a128]" />

        </div>
      </div>
    </div>
  );
}
