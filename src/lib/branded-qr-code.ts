import QRCode from "qrcode";

const TAPQR_LOGO_PATH = "/icon-512.png";
const LOGO_SIZE_RATIO = 0.2;
const LOGO_BACKING_RATIO = 0.24;

type BrandedQrCodeOptions = {
  margin: number;
  width: number;
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load QR image: ${source}`));
    image.src = source;
  });
}

function drawRoundedSquare(
  context: CanvasRenderingContext2D,
  position: number,
  size: number,
) {
  const radius = size * 0.22;
  context.beginPath();
  context.roundRect(position, position, size, size, radius);
  context.fillStyle = "#ffffff";
  context.fill();
}

export async function createBrandedQrDataUrl(
  value: string,
  { margin, width }: BrandedQrCodeOptions,
) {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, value, {
    margin,
    width,
    color: { dark: "#000000", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to prepare the branded QR canvas.");

  const logo = await loadImage(TAPQR_LOGO_PATH);
  const backingSize = canvas.width * LOGO_BACKING_RATIO;
  const backingPosition = (canvas.width - backingSize) / 2;
  const logoSize = canvas.width * LOGO_SIZE_RATIO;
  const logoPosition = (canvas.width - logoSize) / 2;

  drawRoundedSquare(context, backingPosition, backingSize);
  context.drawImage(logo, logoPosition, logoPosition, logoSize, logoSize);

  return canvas.toDataURL("image/png");
}
