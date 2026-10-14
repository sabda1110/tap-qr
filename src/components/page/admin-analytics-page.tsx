import type { UserProfile } from "../../lib/auth/user-profile";
import type { AdminAnalyticsSummary } from "../../server/analytics/admin-analytics.repository.server";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { AdminAnalyticsSection } from "../organisms/admin-analytics-section";

type AdminAnalyticsPageProps = {
  profile: UserProfile;
  summary: AdminAnalyticsSummary;
};

export function AdminAnalyticsPage({ profile, summary }: AdminAnalyticsPageProps) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);

  return (
    <AdminDashboardLayout
      homeLabel={messages.header.brandHomeLabel}
      language={language}
      navigation={messages.adminDashboard.sidebar}
      onSignOut={() => void signOut()}
    >
      <AdminAnalyticsSection
        content={messages.adminDashboard.analytics}
        locale={language}
        summary={summary}
      />
    </AdminDashboardLayout>
  );
}
