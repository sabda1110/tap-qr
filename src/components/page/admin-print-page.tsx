import type { UserProfile } from "../../lib/auth/user-profile";
import type { PrintCardDetail, PrintCardOption } from "../../server/print/admin-print.repository.server";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { AdminPrintStudio } from "../organisms/admin-print-studio";

type AdminPrintPageProps = {
  profile: UserProfile;
  cards: PrintCardOption[];
  initialCard: PrintCardDetail | null;
};

export function AdminPrintPage({ profile, cards, initialCard }: AdminPrintPageProps) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);

  return (
    <AdminDashboardLayout
      homeLabel={messages.header.brandHomeLabel}
      language={language}
      navigation={messages.adminDashboard.sidebar}
      onSignOut={() => void signOut()}
    >
      <AdminPrintStudio
        cards={cards}
        content={messages.adminDashboard.printStudio}
        initialCard={initialCard}
        locale={language}
      />
    </AdminDashboardLayout>
  );
}
