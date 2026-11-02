import type { ReactNode } from "react";

import type { Language, Messages } from "../../i18n";
import { DashboardLayout } from "./dashboard-layout";
import { UserDashboardSidebar } from "../organisms/user-dashboard-sidebar";
import { UserMobileHeader } from "../organisms/user-mobile-header";
import { useMembershipNavigation } from "./membership-navigation-context";
import { useI18n } from "../../i18n";

type UserDashboardLayoutProps = {
  activeItem: "dashboard" | "accountSettings" | "orders" | "membership";
  children: ReactNode;
  homeLabel: string;
  language: Language;
  navigation: Messages["userDashboard"]["sidebar"];
  onSignOut: () => void;
};

export function UserDashboardLayout({
  activeItem,
  children,
  homeLabel,
  language,
  navigation,
  onSignOut,
}: UserDashboardLayoutProps) {
  const membershipEnabled = useMembershipNavigation();
  const { messages } = useI18n();
  return (
    <DashboardLayout
      className="bg-[#faf9f6]"
      sidebar={
        <UserDashboardSidebar
          activeItem={activeItem}
          content={navigation}
          homeLabel={homeLabel}
          language={language}
          onSignOut={onSignOut}
          membershipEnabled={membershipEnabled}
          membershipLabel={messages.membership.owner.nav}
        />
      }
      mobileHeader={
        <UserMobileHeader
          activeItem={activeItem}
          content={navigation}
          homeLabel={homeLabel}
          language={language}
          onSignOut={onSignOut}
          membershipEnabled={membershipEnabled}
          membershipLabel={messages.membership.owner.nav}
        />
      }
      content={children}
    />
  );
}
