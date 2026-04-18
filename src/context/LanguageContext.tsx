import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem("language");
  return stored === "ku" || stored === "en" ? stored : "en";
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ku" : "en");
  };

  const direction: "ltr" | "rtl" = language === "ku" ? "rtl" : "ltr";

  const t = (key: TranslationKey): string => {
    return translations[language][key] ?? translations.en[key] ?? key;
  };

  const value = useMemo(
    () => ({
      language,
      direction,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, direction],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
