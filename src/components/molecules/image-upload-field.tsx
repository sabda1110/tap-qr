import { useId, useState } from "react";
import { uploadAdminImage } from "../../server/uploads/image-upload.functions";
import { validateImageFile } from "../../lib/validation/image-upload";
import { useToast } from "../ui/toaster";

export type ImageUploadContent = {
  label: string;
  help: string;
  uploading: string;
  remove: string;
  success: string;
  failed: string;
  invalidType: string;
  tooLarge: string;
};

export function ImageUploadField({ value, onChange, onBusyChange, content, disabled = false }: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  onBusyChange: (busy: boolean) => void;
  content: ImageUploadContent;
  disabled?: boolean;
}) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  async function upload(file: File) {
    const invalid = validateImageFile(file);
    if (invalid) {
      setError(content[invalid]);
      showToast(content[invalid], "error");
      return;
    }
    setError(null);
    setUploading(true);
    onBusyChange(true);
    try {
      const payload = new FormData();
      payload.set("file", file);
      const image = await uploadAdminImage({ data: payload });
      onChange(image.url);
      showToast(content.success, "success");
    } catch {
      setError(content.failed);
      showToast(content.failed, "error");
    } finally {
      setUploading(false);
      onBusyChange(false);
    }
  }

  return <div className="mb-5 rounded-xl border border-border p-4" aria-busy={uploading}>
    <label htmlFor={id} className="block text-sm font-semibold">{content.label}</label>
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
      {value && <img src={value} alt="" className="size-16 shrink-0 rounded-xl border object-contain" width={64} height={64} />}
      <input id={id} type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled || uploading} aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`} aria-invalid={!!error} className="min-w-0 flex-1 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 focus-visible:outline-2 focus-visible:outline-ring" onChange={(event) => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = "";
        if (file) void upload(file);
      }} />
      {value && <button type="button" disabled={disabled || uploading} className="rounded-md px-2 py-2 text-sm font-medium text-destructive focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50" onClick={() => { onChange(null); setError(null); }}>{content.remove}</button>}
    </div>
    <p id={`${id}-help`} className="mt-2 text-xs text-muted-foreground">{content.help}</p>
    {uploading && <p role="status" className="mt-2 text-sm text-muted-foreground">{content.uploading}</p>}
    {error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </div>;
}
