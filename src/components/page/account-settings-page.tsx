import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import type { UserProfile } from "../../lib/auth/user-profile";
import { UserDashboardLayout } from "../layouts/user-dashboard-layout";
import { AccountSettingsPanel } from "../organisms/account-settings-panel";
import { ToasterProvider } from "../ui/toaster";

export function AccountSettingsPage({ profile }: { profile: UserProfile }) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);

  return (
    <ToasterProvider>
      <UserDashboardLayout
        activeItem="accountSettings"
        homeLabel={messages.header.brandHomeLabel}
        language={language}
        navigation={messages.userDashboard.sidebar}
        onSignOut={() => void signOut()}
      >
        <AccountSettingsPanel
          content={messages.accountSettings}
          profile={profile}
        />
      </UserDashboardLayout>
    </ToasterProvider>
  );
}
