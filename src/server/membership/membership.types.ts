import type { MemberStatus } from "../../lib/firebase/firestore-schema";

export type MemberView = {
  id: string;
  name: string;
  maskedPhone?: string;
  status: MemberStatus;
  totalVisits: number;
  currentStamps: number;
  totalRewardsClaimed: number;
  lastVisitedAt: string | null;
  registeredAt: string;
};

export type MemberPass = MemberView & {
  outlet: { id: string; name: string; address: string; logoUrl: string | null; reviewUrl: string | null };
  reward: { targetVisits: number; title: string };
};
