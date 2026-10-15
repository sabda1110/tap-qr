export type UserRole = "owner" | "admin";
export type AccountStatus = "active" | "disabled";
export type CardMaterial = "acrylic" | "pvc";
export type CardClaimStatus = "unclaimed" | "claimed";
export type CardPrintStatus = "unprinted" | "printed";
export type CardConfigType = "google_review" | "social";
export type NfcType = "tapqr" | "google_review" | "custom";
export type OutletProfileTheme = "coffee" | "barbershop" | "general";

export type OutletPublicProfileSettings = {
  theme: OutletProfileTheme;
  tagline: string | null;
  greeting: string | null;
  hours: {
    isOpen: boolean;
    today: string;
    closesAt: string | null;
    allHoursUrl: string | null;
  } | null;
};

export type OutletRecord = {
  ownerId: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  address: string;
  phone: string;
  status: AccountStatus;
  publicProfile?: OutletPublicProfileSettings;
  createdAt: unknown;
  updatedAt: unknown;
};

export type SocialLink = {
  id: string;
  type: "instagram" | "tiktok" | "facebook" | "whatsapp" | "google_review" | "custom";
  label: string;
  url: string;
  isActive: boolean;
  order: number;
};

export type CardRecord = {
  cardId: string;
  material: CardMaterial;
  claimStatus: CardClaimStatus;
  ownerId: string | null;
  outletId: string | null;
  claim: { claimTokenHash: string | null; claimedAt: unknown | null; claimedBy: string | null };
  print: { status: CardPrintStatus; printedAt: unknown | null; printedBy: string | null };
  config: {
    type: CardConfigType;
    google: { placeId: string | null; reviewUrl: string | null; verificationStatus: "pending" | "verified" | "invalid" | null; verifiedAt: unknown | null };
    social: { profileName: string | null; description: string | null; avatarUrl: string | null; links: SocialLink[] };
  };
  nfc: { type: NfcType; url: string | null; lastWrittenAt: unknown | null; lastWrittenBy: string | null };
  isEnabled: boolean;
  createdAt: unknown;
  updatedAt: unknown;
};
