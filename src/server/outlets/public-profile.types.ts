import type {
  OutletProfileTheme,
  SocialLink,
} from "../../lib/firebase/firestore-schema";
import type { PublicOutletHighlight } from "./outlet-highlights";

export type PublicOutletProfile = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string | null;
  avatarUrl: string | null;
  theme: OutletProfileTheme;
  tagline: string | null;
  greeting: string | null;
  hours: {
    isOpen: boolean;
    today: string;
    closesAt: string | null;
    allHoursUrl: string | null;
  } | null;
  links: SocialLink[];
  highlights: PublicOutletHighlight[];
};
