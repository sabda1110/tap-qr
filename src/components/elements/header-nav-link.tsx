import { ChevronDown } from "lucide-react";
import { HeaderNavUnderline } from "./header-nav-underline";

type HeaderNavLinkProps = {
  active?: boolean;
  children: React.ReactNode;
  href: string;
  hasMenu?: boolean;
  onClick?: () => void;
};

export function HeaderNavLink({
  active = false,
  children,
  href,
  hasMenu = false,
  onClick,
}: HeaderNavLinkProps) {
  return (
    <a
      className={`relative flex items-center gap-1.5 pb-2 text-[13px] no-underline transition-[color,font-weight] duration-200 ${
        active ? "font-bold text-black" : "font-medium text-[#282828] hover:text-black"
      }`}
      href={href}
      aria-current={active ? "location" : undefined}
      onClick={onClick}
    >
      {children}
      {hasMenu ? <ChevronDown aria-hidden="true" className="size-3" /> : null}
      <HeaderNavUnderline active={active} />
    </a>
  );
}
