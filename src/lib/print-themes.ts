export const legacyPrintThemes = [
  "google", "google-classic", "minimal", "natural", "coffee", "barbershop", "modern", "review-poster",
] as const;

export const pvcPrintThemes = ["pvc-signal", "pvc-orbit", "pvc-studio"] as const;
export const acrylicPrintThemes = ["acrylic-sunrise", "acrylic-arch", "acrylic-mosaic"] as const;
export const socialPrintThemes = [...legacyPrintThemes, ...pvcPrintThemes, ...acrylicPrintThemes] as const;

export type PrintThemeKey = (typeof socialPrintThemes)[number];
export type PvcPrintTheme = (typeof pvcPrintThemes)[number];
export type AcrylicPrintTheme = (typeof acrylicPrintThemes)[number];

type PrintMaterial = "acrylic" | "pvc";

const themesByMaterial = {
  pvc: [...legacyPrintThemes, ...pvcPrintThemes],
  acrylic: [...legacyPrintThemes, ...acrylicPrintThemes],
} as const;

export function isPvcPrintTheme(theme: string): theme is PvcPrintTheme {
  return pvcPrintThemes.some((key) => key === theme);
}

export function isAcrylicPrintTheme(theme: string): theme is AcrylicPrintTheme {
  return acrylicPrintThemes.some((key) => key === theme);
}

export function isSocialPrintTheme(theme: string): theme is PrintThemeKey {
  return socialPrintThemes.some((key) => key === theme);
}

export function getSocialPrintThemes(material: PrintMaterial): readonly PrintThemeKey[] {
  return themesByMaterial[material];
}

export function supportsPrintThemeMaterial(theme: PrintThemeKey, material: PrintMaterial): boolean {
  if (isPvcPrintTheme(theme)) return material === "pvc";
  if (isAcrylicPrintTheme(theme)) return material === "acrylic";
  return true;
}
