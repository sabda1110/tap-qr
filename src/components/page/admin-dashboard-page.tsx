import { LogOut, ShieldCheck } from "lucide-react";

import type { UserProfile } from "../../lib/auth/user-profile";
import { useI18n } from "../../i18n";
import { useUserDashboardSession } from "../../hooks/use-user-dashboard-session";
import { BrandLogo } from "../elements/brand-logo";

export function AdminDashboardPage({ profile }: { profile: UserProfile }) {
  const { language } = useI18n();
  const signOut = useUserDashboardSession(profile, language);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 sm:p-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white p-8 shadow-sm sm:p-12">
        <div className="flex items-center justify-between border-b border-black/8 pb-6">
          <BrandLogo homeLabel="TapQR Home" language={language} to="/$locale/dashboard/admin" />
          <button
            className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-[#646b75] transition-colors hover:bg-black/5 hover:text-black"
            onClick={() => void signOut()}
            type="button"
          >
            <LogOut className="size-4" />
            Keluar
          </button>
        </div>

        <div className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-bold text-[#b45309]">
            <ShieldCheck className="size-3.5" />
            Role: Administrator
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Halo, {profile.name} (Admin)</h1>
          <p className="mt-2 text-slate-500">
            Halaman dashboard admin saat ini sedang dalam pengembangan. Sebagai administrator, akses Anda dipisahkan secara otomatis dari dashboard pengguna biasa.
          </p>
        </div>
      </div>
    </div>
  );
}
