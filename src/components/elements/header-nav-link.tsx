import { ChevronDown } from "lucide-react";

type HeaderNavLinkProps = {
  children: React.ReactNode;
  href: string;
  hasMenu?: boolean;
  onClick?: () => void;
};

export function HeaderNavLink({
  children,
  href,
  hasMenu = false,
  onClick,
}: HeaderNavLinkProps) {
  return (
    <a
      className="flex items-center gap-1.5 text-[13px] font-medium text-[#282828] no-underline hover:text-black"
      href={href}
      onClick={onClick}
    >
      {children}
      {hasMenu ? <ChevronDown aria-hidden="true" className="size-3" /> : null}
    </a>
  );
}
