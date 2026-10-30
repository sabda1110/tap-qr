import type { ReactNode } from "react";

export function ConsultationLayout({ children, header, backLink }: { children: ReactNode; header: ReactNode; backLink: ReactNode }) {
  return <div className="min-h-dvh bg-[#f7f9fb] text-[#172029]">
    <header className="border-b border-black/8 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
        {header}
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      {backLink}
      {children}
    </main>
  </div>;
}
