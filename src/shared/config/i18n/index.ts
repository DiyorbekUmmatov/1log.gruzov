import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { setLang } from "@/shared/lib/setLang";

// Locales
import ru from "./locales/ru/translation.json";
import uzCyrl from "./locales/uz-Cyrl/translation.json";
import uzLatn from "./locales/uz-Latn/translation.json";

i18n.use(initReactI18next).init({
  lng: setLang(),
  fallbackLng: "ru",
  debug: process.env.NODE_ENV === "development",
  interpolation: { escapeValue: false },
  resources: {
    ru: { translation: ru },
    "uz-Cyrl": { translation: uzCyrl },
    "uz-Latn": { translation: uzLatn },
  },
});

export default i18n;
