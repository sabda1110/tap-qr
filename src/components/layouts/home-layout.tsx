import type { ReactNode } from "react";

type HomeLayoutProps = {
  header: ReactNode;
  hero: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
};

export function HomeLayout({ header, hero, content, footer }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {header}
      <main>
        {hero}
        {content}
      </main>
      {footer}
    </div>
  );
}
