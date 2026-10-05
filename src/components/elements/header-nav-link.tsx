import { ChevronDown } from "lucide-react";

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
      <svg
        className={`pointer-events-none absolute -bottom-0.5 left-1/2 h-2 w-[calc(100%+12px)] -translate-x-1/2 transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
          active ? "scale-x-100 opacity-100" : "scale-x-75 opacity-0"
        }`}
        viewBox="0 0 72 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 6C12 1.5 20 1.5 29 5.5S47 9 70 3.5"
          fill="none"
          stroke="#ffb332"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    </a>
  );
}
