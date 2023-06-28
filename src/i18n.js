import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
// import frTranslation from "./locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
    },
    fallbackLng: "en", // Fallback language if a translation is not available
    interpolation: {
      escapeValue: false, // Allows using HTML tags in translation strings
    },
  });

export default i18n;
