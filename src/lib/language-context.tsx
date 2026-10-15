"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TRANSLATIONS, type Translations } from "@/lib/i18n";

export type Lang = "en" | "ar";

type LanguageContextValue = {
  lang: Lang;
  isAr: boolean;
  t: Translations;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "bc-lang";

/**
 * Client-side language switcher.
 * Flips <html lang/dir> so the whole document mirrors in RTL,
 * and persists the choice in localStorage.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore the saved preference once, after hydration.
  // (Must run post-paint: reading it during render would break SSR hydration.)
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ar" || saved === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot hydration of a persisted user preference
      setLangState(saved);
    }
  }, []);

  // Keep the document element in sync with the active language.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === "en" ? "ar" : "en")),
    []
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      isAr: lang === "ar",
      t: TRANSLATIONS[lang],
      setLang,
      toggle,
    }),
    [lang, setLang, toggle]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
