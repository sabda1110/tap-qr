import { Languages } from "lucide-react";

import { isLanguage, languages, useI18n } from "../../i18n";

type LanguageSwitcherProps = {
  label: string;
};

export function LanguageSwitcher({ label }: LanguageSwitcherProps) {
  const { language, setLanguage } = useI18n();

  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#282828]">
      <Languages aria-hidden="true" className="size-3.5" />
      <span className="sr-only">{label}</span>
      <select
        className="cursor-pointer appearance-none bg-transparent pr-1 uppercase outline-none"
        value={language}
        aria-label={label}
        onChange={(event) => {
          const nextLanguage = event.target.value;
          if (isLanguage(nextLanguage)) setLanguage(nextLanguage);
        }}
      >
        {languages.map(({ code }) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </label>
  );
}
