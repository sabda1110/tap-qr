import { randomUUID } from "node:crypto";
import { z } from "zod";
import { validateImageFile } from "../../lib/validation/image-upload";

const uploadResponseSchema = z.object({
  secure_url: z.url().startsWith("https://res.cloudinary.com/"),
  public_id: z.string(),
});

function cloudinaryCredentials() {
  try {
    const config = new URL(process.env.CLOUDINARY_ENV ?? "");
    if (config.protocol !== "cloudinary:" || !config.username || !config.password || !/^[a-zA-Z0-9_-]+$/.test(config.hostname)) throw new Error();
    return {
      cloudName: config.hostname,
      authorization: `Basic ${Buffer.from(`${decodeURIComponent(config.username)}:${decodeURIComponent(config.password)}`).toString("base64")}`,
    };
  } catch {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }
}

export async function uploadCloudinaryImage(file: File, folder: string) {
  if (validateImageFile(file)) throw new Error("INVALID_IMAGE_FILE");
  const bytes = Buffer.from(await file.arrayBuffer());
  const matchesType = file.type === "image/png"
    ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : file.type === "image/jpeg"
      ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!matchesType) throw new Error("INVALID_IMAGE_FILE");
  const { cloudName, authorization } = cloudinaryCredentials();
  const payload = new FormData();
  payload.set("file", file);
  payload.set("public_id", `${folder}/${randomUUID()}`);
  payload.set("transformation", "c_limit,w_512,h_512");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    headers: { Authorization: authorization },
    body: payload,
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error("IMAGE_UPLOAD_FAILED");
  const result = uploadResponseSchema.safeParse(await response.json());
  if (!result.success) throw new Error("IMAGE_UPLOAD_FAILED");
  return { url: result.data.secure_url, publicId: result.data.public_id };
}
