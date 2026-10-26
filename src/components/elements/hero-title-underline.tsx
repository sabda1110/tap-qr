import "./hero-title-underline.css";

export function HeroTitleUnderline() {
  return (
    <svg
      className="hero-title-underline absolute -bottom-2 left-0 h-3 w-full overflow-visible"
      viewBox="0 0 250 14"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="#ffb332" strokeWidth="4" strokeLinecap="round">
        <path pathLength="100" d="M3 5.5C72 .2 157 .4 247 9.5" />
        <path pathLength="100" d="M6 6.5c77-4 161-2 238 6" />
      </g>
    </svg>
  );
}
