import { imageUploadMaxBytes, imageUploadTypes } from "./validation/image-upload";

export const storyImageWidth = 1080;
export const storyImageHeight = 1920;
export const storySourceMaxBytes = 10 * 1024 * 1024;

export type StoryImageTransform = {
  zoom: number;
  positionX: number;
  positionY: number;
};

export type StoryImageLayout = {
  drawWidth: number;
  drawHeight: number;
  drawX: number;
  drawY: number;
  fillZoom: number;
};

export function validateStoryImageSource(
  file: File,
): "invalidType" | "sourceTooLarge" | null {
  if (!imageUploadTypes.includes(file.type)) return "invalidType";
  if (!file.size || file.size > storySourceMaxBytes) return "sourceTooLarge";
  return null;
}

export function getStoryImageLayout(
  sourceWidth: number,
  sourceHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  transform: StoryImageTransform,
): StoryImageLayout {
  const containScale = Math.min(
    canvasWidth / sourceWidth,
    canvasHeight / sourceHeight,
  );
  const coverScale = Math.max(
    canvasWidth / sourceWidth,
    canvasHeight / sourceHeight,
  );
  const drawWidth = sourceWidth * containScale * transform.zoom;
  const drawHeight = sourceHeight * containScale * transform.zoom;
  const shiftX =
    (transform.positionX / 100) * (Math.abs(canvasWidth - drawWidth) / 2);
  const shiftY =
    (transform.positionY / 100) * (Math.abs(canvasHeight - drawHeight) / 2);
  return {
    drawWidth,
    drawHeight,
    drawX: (canvasWidth - drawWidth) / 2 + shiftX,
    drawY: (canvasHeight - drawHeight) / 2 + shiftY,
    fillZoom: coverScale / containScale,
  };
}

export function drawStoryImage(
  canvas: HTMLCanvasElement,
  image: CanvasImageSource & {
    width: number;
    height: number;
    naturalWidth?: number;
    naturalHeight?: number;
  },
  transform: StoryImageTransform,
) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("STORY_CANVAS_UNAVAILABLE");
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#111111";
  context.fillRect(0, 0, width, height);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  const backgroundScale =
    Math.max(width / sourceWidth, height / sourceHeight) * 1.08;
  const backgroundWidth = sourceWidth * backgroundScale;
  const backgroundHeight = sourceHeight * backgroundScale;
  context.save();
  context.filter = `blur(${Math.max(12, width * 0.035)}px) brightness(0.62)`;
  context.drawImage(
    image,
    (width - backgroundWidth) / 2,
    (height - backgroundHeight) / 2,
    backgroundWidth,
    backgroundHeight,
  );
  context.restore();

  const layout = getStoryImageLayout(
    sourceWidth,
    sourceHeight,
    width,
    height,
    transform,
  );
  context.save();
  context.shadowColor = "rgb(0 0 0 / 0.35)";
  context.shadowBlur = Math.max(8, width * 0.018);
  context.drawImage(
    image,
    layout.drawX,
    layout.drawY,
    layout.drawWidth,
    layout.drawHeight,
  );
  context.restore();
}

function canvasBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("STORY_EXPORT_FAILED"))),
      "image/jpeg",
      quality,
    );
  });
}

export async function exportStoryImage(
  image: HTMLImageElement,
  transform: StoryImageTransform,
  originalName: string,
): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = storyImageWidth;
  canvas.height = storyImageHeight;
  drawStoryImage(canvas, image, transform);
  let blob = await canvasBlob(canvas, 0.86);
  for (const quality of [0.76, 0.66, 0.56]) {
    if (blob.size <= imageUploadMaxBytes) break;
    blob = await canvasBlob(canvas, quality);
  }
  if (blob.size > imageUploadMaxBytes) throw new Error("STORY_EXPORT_TOO_LARGE");
  const baseName = originalName.replace(/\.[^.]+$/, "").slice(0, 80) || "story";
  return new File([blob], `${baseName}-story.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
