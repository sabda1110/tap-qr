import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";

import { en } from "./locales/en";
import { id } from "./locales/id";

export const languages = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "en", label: "English" },
] as const;

export type Language = (typeof languages)[number]["code"];
export type Messages = typeof id;
export const defaultLanguage: Language = "id";
const messages = { id, en };

export function isLanguage(value: unknown): value is Language {
  return languages.some((language) => language.code === value);
}

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  messages: typeof id;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  language,
  onLanguageChange,
}: {
  children: ReactNode;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: onLanguageChange,
        messages: messages[language],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
