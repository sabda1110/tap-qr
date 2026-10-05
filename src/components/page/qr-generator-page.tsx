import type { UserProfile } from "../../lib/auth/user-profile";
import { useI18n } from "../../i18n";
import { useUserDashboardSession } from "../../hooks/use-user-dashboard-session";
import { UserDashboardLayout } from "../layouts/user-dashboard-layout";
import { QrGeneratorPanel } from "../organisms/qr-generator-panel";

export function QrGeneratorPage({ profile }: { profile: UserProfile }) {
  const { language, messages } = useI18n();
  const signOut = useUserDashboardSession(profile, language);
  console.log(profile, "sabda");

  return (
    <UserDashboardLayout
      activeItem="qrGenerator"
      homeLabel={messages.header.brandHomeLabel}
      language={language}
      navigation={messages.userDashboard.sidebar}
      onSignOut={() => void signOut()}
    >
      <QrGeneratorPanel content={messages.qrGenerator} />
    </UserDashboardLayout>
  );
}
