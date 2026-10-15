export function KrakenTentaclesOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top-Left Kraken Tentacle with Suction Cups */}
      <svg
        className="absolute -top-6 -left-6 h-48 w-44 drop-shadow-lg"
        fill="none"
        viewBox="0 0 160 170"
      >
        {/* Main tentacle body */}
        <path
          d="M-10 -10 C 20 40, 45 90, 85 95 C 120 100, 135 70, 115 50 C 95 30, 75 55, 85 70 C 92 80, 105 75, 100 68"
          fill="#84e034"
          stroke="#090d16"
          strokeWidth="6"
        />
        {/* Suction Cups along the curve */}
        <circle cx="28" cy="48" r="9" fill="#090d16" />
        <circle cx="28" cy="48" r="6" fill="#84e034" />

        <circle cx="50" cy="74" r="8.5" fill="#090d16" />
        <circle cx="50" cy="74" r="5.5" fill="#84e034" />

        <circle cx="78" cy="88" r="8" fill="#090d16" />
        <circle cx="78" cy="88" r="5" fill="#84e034" />

        <circle cx="106" cy="85" r="7" fill="#090d16" />
        <circle cx="106" cy="85" r="4.5" fill="#84e034" />

        <circle cx="120" cy="65" r="6" fill="#090d16" />
        <circle cx="120" cy="65" r="3.5" fill="#84e034" />

        <circle cx="104" cy="50" r="5" fill="#090d16" />
        <circle cx="104" cy="50" r="3" fill="#84e034" />
      </svg>

      {/* Bottom-Right Kraken Tentacle rising upwards */}
      <svg
        className="absolute -bottom-8 -right-6 h-56 w-52 drop-shadow-xl"
        fill="none"
        viewBox="0 0 180 190"
      >
        {/* Main tentacle body rising & curling */}
        <path
          d="M 190 200 C 140 160, 110 110, 80 85 C 50 60, 40 90, 60 115 C 75 135, 105 125, 95 105 C 88 90, 70 95, 75 105"
          fill="#84e034"
          stroke="#090d16"
          strokeWidth="6"
        />
        {/* Suction Cups along the curve */}
        <circle cx="140" cy="155" r="11" fill="#090d16" />
        <circle cx="140" cy="155" r="7.5" fill="#84e034" />

        <circle cx="112" cy="122" r="10" fill="#090d16" />
        <circle cx="112" cy="122" r="6.5" fill="#84e034" />

        <circle cx="86" cy="98" r="9" fill="#090d16" />
        <circle cx="86" cy="98" r="5.5" fill="#84e034" />

        <circle cx="62" cy="88" r="7.5" fill="#090d16" />
        <circle cx="62" cy="88" r="4.5" fill="#84e034" />

        <circle cx="56" cy="110" r="6" fill="#090d16" />
        <circle cx="56" cy="110" r="3.5" fill="#84e034" />

        <circle cx="78" cy="126" r="5" fill="#090d16" />
        <circle cx="78" cy="126" r="3" fill="#84e034" />
      </svg>

      {/* Floating subtle suction cup bubbles in background */}
      <div className="absolute top-20 right-8 size-4 rounded-full border-2 border-[#84e034]/40" />
      <div className="absolute top-28 right-5 size-2 rounded-full bg-[#84e034]/40" />
      <div className="absolute bottom-24 left-6 size-5 rounded-full border-2 border-[#84e034]/40" />
      <div className="absolute bottom-32 left-10 size-2.5 rounded-full bg-[#84e034]/40" />
    </div>
  );
}

export function OrangeMonsterClawsOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top-Left Horn */}
      <svg className="absolute -top-3 left-6 h-10 w-12" viewBox="0 0 50 40">
        <path d="M5 40 Q 15 5, 45 10 Q 30 25, 25 40 Z" fill="#f97316" stroke="#1c1917" strokeWidth="4" />
      </svg>
      {/* Top-Right Horn */}
      <svg className="absolute -top-3 right-6 h-10 w-12" viewBox="0 0 50 40">
        <path d="M45 40 Q 35 5, 5 10 Q 20 25, 25 40 Z" fill="#f97316" stroke="#1c1917" strokeWidth="4" />
      </svg>

      {/* Left Monster Paw creeping over edge */}
      <svg className="absolute top-1/2 -left-3 h-24 w-12 -translate-y-1/2" viewBox="0 0 45 90">
        <path
          d="M -5 15 C 25 15, 35 25, 35 45 C 35 65, 25 75, -5 75"
          fill="#f97316"
          stroke="#1c1917"
          strokeWidth="4"
        />
        {/* Claws */}
        <path d="M35 28 L43 32 L35 36" fill="#ffffff" stroke="#1c1917" strokeWidth="3" />
        <path d="M36 41 L45 45 L36 49" fill="#ffffff" stroke="#1c1917" strokeWidth="3" />
        <path d="M35 54 L43 58 L35 62" fill="#ffffff" stroke="#1c1917" strokeWidth="3" />
      </svg>

      {/* Right Monster Paw creeping over edge */}
      <svg className="absolute top-1/2 -right-3 h-24 w-12 -translate-y-1/2" viewBox="0 0 45 90">
        <path
          d="M 50 15 C 20 15, 10 25, 10 45 C 10 65, 20 75, 50 75"
          fill="#f97316"
          stroke="#1c1917"
          strokeWidth="4"
        />
        {/* Claws */}
        <path d="M10 28 L2 32 L10 36" fill="#ffffff" stroke="#1c1917" strokeWidth="3" />
        <path d="M9 41 L0 45 L9 49" fill="#ffffff" stroke="#1c1917" strokeWidth="3" />
        <path d="M10 54 L2 58 L10 62" fill="#ffffff" stroke="#1c1917" strokeWidth="3" />
      </svg>

      {/* Bottom Curled Tail */}
      <svg className="absolute -bottom-5 right-8 h-16 w-20" viewBox="0 0 80 60">
        <path
          d="M 65 60 C 60 30, 40 10, 20 15 C 5 20, 10 40, 25 35 C 35 30, 30 20, 25 22"
          fill="#f97316"
          stroke="#1c1917"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

export function CoffeeMonsterPawsOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top Furry Ears */}
      <svg className="absolute -top-3 left-8 h-10 w-12" viewBox="0 0 50 40">
        <path d="M10 40 C 5 15, 25 5, 40 40 Z" fill="#6f4e37" stroke="#3d2314" strokeWidth="3.5" />
        <path d="M18 38 C 15 22, 28 16, 34 38 Z" fill="#dfb182" />
      </svg>
      <svg className="absolute -top-3 right-8 h-10 w-12" viewBox="0 0 50 40">
        <path d="M40 40 C 45 15, 25 5, 10 40 Z" fill="#6f4e37" stroke="#3d2314" strokeWidth="3.5" />
        <path d="M32 38 C 35 22, 22 16, 16 38 Z" fill="#dfb182" />
      </svg>

      {/* Left Fluffy Monster Paw with Coffee Bean Motif */}
      <svg className="absolute top-[45%] -left-3 h-22 w-13" viewBox="0 0 50 80">
        <path
          d="M-5 15 C 25 10, 35 25, 35 40 C 35 55, 25 70, -5 65 Z"
          fill="#6f4e37"
          stroke="#3d2314"
          strokeWidth="3.5"
        />
        {/* Soft Paw pads */}
        <circle cx="24" cy="40" r="5" fill="#dfb182" />
        <circle cx="16" cy="28" r="3" fill="#dfb182" />
        <circle cx="28" cy="30" r="3" fill="#dfb182" />
        <circle cx="28" cy="50" r="3" fill="#dfb182" />
      </svg>

      {/* Right Fluffy Monster Paw */}
      <svg className="absolute top-[45%] -right-3 h-22 w-13" viewBox="0 0 50 80">
        <path
          d="M55 15 C 25 10, 15 25, 15 40 C 15 55, 25 70, 55 65 Z"
          fill="#6f4e37"
          stroke="#3d2314"
          strokeWidth="3.5"
        />
        <circle cx="26" cy="40" r="5" fill="#dfb182" />
        <circle cx="34" cy="28" r="3" fill="#dfb182" />
        <circle cx="22" cy="30" r="3" fill="#dfb182" />
        <circle cx="22" cy="50" r="3" fill="#dfb182" />
      </svg>

      {/* Coffee Splash Swirl Bottom-Left */}
      <svg className="absolute -bottom-4 -left-4 h-24 w-24 opacity-25" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" fill="none" stroke="#5c3a21" strokeWidth="8" strokeDasharray="18 10 25 8" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="#5c3a21" strokeWidth="4" strokeDasharray="10 12" />
      </svg>
    </div>
  );
}

export function BarberMonsterTentaclesOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top Barber Pole Diagonal Striped Border Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-3 w-full"
        style={{
          background:
            "repeating-linear-gradient(45deg, #d9383a, #d9383a 12px, #ffffff 12px, #ffffff 20px, #1e3a8a 20px, #1e3a8a 32px, #ffffff 32px, #ffffff 40px)",
        }}
      />
      {/* Bottom Barber Pole Border Accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3 w-full"
        style={{
          background:
            "repeating-linear-gradient(45deg, #1e3a8a, #1e3a8a 12px, #ffffff 12px, #ffffff 20px, #d9383a 20px, #d9383a 32px, #ffffff 32px, #ffffff 40px)",
        }}
      />

      {/* Top-Right Monster Mustache Whiskers Curled Tentacle */}
      <svg className="absolute top-4 -right-4 h-28 w-28 drop-shadow-md" viewBox="0 0 100 100">
        <path
          d="M 105 15 C 80 15, 60 30, 50 50 C 40 70, 60 85, 75 70 C 85 60, 75 45, 65 55"
          fill="#0f172a"
          stroke="#b48c36"
          strokeWidth="3.5"
        />
        {/* Decorative gold dots */}
        <circle cx="68" cy="30" r="3.5" fill="#b48c36" />
        <circle cx="55" cy="50" r="3" fill="#b48c36" />
        <circle cx="65" cy="70" r="2.5" fill="#b48c36" />
      </svg>

      {/* Bottom-Left Monster Tentacle Whisker */}
      <svg className="absolute bottom-4 -left-4 h-28 w-28 drop-shadow-md" viewBox="0 0 100 100">
        <path
          d="M -5 85 C 20 85, 40 70, 50 50 C 60 30, 40 15, 25 30 C 15 40, 25 55, 35 45"
          fill="#0f172a"
          stroke="#b48c36"
          strokeWidth="3.5"
        />
        <circle cx="32" cy="70" r="3.5" fill="#b48c36" />
        <circle cx="45" cy="50" r="3" fill="#b48c36" />
        <circle cx="35" cy="30" r="2.5" fill="#b48c36" />
      </svg>
    </div>
  );
}
