import type { UserProfile } from "../../lib/auth/user-profile";
import type { MasterCard } from "../../server/cards/card.repository.server";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { CardMasterSection } from "../organisms/card-master-section";

type AdminCardMasterPageProps = {
  initialPage: { cards: MasterCard[]; nextCursor?: string };
  profile: UserProfile;
};

export function AdminCardMasterPage({
  initialPage,
  profile,
}: AdminCardMasterPageProps) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);

  return (
    <AdminDashboardLayout
      homeLabel={messages.header.brandHomeLabel}
      language={language}
      navigation={messages.adminDashboard.sidebar}
      onSignOut={() => void signOut()}
    >
      <CardMasterSection
        content={messages.adminDashboard.cards}
        initialPage={initialPage}
      />
    </AdminDashboardLayout>
  );
}
