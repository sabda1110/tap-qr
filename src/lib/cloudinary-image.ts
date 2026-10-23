const uploadMarker = "/image/upload/";
const thumbnailTransformation =
  "c_fill,w_160,h_160,g_auto,q_auto:eco,f_auto/";

export function getCloudinaryThumbnailUrl(url: string): string {
  const markerIndex = url.indexOf(uploadMarker);
  if (markerIndex < 0) return url;
  const insertionIndex = markerIndex + uploadMarker.length;
  return `${url.slice(0, insertionIndex)}${thumbnailTransformation}${url.slice(insertionIndex)}`;
}
