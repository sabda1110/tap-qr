import type { MemberStatus, MembershipExpiryType } from "../../lib/firebase/firestore-schema";

export type MemberView = {
  id: string;
  name: string;
  maskedPhone?: string;
  status: MemberStatus;
  expiryType: MembershipExpiryType;
  expiresAt: string | null;
  totalVisits: number;
  currentStamps: number;
  totalRewardsClaimed: number;
  lastVisitedAt: string | null;
  registeredAt: string;
};

export type MemberPass = MemberView & {
  outlet: { id: string; name: string; address: string; logoUrl: string | null; reviewUrl: string | null };
  reward: { enabled: boolean; targetVisits: number; title: string };
};
