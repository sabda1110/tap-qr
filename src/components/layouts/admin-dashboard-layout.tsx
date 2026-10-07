import type { ReactNode } from "react";

import type { Language } from "../../i18n";
import { DashboardLayout } from "./dashboard-layout";
import { AdminDashboardSidebar } from "../organisms/admin-dashboard-sidebar";
import { AdminMobileHeader } from "../organisms/admin-mobile-header";

type AdminDashboardLayoutProps = {
  children: ReactNode;
  homeLabel: string;
  language: Language;
  navigation: { outlets: string; activation: string; cards: string; closeMenu: string; logout: string; navigationLabel: string; openMenu: string; roleLabel: string };
  onSignOut: () => void;
};

export function AdminDashboardLayout({ children, homeLabel, language, navigation, onSignOut }: AdminDashboardLayoutProps) {
  return (
    <DashboardLayout
      sidebar={<AdminDashboardSidebar content={navigation} homeLabel={homeLabel} language={language} onSignOut={onSignOut} />}
      mobileHeader={<AdminMobileHeader content={navigation} homeLabel={homeLabel} language={language} onSignOut={onSignOut} />}
      content={children}
    />
  );
}
