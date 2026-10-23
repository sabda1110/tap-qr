import { ArrowLeft, ArrowRight, Images, Trash2, Upload } from "lucide-react";
import { useId, useState } from "react";
import type { Messages } from "../../i18n";
import type { OutletHighlightImage } from "../../lib/firebase/firestore-schema";
import { getCloudinaryStoryPreviewUrl } from "../../lib/cloudinary-image";
import { validateStoryImageSource } from "../../lib/story-image";
import { uploadOutletHighlightImage } from "../../server/uploads/image-upload.functions";
import { StoryImageEditor } from "../organisms/story-image-editor";
import { Button } from "../ui/button";
import { useToast } from "../ui/toaster";

type Props = {
  outletId: string;
  images: OutletHighlightImage[];
  content: Messages["outletGallery"];
  disabled: boolean;
  onChange: (images: OutletHighlightImage[]) => void;
  onBusyChange: (busy: boolean) => void;
  onRequestRemove: (imageIndex: number) => void;
  uploadImage?: typeof uploadOutletHighlightImage;
};

export function HighlightImagePicker({
  outletId,
  images,
  content,
  disabled,
  onChange,
  onBusyChange,
  onRequestRemove,
  uploadImage = uploadOutletHighlightImage,
}: Props) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const { showToast } = useToast();

  function selectFiles(files: File[]) {
    const remaining = 5 - images.length;
    if (files.length > remaining) showToast(content.tooManyImages, "warning");
    const selected = files.slice(0, remaining);
    const invalid = selected.map(validateStoryImageSource).find(Boolean);
    if (invalid) {
      showToast(content[invalid], "error");
      return;
    }
    setPendingFiles(selected);
    onBusyChange(true);
  }

  function finishCurrentFile() {
    const remainingFiles = pendingFiles.slice(1);
    setPendingFiles(remainingFiles);
    if (remainingFiles.length === 0) onBusyChange(false);
  }

  async function upload(file: File) {
    setUploading(true);
    try {
      const payload = new FormData();
      payload.set("outletId", outletId);
      payload.set("file", file);
      const uploaded = await uploadImage({ data: payload });
      onChange([
        ...images,
        {
          id: uploaded.id,
          url: uploaded.url,
          publicId: uploaded.publicId,
        },
      ]);
      finishCurrentFile();
    } catch {
      showToast(content.uploadFailed, "error");
      throw new Error("HIGHLIGHT_IMAGE_UPLOAD_FAILED");
    } finally {
      setUploading(false);
    }
  }

  function cancelCurrentFile() {
    finishCurrentFile();
  }

  function move(imageIndex: number, direction: -1 | 1) {
    const target = imageIndex + direction;
    if (target < 0 || target >= images.length) return;
    const nextImages = [...images];
    [nextImages[imageIndex], nextImages[target]] = [
      nextImages[target]!,
      nextImages[imageIndex]!,
    ];
    onChange(nextImages);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{content.imagesLabel}</p>
        <span className="text-xs font-medium text-[#69737d]">
          {content.imageCount.replace("{count}", String(images.length))}
        </span>
      </div>
      {images.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {images.map((image, imageIndex) => (
            <li key={image.id} className="overflow-hidden rounded-xl border border-black/10 bg-white">
              <img
                src={getCloudinaryStoryPreviewUrl(image.url)}
                alt=""
                width={180}
                height={320}
                className="aspect-[9/16] w-full bg-[#111] object-contain"
              />
              <div className="grid grid-cols-3 border-t border-black/8 p-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={content.moveLeft}
                  disabled={disabled || imageIndex === 0}
                  onClick={() => move(imageIndex, -1)}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={content.removeImage}
                  disabled={disabled}
                  onClick={() => onRequestRemove(imageIndex)}
                >
                  <Trash2 className="text-red-600" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={content.moveRight}
                  disabled={disabled || imageIndex === images.length - 1}
                  onClick={() => move(imageIndex, 1)}
                >
                  <ArrowRight />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {images.length === 0 && (
        <div className="mt-3 grid min-h-28 place-items-center rounded-xl border border-dashed border-black/15 bg-[#f8fafc] text-[#69737d]">
          <Images aria-hidden="true" className="size-6" />
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-white px-4 text-sm font-semibold focus-within:ring-3 focus-within:ring-ring/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
        >
          <Upload aria-hidden="true" className="size-4" />
          {uploading ? content.uploading : content.addImages}
          <input
            id={inputId}
            type="file"
            className="sr-only"
            accept="image/png,image/jpeg,image/webp"
            multiple
            disabled={
              disabled || uploading || pendingFiles.length > 0 || images.length >= 5
            }
            onChange={(event) => {
              const files = Array.from(event.currentTarget.files ?? []);
              event.currentTarget.value = "";
              if (files.length > 0) selectFiles(files);
            }}
          />
        </label>
        <p className="text-xs leading-5 text-[#69737d]">{content.uploadHelp}</p>
      </div>
      {pendingFiles[0] && (
        <StoryImageEditor
          key={`${pendingFiles[0].name}-${pendingFiles[0].lastModified}`}
          file={pendingFiles[0]}
          content={content}
          onApply={upload}
          onCancel={cancelCurrentFile}
        />
      )}
    </div>
  );
}
