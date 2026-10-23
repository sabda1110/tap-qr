import { createServerFn } from "@tanstack/react-start";
import {
  requireAdmin,
  requireAuthenticatedUser,
  requireOwner,
} from "../auth/authorization.server";
import { assertUserOutletAccess } from "../outlets/user-outlet.repository.server";
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

export const uploadOutletLogo = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("INVALID_IMAGE_FILE");
    return data;
  })
  .handler(async ({ data }) => {
    const user = await requireAuthenticatedUser();
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("INVALID_IMAGE_FILE");
    return uploadCloudinaryImage(file, `tapqr/uploads/${user.uid}`);
  });

export const uploadOutletHighlightImage = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("INVALID_IMAGE_FILE");
    return data;
  })
  .handler(async ({ data }) => {
    const owner = await requireOwner();
    const outletId = data.get("outletId");
    const file = data.get("file");
    if (
      typeof outletId !== "string" ||
      !outletId ||
      outletId.length > 150 ||
      !(file instanceof File)
    )
      throw new Error("INVALID_IMAGE_FILE");
    await assertUserOutletAccess(owner.uid, outletId);
    const result = await uploadCloudinaryImage(
      file,
      `tapqr/highlights/${owner.uid}/${outletId}`,
      "c_limit,w_1080,h_1920,q_auto:good",
    );
    return {
      ...result,
      id: result.publicId.slice(result.publicId.lastIndexOf("/") + 1),
    };
  });
