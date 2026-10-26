export const legacyPrintThemes = [
  "google", "google-classic", "minimal", "natural", "coffee", "barbershop", "modern", "review-poster",
] as const;

export const pvcMonsterThemes = ["pvc-monster-mango", "pvc-monster-boba", "pvc-monster-ziggy"] as const;
export const acrylicMonsterThemes = ["acrylic-monster-mango", "acrylic-monster-boba", "acrylic-monster-ziggy"] as const;
export const pvcPrintThemes = [...pvcMonsterThemes, "pvc-signal", "pvc-orbit", "pvc-studio"] as const;
export const acrylicPrintThemes = [...acrylicMonsterThemes, "acrylic-sunrise", "acrylic-arch", "acrylic-mosaic"] as const;
export const socialPrintThemes = [...legacyPrintThemes, ...pvcPrintThemes, ...acrylicPrintThemes] as const;

export type PrintThemeKey = (typeof socialPrintThemes)[number];
export type PvcPrintTheme = (typeof pvcPrintThemes)[number];
export type AcrylicPrintTheme = (typeof acrylicPrintThemes)[number];
export type PvcMonsterTheme = (typeof pvcMonsterThemes)[number];
export type AcrylicMonsterTheme = (typeof acrylicMonsterThemes)[number];
export type MonsterPrintTheme = PvcMonsterTheme | AcrylicMonsterTheme;
export type ContemporaryPvcTheme = Exclude<PvcPrintTheme, PvcMonsterTheme>;
export type ContemporaryAcrylicTheme = Exclude<AcrylicPrintTheme, AcrylicMonsterTheme>;

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

export function isMonsterPrintTheme(theme: string): theme is MonsterPrintTheme {
  return [...pvcMonsterThemes, ...acrylicMonsterThemes].some((key) => key === theme);
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
