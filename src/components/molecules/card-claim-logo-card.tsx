import { useState } from "react";
import { Image as ImageIcon, Plus, Upload, UploadCloud } from "lucide-react";

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
    <div className="rounded-2xl border border-slate-200/90 bg-[#f8fafc] p-4.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#e8f8fb] text-[#087e91]">
              <UploadCloud className="size-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{content.logoTitle}</h4>
              <p className="text-[11px] text-slate-500">{content.logoSubtitle}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-[#bce8ef] bg-white p-2.5">
            <label className="flex items-center gap-1.5 rounded-lg bg-[#e8f8fb] hover:bg-[#d8f4f9] px-3 py-1.5 text-xs font-semibold text-[#087e91] border border-[#bce8ef] cursor-pointer transition-colors">
              <Upload className="size-3.5" />
              <span>{uploading ? onboardingLogo.uploading : content.chooseFile}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploading}
                className="hidden"
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

        {/* 3D Photo Picture Icon Graphic */}
        <div className="relative shrink-0 hidden sm:flex items-center justify-center p-2">
          <div className="relative w-20 h-16 rounded-xl border border-[#bce8ef] bg-gradient-to-tr from-[#e8f8fb] to-sky-50 shadow-xs flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#0798ad]/60">
                <ImageIcon className="size-7" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-[#0798ad] text-white flex items-center justify-center shadow-xs">
              <Plus className="size-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 text-amber-400 text-xs select-none">✨</span>
          <span className="absolute -bottom-1 -left-1 text-amber-400 text-xs select-none">✦</span>
        </div>
      </div>
    </div>
  );
}
