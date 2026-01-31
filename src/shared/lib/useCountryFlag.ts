import { useMemo } from "react";
import { getFlagUrl } from "@/shared/lib/flag";

export const useCountryFlag = (countryCode?: string | null) => {
  const flag = useMemo(() => getFlagUrl(countryCode, 40), [countryCode]);
  return { flag };
};
