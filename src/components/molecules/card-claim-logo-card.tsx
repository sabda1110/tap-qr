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
    <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-[#f5f9ff] to-[#eef6ff] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e5efff] text-[#155ee8]">
              <UploadCloud className="size-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{content.logoTitle}</h4>
              <p className="text-[11px] text-slate-500">{content.logoSubtitle}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-blue-200 bg-white p-2.5">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#155ee8] transition-colors hover:bg-blue-50">
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

        <div className="relative hidden shrink-0 items-center justify-center p-2 sm:flex">
          <div className="relative flex h-16 w-20 items-center justify-center overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-tr from-blue-100 to-sky-50 shadow-xs">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#155ee8]/60">
                <ImageIcon className="size-7" />
              </div>
            )}
            <div className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-[#155ee8] text-white shadow-xs">
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
