import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../auth/authorization.server";
import { uploadCloudinaryImage } from "./cloudinary.server";

export const uploadAdminImage = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("INVALID_IMAGE_FILE");
    return data;
  })
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("INVALID_IMAGE_FILE");
    return uploadCloudinaryImage(file, `tapqr/uploads/${admin.uid}`);
  });
