export function GymCardDecorations({ landscape = false }: { landscape?: boolean }) {
  const width = landscape ? 516 : 380;
  const height = landscape ? 324 : 550;
  const radius = landscape ? 45 : 58;
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${width} ${height}`} fill="none">
      {[
        { x: 0, y: 0, color: "#0798ad" },
        { x: width, y: 0, color: "#ff8a24" },
        { x: 0, y: height, color: "#ffb332" },
        { x: width, y: height, color: "#0798ad" },
      ].map(({ x, y, color }) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} stroke="#172029">
          <circle r={radius} fill={color} strokeWidth="5" />
          <circle r={radius - 12} strokeWidth="2" />
          <circle r="12" fill="white" strokeWidth="4" />
          <path d={`M-${radius - 10} 0h15M${radius - 25} 0h15M0 -${radius - 10}v15M0 ${radius - 25}v15`} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      {!landscape && [0, width].map((x) => (
        <g key={x} transform={`translate(${x} 248)`} stroke="#172029" strokeWidth="3">
          <path d="M-40 0H40" strokeWidth="9" />
          <rect x="-19" y="-32" width="18" height="64" rx="5" fill="#ff8a24" />
          <rect x="1" y="-25" width="13" height="50" rx="4" fill="#ffb332" />
          <path d="M-10 -20V20M7 -15V15" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

export function GymAccentBar() {
  return <span aria-hidden="true" className="flex h-[3px] w-24 shrink-0 overflow-hidden rounded-full"><span className="flex-1 bg-[#ff8a24]" /><span className="flex-1 bg-[#ffb332]" /><span className="flex-1 bg-[#172029]" /><span className="flex-1 bg-[#0798ad]" /></span>;
}
