import type { SocialLink } from "../../lib/firebase/firestore-schema";

export type OutletSummary = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  address: string;
  city: string;
  province: string;
  phone: string;
  status: "active" | "disabled";
  createdAt: string | null;
  updatedAt: string | null;
  cardCount: number;
  activeCardCount: number;
  channels: string[];
};

export type OutletDetail = OutletSummary & {
  owner: { name: string; email: string; phone: string; status: string } | null;
  cards: {
    id: string;
    cardId: string;
    material: string;
    isEnabled: boolean;
    claimStatus: string;
    channels: string[];
    links: SocialLink[];
  }[];
};

export type OutletList = { outlets: OutletSummary[]; nextCursor?: string };
