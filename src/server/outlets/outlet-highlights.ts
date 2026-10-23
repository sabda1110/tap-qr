import type {
  OutletHighlight,
  OutletHighlightImage,
} from "../../lib/firebase/firestore-schema";
import { getCloudinaryThumbnailUrl } from "../../lib/cloudinary-image";
import { outletHighlightSchema } from "./outlet.schemas";

export type PublicOutletHighlightImage = Pick<
  OutletHighlightImage,
  "id" | "url"
>;

export type PublicOutletHighlight = {
  id: string;
  title: string;
  coverUrl: string;
  images: PublicOutletHighlightImage[];
};

export function parseOutletHighlights(value: unknown): OutletHighlight[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 3)
    .map((highlight) => outletHighlightSchema.safeParse(highlight))
    .filter((result) => result.success)
    .map((result) => result.data);
}

export function toPublicOutletHighlights(
  value: unknown,
): PublicOutletHighlight[] {
  return parseOutletHighlights(value).map((highlight) => ({
    id: highlight.id,
    title: highlight.title,
    coverUrl: getCloudinaryThumbnailUrl(highlight.images[0]!.url),
    images: highlight.images.map(({ id, url }) => ({ id, url })),
  }));
}
