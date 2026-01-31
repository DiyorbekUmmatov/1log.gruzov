import React from "react";
import { useTranslation } from "react-i18next";
import { useCountryFlag } from "@/shared/lib/useCountryFlag";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LangDropdown: React.FC<DropdownProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const { flag: uzFlag } = useCountryFlag("UZ");
  const { flag: ruFlag } = useCountryFlag("RU");

  const handleLanguageChange = (lng: string) => {
    let code = "0";
    if (lng === "uz-Latn") code = "1";
    if (lng === "uz-Cyrl") code = "2";

    localStorage.setItem("lang", code);
    i18n.changeLanguage(lng);
    onClose();
  };

  return (
    <div
      onMouseLeave={onClose}
      className={`absolute top-[70%] left-1/2 -translate-x-1/2 overflow-hidden ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      } transition-all duration-300 w-16 bg-white border border-gray-500 rounded p-1 shadow-xl`}
    >
      <button
        onClick={() => handleLanguageChange("ru")}
        className="flex items-center gap-x-2 py-0.5 w-full"
      >
        <div className="w-2/5">
          {ruFlag && <img src={ruFlag} alt="Flag RU" className="w-full object-cover" />}
        </div>
        <span
          className={`font-semibold text-sm ${
            i18n.language === "ru" ? "text-[#041e90]" : "text-gray-500"
          }`}
        >
          RU
        </span>
      </button>
      <button
        onClick={() => handleLanguageChange("uz-Latn")}
        className="flex items-center gap-x-2 py-0.5 w-full"
      >
        <div className="w-2/5">
          {uzFlag && <img src={uzFlag} alt="Flag UZ" className="w-full object-cover" />}
        </div>
        <span
          className={`font-semibold text-sm ${
            i18n.language === "uz-Latn" ? "text-[#041e90]" : "text-gray-500"
          }`}
        >
          UZ
        </span>
      </button>
      <button
        onClick={() => handleLanguageChange("uz-Cyrl")}
        className="flex items-center gap-x-2 py-0.5 w-full"
      >
        <div className="w-2/5">
          {uzFlag && <img src={uzFlag} alt="Flag UZ" className="w-full object-cover" />}
        </div>
        <span
          className={`font-semibold text-sm ${
            i18n.language === "uz-Cyrl" ? "text-[#041e90]" : "text-gray-500"
          }`}
        >
          УЗ
        </span>
      </button>
    </div>
  );
};
