import { BsBookmarkX } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const BookmarkEmpty = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center">
        <div className="p-6 rounded-full bg-white/40 backdrop-blur-lg shadow-md mb-6">
          <BsBookmarkX className="text-6xl text-[#7a869a]" />
        </div>

        <h2 className="text-2xl font-semibold text-[#1c1c1e] mb-2">{t("empty.title")}</h2>

        <p className="text-[#3a3a3c] text-lg mb-8">{t("empty.subtitle")}</p>

        <Link
          to="/"
          className="
            px-6 py-3
            rounded-full
            bg-white/60
            text-[#1c1c1e]
            font-medium
            shadow-md
            backdrop-blur-lg
            transition-all duration-200
            hover:bg-white/80
            hover:shadow-lg
            hover:-translate-y-0.5
          "
        >
          {t("page_block.link")}
        </Link>
      </div>
    </div>
  );
};
