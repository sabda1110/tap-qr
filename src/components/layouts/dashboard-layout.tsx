import type { ReactNode } from "react";

type DashboardLayoutProps = {
  content: ReactNode;
  mobileHeader?: ReactNode;
  sidebar: ReactNode;
};

export function DashboardLayout({ content, mobileHeader, sidebar }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#f7f9fb] text-[#171a20] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {sidebar}
      <div className="min-w-0">{mobileHeader}<main className="px-5 py-7 sm:px-8 lg:px-12 lg:py-10">{content}</main></div>
    </div>
  );
}
