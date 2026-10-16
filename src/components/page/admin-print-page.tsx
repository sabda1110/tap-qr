import type { UserProfile } from "../../lib/auth/user-profile";
import type { PrintCardDetail, PrintCardOption } from "../../server/print/admin-print.repository.server";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { AdminPrintStudio } from "../organisms/admin-print-studio";
import { WifiPrintStudio } from "../organisms/wifi-print-studio";
import { Link } from "@tanstack/react-router";
import { Share2, Wifi } from "lucide-react";

type AdminPrintPageProps = {
  studio: "social" | "wifi";
  profile: UserProfile;
  cards: PrintCardOption[];
  initialCard: PrintCardDetail | null;
};

export function AdminPrintPage({ profile, cards, initialCard, studio }: AdminPrintPageProps) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);

  return (
    <AdminDashboardLayout
      homeLabel={messages.header.brandHomeLabel}
      language={language}
      navigation={messages.adminDashboard.sidebar}
      onSignOut={() => void signOut()}
    >
      <nav aria-label={messages.adminDashboard.printStudio.wifi.navigation} className="mb-6 flex gap-2 rounded-2xl border border-black/8 bg-white p-2">
        {(["social", "wifi"] as const).map((tab) => (
          <Link key={tab} to="/$locale/dashboard/admin/print" params={{ locale: language }} search={(previous) => ({ ...previous, studio: tab })} aria-current={studio === tab ? "page" : undefined} className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold outline-none focus-visible:ring-3 focus-visible:ring-[#087e91]/20 ${studio === tab ? "bg-[#172029] text-white" : "text-[#69737d] hover:bg-[#f3f5f7]"}`}>
            {tab === "social" ? <Share2 aria-hidden="true" className="size-4" /> : <Wifi aria-hidden="true" className="size-4" />}
            {tab === "social" ? messages.adminDashboard.printStudio.wifi.socialTab : messages.adminDashboard.printStudio.wifi.wifiTab}
          </Link>
        ))}
      </nav>
      {studio === "wifi" ? <WifiPrintStudio content={messages.adminDashboard.printStudio} /> : <AdminPrintStudio
        cards={cards}
        content={messages.adminDashboard.printStudio}
        initialCard={initialCard}
        locale={language}
      />}
    </AdminDashboardLayout>
  );
}
