type VintageCoffeeMascotProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
};

export function VintageCoffeeMascot({
  className = "",
  size = "md",
}: VintageCoffeeMascotProps) {
  const sizeClass = {
    sm: "size-20",
    md: "size-28 sm:size-32",
    lg: "size-36 sm:size-40",
    hero: "w-40 h-44 sm:w-48 sm:h-52",
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`}>
      <svg
        viewBox="0 0 200 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full drop-shadow-md select-none"
      >
        <defs>
          {/* Halftone Screen Texture for 1930s Print Shading */}
          <pattern id="vintage-screen-dots" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" fill="#1c1917" />
          </pattern>
        </defs>

        {/* RETRO STARBURST / COMIC EXPLOSION BACKDROP */}
        <path
          d="M100 12 L112 28 L130 18 L134 38 L154 36 L150 56 L170 62 L158 80 L174 92 L156 104 L168 120 L148 124 L152 144 L132 140 L128 158 L110 148 L100 164 L90 148 L72 158 L68 140 L48 144 L52 124 L32 120 L44 104 L26 92 L42 80 L30 62 L50 56 L46 36 L66 38 L70 18 L88 28 Z"
          fill="#fef3c7"
          stroke="#1c1917"
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />

        {/* RETRO SPARKLES ✦ AROUND MASCOT */}
        <path d="M42 22 Q 42 27, 47 27 Q 42 27, 42 32 Q 42 27, 37 27 Q 42 27, 42 22 Z" fill="#1c1917" />
        <path d="M162 26 Q 162 31, 167 31 Q 162 31, 162 36 Q 162 31, 157 31 Q 162 31, 162 26 Z" fill="#1c1917" />
        <path d="M172 136 Q 172 140, 176 140 Q 172 140, 172 144 Q 172 140, 168 140 Q 172 140, 172 136 Z" fill="#1c1917" />
        <path d="M28 124 Q 28 128, 32 128 Q 28 128, 28 132 Q 28 128, 24 128 Q 28 128, 28 124 Z" fill="#1c1917" />

        {/* STEAM SPIRALS FROM COFFEE CUP HEAD */}
        <g stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M84 44 C 80 34, 88 28, 82 18" />
          <path d="M100 42 C 96 30, 106 24, 100 12" />
          <path d="M116 44 C 112 34, 120 28, 114 18" />
        </g>

        {/* RUBBER HOSE LEGS */}
        <path
          d="M80 134 Q 72 152, 68 166"
          stroke="#1c1917"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M120 134 Q 128 152, 134 166"
          stroke="#1c1917"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* LEFT CHUNKY CARTOON SNEAKER */}
        <g>
          {/* Ankle cuff */}
          <ellipse cx="68" cy="166" rx="9" ry="4" fill="#ffffff" stroke="#1c1917" strokeWidth="2.5" />
          {/* Shoe body */}
          <path
            d="M52 170 C 44 172, 40 180, 48 188 C 54 192, 78 192, 82 186 C 84 180, 80 172, 70 170 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
          />
          {/* Sole with tread lines */}
          <path
            d="M45 186 C 52 196, 78 196, 84 187 L 85 192 C 78 200, 50 200, 43 190 Z"
            fill="#1c1917"
          />
          {/* Toe cap crease */}
          <path d="M50 178 Q 54 184, 52 188" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* RIGHT CHUNKY CARTOON SNEAKER */}
        <g>
          {/* Ankle cuff */}
          <ellipse cx="134" cy="166" rx="9" ry="4" fill="#ffffff" stroke="#1c1917" strokeWidth="2.5" />
          {/* Shoe body */}
          <path
            d="M118 170 C 128 172, 132 180, 126 186 C 130 192, 154 192, 160 186 C 164 178, 158 172, 146 170 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
          />
          {/* Sole with tread lines */}
          <path
            d="M124 186 C 130 196, 156 196, 162 187 L 163 192 C 156 200, 128 200, 122 190 Z"
            fill="#1c1917"
          />
          {/* Toe cap crease */}
          <path d="M154 178 Q 150 184, 152 188" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* RUBBER HOSE LEFT ARM (AKIMBO / CONFIDENT ON HIP) */}
        <path
          d="M66 84 C 42 86, 38 108, 54 120"
          stroke="#1c1917"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left Gloved Hand on Hip */}
        <g>
          {/* Glove Cuff */}
          <ellipse cx="54" cy="120" rx="7" ry="3.5" fill="#ffffff" stroke="#1c1917" strokeWidth="2.5" />
          {/* Glove hand */}
          <path
            d="M48 122 C 44 126, 46 134, 52 136 C 58 138, 64 132, 62 124 C 60 120, 52 118, 48 122 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="2.5"
          />
          {/* 3 dart ridges on back of glove */}
          <path d="M52 126 L 54 132" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M55 125 L 57 131" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* RUBBER HOSE RIGHT ARM (HOLDING COFFEE POT / THUMBS UP) */}
        <path
          d="M134 84 C 158 84, 164 102, 150 118"
          stroke="#1c1917"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Gloved Hand with Thumbs Up & Dripping Coffee Droplet */}
        <g>
          {/* Glove Cuff */}
          <ellipse cx="148" cy="116" rx="7" ry="3.5" fill="#ffffff" stroke="#1c1917" strokeWidth="2.5" />
          {/* Fist with thumbs up */}
          <path
            d="M144 116 C 140 120, 142 130, 150 132 C 156 132, 160 124, 158 116 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="2.5"
          />
          {/* Thumb pointing up */}
          <path
            d="M146 116 C 144 110, 148 104, 153 106 C 156 108, 154 114, 150 118 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="2.2"
          />
          {/* Dart stitches on glove */}
          <path d="M149 122 L 153 126" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M152 121 L 155 125" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
          {/* Dripping coffee droplet from glove */}
          <path
            d="M154 136 C 154 136, 151 141, 151 144 C 151 146, 153 148, 155 148 C 157 148, 159 146, 159 144 C 159 141, 154 136, 154 136 Z"
            fill="#d97706"
            stroke="#1c1917"
            strokeWidth="1.5"
          />
        </g>

        {/* COFFEE CUP MONSTER HEAD & BODY (VINTAGE DINER MUG) */}
        {/* Mug Handle */}
        <path
          d="M136 68 C 154 68, 156 100, 134 104"
          stroke="#1c1917"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mug Outer Body */}
        <path
          d="M66 52 C 64 88, 70 128, 76 136 C 84 140, 116 140, 124 136 C 130 128, 136 88, 134 52 Z"
          fill="#ffffff"
          stroke="#1c1917"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Vintage Halftone Shading on Side of Mug */}
        <path
          d="M112 56 C 122 76, 126 108, 124 135 C 118 138, 108 139, 108 139 C 118 126, 120 84, 112 56 Z"
          fill="url(#vintage-screen-dots)"
          opacity="0.4"
        />

        {/* Top Rim of Mug with Hot Espresso Fill */}
        <ellipse cx="100" cy="52" rx="34" ry="10" fill="#3b2314" stroke="#1c1917" strokeWidth="4" />
        <ellipse cx="100" cy="52" rx="28" ry="7" fill="#78350f" />

        {/* 1930s CHEERFUL & FRIENDLY VINTAGE FACE */}
        {/* Left Eye & Arched Eyebrow */}
        <g>
          {/* Arched Friendly Eyebrow */}
          <path d="M76 60 Q 86 52, 96 58" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
          {/* Big Expressive Pie-Eye */}
          <ellipse cx="86" cy="78" rx="9.5" ry="14" fill="#1c1917" />
          {/* Pacman pie-slice cutout */}
          <polygon points="86,78 78,70 80,86" fill="#ffffff" />
          {/* Catchlight sparkle */}
          <circle cx="89" cy="74" r="2" fill="#ffffff" />
        </g>

        {/* Right Eye & Arched Eyebrow */}
        <g>
          {/* Arched Friendly Eyebrow */}
          <path d="M104 58 Q 114 52, 124 60" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
          {/* Big Expressive Pie-Eye */}
          <ellipse cx="114" cy="78" rx="9.5" ry="14" fill="#1c1917" />
          {/* Pacman pie-slice cutout */}
          <polygon points="114,78 106,70 108,86" fill="#ffffff" />
          {/* Catchlight sparkle */}
          <circle cx="117" cy="74" r="2" fill="#ffffff" />
        </g>

        {/* Cute Rosy Cheeks */}
        <ellipse cx="73" cy="92" rx="5" ry="3" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
        <ellipse cx="127" cy="92" rx="5" ry="3" fill="#fde68a" stroke="#d97706" strokeWidth="1" />

        {/* Cute Round Nose */}
        <ellipse cx="100" cy="87" rx="3.5" ry="2.5" fill="#1c1917" />

        {/* CHEERFUL & FRIENDLY 1930s OPEN CARTOON SMILE */}
        <g>
          {/* Mouth cavity - big happy open smile */}
          <path
            d="M76 96 C 80 124, 120 124, 124 96 C 112 102, 88 102, 76 96 Z"
            fill="#1c1917"
            stroke="#1c1917"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Friendly clean white upper teeth bar */}
          <path
            d="M80 98 C 90 104, 110 104, 120 98 L 118 103 C 108 107, 92 107, 82 103 Z"
            fill="#ffffff"
          />
          {/* Happy warm tongue inside */}
          <path
            d="M91 114 C 95 108, 105 108, 109 114 C 104 121, 96 121, 91 114 Z"
            fill="#fb7185"
            stroke="#1c1917"
            strokeWidth="1.5"
          />
          {/* Smile crease cheeks / dimples */}
          <path d="M73 94 Q 71 99, 76 102" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M127 94 Q 129 99, 124 102" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
