import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SearchTab = () => {
  const [activeTab, setActiveTab] = useState("cargo");
  const { t } = useTranslation("");

  return (
    <div className="w-3/5 px-1 py-1/2 mx-auto mb-6 bg-[#ccc] rounded-4xl relative font-medium">
      <button
        onClick={() => setActiveTab("cargo")}
        className="w-1/2 p-1.5 sm:p-3 text-base cursor-pointer relative z-[1]"
      >
        {t("tab.cargo")}
      </button>
      <div
        className={`w-1/2 h-[calc(100%-8px)] p-3 bg-white rounded-4xl absolute top-1 text-center transition-transform duration-300`}
        style={{
          transform:
            activeTab === "cargo" ? "translateX(0%)" : "translateX(calc(100% - 8px))",
        }}
      ></div>

      <button
        onClick={() => setActiveTab("transport")}
        className="w-1/2 p-1.5 sm:p-3 text-base cursor-pointer relative z-[1]"
      >
        {t("tab.transport")}
      </button>
    </div>
  );
};

//
// import { useTranslation } from "react-i18next";
//
// export const SearchTab = () => {
//   const { t } = useTranslation("");
//
//   return (
//     <div className="w-3/5 p-1 mx-auto mb-6 bg-[#ccc] rounded-4xl font-medium">
//       <button className="w-full p-1.5 sm:p-3 text-sm sm:text-base cursor-pointer bg-white rounded-4xl">
//         {t("tab.cargo")}
//       </button>
//     </div>
//   );
// };
