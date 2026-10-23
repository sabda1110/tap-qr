import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type {
  CardRecord,
  OutletProfileTheme,
  OutletPublicProfileSettings,
  SocialLink,
} from "../../lib/firebase/firestore-schema";
import type { PublicOutletProfile } from "./public-profile.types";
import {
  parseOutletHighlights,
  toPublicOutletHighlights,
} from "./outlet-highlights";

function publicUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function optionalText(value: unknown, maximum = 160): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text.slice(0, maximum) : null;
}

function publicSettings(value: unknown): OutletPublicProfileSettings {
  const settings = value && typeof value === "object"
    ? value as Partial<OutletPublicProfileSettings>
    : {};
  const theme: OutletProfileTheme = ["coffee", "barbershop", "general"].includes(
    String(settings.theme),
  ) ? settings.theme as OutletProfileTheme : "general";
  const hours = settings.hours && typeof settings.hours === "object"
    ? settings.hours
    : null;
  return {
    theme,
    tagline: optionalText(settings.tagline),
    greeting: optionalText(settings.greeting),
    hours: hours && optionalText(hours.today, 80) ? {
      isOpen: hours.isOpen === true,
      today: optionalText(hours.today, 80)!,
      closesAt: optionalText(hours.closesAt, 24),
      allHoursUrl: publicUrl(hours.allHoursUrl),
    } : null,
  };
}

export async function getPublicOutletProfile(id: string): Promise<PublicOutletProfile | null> {
  const database = getFirebaseAdminFirestore();
  let outletDocument = await database.collection("outlets").doc(id).get();
  if (!outletDocument.exists) {
    const matches = await database.collection("outlets").where("slug", "==", id).limit(1).get();
    if (matches.empty) return null;
    outletDocument = matches.docs[0];
  }
  const outlet = outletDocument.data()!;
  if (outlet.status !== "active" || !outlet.ownerId) return null;

  const snapshot = await database.collection("cards").where("ownerId", "==", outlet.ownerId).get();
  const cards = snapshot.docs
    .map((document) => ({ id: document.id, record: document.data() as CardRecord }))
    .filter(({ record }) => record.outletId === outletDocument.id && record.claimStatus === "claimed" && record.isEnabled)
    .sort((a, b) => a.id.localeCompare(b.id));
  const links: SocialLink[] = [];
  const seen = new Set<string>();
  for (const { id: cardId, record } of cards) {
    const configured = [...(record.config?.social?.links ?? [])];
    if (record.config?.type === "google_review" && record.config.google.reviewUrl && !configured.some((link) => link.type === "google_review")) {
      configured.push({ id: "review", type: "google_review", label: "", url: record.config.google.reviewUrl, isActive: true, order: -1 });
    }
    for (const link of configured.sort((a, b) => a.order - b.order)) {
      const url = publicUrl(link.url);
      if (!link.isActive || !url || seen.has(url)) continue;
      seen.add(url);
      links.push({ ...link, id: `${cardId}:${link.id}`, url });
    }
  }
  // Reviews remain the primary action; other links retain their configured order.
  links.sort((a, b) => Number(b.type === "google_review") - Number(a.type === "google_review"));
  const social = cards[0]?.record.config?.social;
  const presentation = publicSettings(outlet.publicProfile);
  return {
    id: outletDocument.id,
    name: outlet.name ?? "",
    slug: outlet.slug ?? "",
    location: outlet.address ?? "",
    description: social?.description ?? null,
    avatarUrl: publicUrl(outlet.logoUrl) ?? publicUrl(social?.avatarUrl),
    ...presentation,
    links,
    highlights: toPublicOutletHighlights(outlet.publicProfile?.highlights),
  };
}

export async function recordPublicProfileView(outletId: string) {
  await getFirebaseAdminFirestore().collection("scanEvents").add({
    business_id: outletId,
    outletId,
    cardId: null,
    event: "profile_view",
    actionType: "profile_view",
    source: "direct",
    timestamp: FieldValue.serverTimestamp(),
  });
}

export async function recordPublicProfileAction(
  outletId: string,
  channel: SocialLink["type"],
) {
  const outlet = await getFirebaseAdminFirestore()
    .collection("outlets")
    .doc(outletId)
    .get();
  if (!outlet.exists || outlet.data()?.status !== "active") return;
  await getFirebaseAdminFirestore().collection("scanEvents").add({
    business_id: outletId,
    outletId,
    cardId: null,
    event: "link_click",
    actionType: "link_click",
    channel,
    source: "public_profile",
    timestamp: FieldValue.serverTimestamp(),
  });
}

export async function recordPublicHighlightOpen(
  outletId: string,
  highlightId: string,
) {
  const outlet = await getFirebaseAdminFirestore()
    .collection("outlets")
    .doc(outletId)
    .get();
  const highlights = parseOutletHighlights(
    outlet.data()?.publicProfile?.highlights,
  );
  if (
    !outlet.exists ||
    outlet.data()?.status !== "active" ||
    !highlights.some((highlight) => highlight.id === highlightId)
  )
    return;
  await getFirebaseAdminFirestore().collection("scanEvents").add({
    business_id: outletId,
    outletId,
    cardId: null,
    highlightId,
    event: "highlight_open",
    actionType: "highlight_open",
    source: "public_profile",
    timestamp: FieldValue.serverTimestamp(),
  });
}
