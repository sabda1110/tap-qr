import type { UserProfile } from "../../lib/auth/user-profile";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { CardActivationSection } from "../organisms/card-activation-section";
import { ToasterProvider } from "../ui/toaster";

export function AdminCardActivationPage({ profile }: { profile: UserProfile }) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);

  return <ToasterProvider><AdminDashboardLayout homeLabel={messages.header.brandHomeLabel} language={language} navigation={messages.adminDashboard.sidebar} onSignOut={() => void signOut()}><CardActivationSection content={messages.adminDashboard.activation} /></AdminDashboardLayout></ToasterProvider>;
}
