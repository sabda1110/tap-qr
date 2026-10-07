import type { SocialLink } from "../../lib/firebase/firestore-schema";

export type PublicOutletProfile = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string | null;
  avatarUrl: string | null;
  links: SocialLink[];
};
