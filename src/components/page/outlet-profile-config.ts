import type { CSSProperties } from "react";
import type { Messages } from "../../i18n";
import type { SocialLink } from "../../lib/firebase/firestore-schema";
import type { PublicOutletProfile } from "../../server/outlets/public-profile.types";

export type OutletActionKind = SocialLink["type"] | "menu" | "maps";

export type OutletProfileAction = {
  id: string;
  channel: SocialLink["type"];
  kind: OutletActionKind;
  label: string;
  url: string;
  color: string;
  foreground: string;
  activeColor: string;
  activeForeground: string;
};

type ThemeVariables = CSSProperties & {
  "--bg": string;
  "--surface": string;
  "--primary": string;
  "--secondary": string;
  "--accent": string;
  "--ink": string;
  "--success": string;
  "--danger": string;
  "--star-color": string;
};

const themes: Record<PublicOutletProfile["theme"], ThemeVariables> = {
  coffee: {
    "--bg": "#f4e5c3",
    "--surface": "#fffaf0",
    "--primary": "#ff7038",
    "--secondary": "#d6a174",
    "--accent": "#ffd447",
    "--ink": "#17110d",
    "--success": "#55c878",
    "--danger": "#f05a51",
    "--star-color": "#fff159",
  },
  barbershop: {
    "--bg": "#f7f1df",
    "--surface": "#fffdf7",
    "--primary": "#ff7165",
    "--secondary": "#55cec4",
    "--accent": "#ffd24a",
    "--ink": "#101616",
    "--success": "#54c97c",
    "--danger": "#ee554d",
    "--star-color": "#fff159",
  },
  general: {
    "--bg": "#fff4a8",
    "--surface": "#fffdf4",
    "--primary": "#ffda27",
    "--secondary": "#6da0ff",
    "--accent": "#ff79b9",
    "--ink": "#111111",
    "--success": "#58cb78",
    "--danger": "#f05b52",
    "--star-color": "#fff159",
  },
};

const secondaryColors = [
  "var(--secondary)",
  "var(--accent)",
  "var(--surface)",
  "var(--primary)",
] as const;

const socialColors: Partial<
  Record<OutletActionKind, { color: string; foreground: string }>
> = {
  whatsapp: { color: "#25d366", foreground: "#111111" },
  instagram: { color: "#c13584", foreground: "#ffffff" },
  tiktok: { color: "#111111", foreground: "#ffffff" },
  facebook: { color: "#0a5ac2", foreground: "#ffffff" },
};

function actionKind(link: SocialLink): OutletActionKind {
  if (link.type !== "custom") return link.type;
  const hint = `${link.label} ${link.url}`.toLowerCase();
  if (/menu|layanan|service|catalog|katalog/.test(hint)) return "menu";
  if (/maps|lokasi|location|goo\.gl\/maps/.test(hint)) return "maps";
  return "custom";
}

export function createOutletProfileConfig(
  profile: PublicOutletProfile,
  content: Messages["outletProfile"],
) {
  const reviewLink = profile.links.find((link) => link.type === "google_review");
  const secondaryActions: OutletProfileAction[] = profile.links
    .filter((link) => link !== reviewLink)
    .map((link, index) => {
      const kind = actionKind(link);
      const brandColor = socialColors[kind];
      return {
        id: link.id,
        channel: link.type,
        kind,
        label: link.label.trim() || content.channels[kind],
        url: link.url,
        color: brandColor ? "var(--surface)" : secondaryColors[index % secondaryColors.length],
        foreground: "var(--ink)",
        activeColor: brandColor?.color ?? secondaryColors[index % secondaryColors.length],
        activeForeground: brandColor?.foreground ?? "var(--ink)",
      };
    });
  const mapsAction = secondaryActions.find((action) => action.kind === "maps");
  const hours = profile.hours;

  return {
    id: profile.id,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    tagline: profile.tagline ?? profile.description ?? content.tagline,
    greeting: profile.greeting ?? content.greeting,
    address: profile.location,
    theme: themes[profile.theme],
    marquee: `${content.marquee} ★ ${profile.name} ★`,
    status: hours ? {
      tone: hours.isOpen ? "open" as const : "closed" as const,
      label: hours.isOpen
        ? `${content.openNow}${hours.closesAt ? ` • ${content.until} ${hours.closesAt}` : ""}`
        : content.closedNow,
    } : null,
    todayHours: hours ? `${content.today}: ${hours.today}` : content.hoursUnavailable,
    allHoursUrl: hours?.allHoursUrl ?? mapsAction?.url ?? null,
    reviewAction: reviewLink ? {
      id: reviewLink.id,
      channel: reviewLink.type,
      kind: reviewLink.type,
      label: content.review,
      url: reviewLink.url,
      color: "var(--primary)",
      foreground: "var(--ink)",
      activeColor: "var(--primary)",
      activeForeground: "var(--ink)",
    } satisfies OutletProfileAction : null,
    secondaryActions,
  };
}

export type OutletProfileConfig = ReturnType<typeof createOutletProfileConfig>;
