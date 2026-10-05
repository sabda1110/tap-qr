import type { ReactNode } from "react";

type DashboardLayoutProps = {
  content: ReactNode;
  sidebar: ReactNode;
};

export function DashboardLayout({ content, sidebar }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#f7f9fb] text-[#171a20] lg:grid lg:grid-cols-[260px_1fr]">
      {sidebar}
      <main className="min-w-0 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">{content}</main>
    </div>
  );
}
