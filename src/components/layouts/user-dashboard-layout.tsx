import type { ReactNode } from "react";

import type { Language } from "../../i18n";
import { DashboardLayout } from "./dashboard-layout";
import { UserDashboardSidebar } from "../organisms/user-dashboard-sidebar";

type UserDashboardLayoutProps = {
  activeItem: "dashboard" | "qrGenerator";
  children: ReactNode;
  homeLabel: string;
  language: Language;
  navigation: {
    dashboard: string;
    logout: string;
    navigationLabel: string;
    qrGenerator: string;
  };
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
      content={children}
    />
  );
}
