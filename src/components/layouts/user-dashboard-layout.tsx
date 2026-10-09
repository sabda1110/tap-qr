import type { ReactNode } from "react";

import type { Language, Messages } from "../../i18n";
import { DashboardLayout } from "./dashboard-layout";
import { UserDashboardSidebar } from "../organisms/user-dashboard-sidebar";
import { UserMobileHeader } from "../organisms/user-mobile-header";

type UserDashboardLayoutProps = {
  activeItem: "dashboard" | "qrGenerator";
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
  return (
    <DashboardLayout
      sidebar={
        <UserDashboardSidebar
          activeItem={activeItem}
          content={navigation}
          homeLabel={homeLabel}
          language={language}
          onSignOut={onSignOut}
        />
      }
      mobileHeader={
        <UserMobileHeader
          activeItem={activeItem}
          content={navigation}
          homeLabel={homeLabel}
          language={language}
          onSignOut={onSignOut}
        />
      }
      content={children}
    />
  );
}
