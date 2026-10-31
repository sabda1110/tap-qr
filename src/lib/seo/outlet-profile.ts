import type { PublicOutletProfile } from "../../server/outlets/public-profile.types";
import { localizedSeo, pageMetadata, privateRobots, serializeJsonLd } from "./metadata";
import { normalizeSeoOrigin } from "./pages";

type ProfileSeoInput = Pick<PublicOutletProfile, "id" | "name" | "slug" | "description" | "tagline" | "location" | "avatarUrl">;

function text(value: string | null | undefined) {
  return (value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(value: string, limit: number) {
  if (value.length <= limit) return value;
  const prefix = value.slice(0, limit - 1);
  const space = prefix.lastIndexOf(" ");
  return `${prefix.slice(0, space > limit * 0.6 ? space : prefix.length).trimEnd()}…`;
}

function publicImage(value: string | null) {
  try {
    const url = new URL(value ?? "");
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

/** Only already-public profile fields are eligible for search metadata. */
export function outletProfileMetadata(origin: string, locale: string, profile?: ProfileSeoInput | null, noindex = false) {
  const copy = localizedSeo(locale);
  if (!profile || !text(profile.name)) return {
    meta: [{ title: copy.profileUnavailable }, { name: "robots", content: privateRobots }],
    links: [], scripts: [],
  };
  const language = locale === "en" ? "en" : "id";
  const base = normalizeSeoOrigin(origin);
  const name = text(profile.name);
  const tagline = text(profile.tagline);
  const location = text(profile.location);
  const summary = tagline || text(profile.description) || copy.profileDescription.replace("{name}", name);
  const description = excerpt(location ? copy.profileLocationDescription.replace("{description}", summary).replace("{location}", location) : summary, 200);
  const title = `${excerpt(tagline ? `${name} — ${tagline}` : name, 90)} | TapQR`;
  const path = `/p/${encodeURIComponent(profile.slug || profile.id)}`;
  const canonical = `${base}/${language}${path}`;
  const image = publicImage(profile.avatarUrl);
  const businessId = `${base}/id${path}#business`;
  const metadata = pageMetadata(base, language, {
    title, description, path,
    ...(image ? { image: { url: image, alt: copy.profileImageAlt.replace("{name}", name), card: "summary" as const } } : {}),
  }, noindex);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": location ? "LocalBusiness" : "Organization", "@id": businessId,
        name, description: summary,
        url: `${base}/id${path}`,
        ...(location ? { address: { "@type": "PostalAddress", streetAddress: location } } : {}),
        ...(image ? { image, logo: image } : {}),
      },
      {
        "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical,
        name: title, description, inLanguage: language,
        mainEntity: { "@id": businessId },
      },
    ],
  };
  return { ...metadata, scripts: [{ type: "application/ld+json", children: serializeJsonLd(structuredData) }] };
}
