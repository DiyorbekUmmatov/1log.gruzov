import { useTranslation } from "react-i18next";

export function useAppTranslation(ns?: string) {
  return useTranslation(ns);
}
