export const imageUploadMaxBytes = 2 * 1024 * 1024;
export const imageUploadTypes = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): "invalidType" | "tooLarge" | null {
  if (!imageUploadTypes.includes(file.type)) return "invalidType";
  if (!file.size || file.size > imageUploadMaxBytes) return "tooLarge";
  return null;
}
