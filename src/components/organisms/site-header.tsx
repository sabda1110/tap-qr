import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Language, Messages } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";
import { HeaderActions } from "../molecules/header-actions";
import { PrimaryNavigation } from "../molecules/primary-navigation";

type SiteHeaderProps = {
  content: Messages["header"];
  language: Language;
};

export function SiteHeader({ content, language }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolledOrOpen = isScrolled || isMenuOpen;

  return (
    <header
      id="top"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolledOrOpen
          ? "border-b border-black/[0.06] bg-white/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <div
        className={`mx-auto flex w-[calc(100%-2rem)] max-w-6xl items-center justify-between transition-all duration-300 md:w-[82%] ${
          isScrolled ? "h-16 md:h-20" : "h-20 md:h-[104px]"
        }`}
      >
        <BrandLogo homeLabel={content.brandHomeLabel} language={language} />

        <div className="flex items-center gap-8 lg:gap-12">
          <PrimaryNavigation labels={content} />
          <HeaderActions labels={content} />
        </div>

        <button
          className="grid size-10 place-items-center rounded-md text-black hover:bg-black/5 md:hidden"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? content.closeMenu : content.openMenu}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-black/5 bg-white/95 px-6 py-6 shadow-xl backdrop-blur-lg md:hidden"
        >
          <PrimaryNavigation
            labels={content}
            mobile
            onNavigate={() => setIsMenuOpen(false)}
          />
          <div className="mt-6">
            <HeaderActions labels={content} mobile />
          </div>
        </div>
      ) : null}
    </header>
  );
}
