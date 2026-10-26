import type { ReactNode } from "react";

export function TutorialLayout({ header, children }: {
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fff8e9]">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
          {header}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
