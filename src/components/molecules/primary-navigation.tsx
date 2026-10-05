import { HeaderNavLink } from "../elements/header-nav-link";
import type { Messages } from "../../i18n";

type PrimaryNavigationProps = {
  labels: Pick<
    Messages["header"],
    "features" | "pricing" | "testimonials" | "mainNavigationLabel"
  >;
  mobile?: boolean;
  onNavigate?: () => void;
};

export function PrimaryNavigation({
  labels,
  mobile = false,
  onNavigate,
}: PrimaryNavigationProps) {
  const links = [
    { label: labels.features, href: "#features" },
    { label: labels.pricing, href: "#pricing" },
    { label: labels.testimonials, href: "#testimonials" },
  ];

  return (
    <nav
      className={
        mobile ? "flex flex-col gap-5" : "hidden items-center gap-7 md:flex"
      }
      aria-label={labels.mainNavigationLabel}
    >
      {links.map((link) => (
        <HeaderNavLink
          key={link.href}
          href={link.href}
          onClick={onNavigate}
        >
          {link.label}
        </HeaderNavLink>
      ))}
    </nav>
  );
}
