import { format, formatDistanceToNow, isValid, type Locale, parse } from "date-fns";
import { ru as ruLocale, uz as uzLocale, uzCyrl as uzCyrlLocale } from "date-fns/locale";
import i18n from "@/shared/config/i18n";

const customRu: Locale = {
  ...ruLocale,
  formatDistance: (token, count, options) => {
    const result = ruLocale.formatDistance!(token, count, options);
    return result.replace("около ", "");
  },
};

const customUz: Locale = {
  ...uzLocale,
  formatDistance: (token, count, options) => {
    const result = uzLocale.formatDistance!(token, count, options);
    return result.replace("tahminan ", "");
  },
};

const customUzCyrl: Locale = {
  ...uzCyrlLocale,
  formatDistance: (token, count, options) => {
    const result = uzCyrlLocale.formatDistance!(token, count, options);
    return result.replace("тахминан ", "");
  },
};

const localesMap: Record<string, Locale> = {
  ru: customRu,
  "uz-Latn": customUz,
  "uz-Cyrl": customUzCyrl,
};

function getLocale(): Locale {
  return localesMap[i18n.language] || customRu;
}

export function formatCustomDate(dateStr: string): string {
  if (!dateStr) return "";
  const parsed = parse(dateStr, "dd/MM/yyyy HH:mm", new Date());
  return isValid(parsed) ? format(parsed, "dd.MM - HH:mm", { locale: getLocale() }) : "";
}

export function formatRelativeDate(dateStr: string): string {
  let parsed = parse(dateStr, "dd/MM/yyyy HH:mm", new Date());
  if (!isValid(parsed)) parsed = new Date(dateStr);

  return isValid(parsed)
    ? formatDistanceToNow(parsed, { addSuffix: true, locale: getLocale() })
    : i18n.t("unknown");
}
