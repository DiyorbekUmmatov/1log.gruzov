import { BookmarkList } from "@/widgets/BookmarkList";
import { useTranslation } from "react-i18next";

export const Bookmarks = () => {
  const { t } = useTranslation();

  return (
    <section>
      <div className="py-[15px]">
        <h2 className="font-bold text-3xl text-[#2c2c2cde] text-center mb-2.5">
          {t("nav.bookmarks")}
        </h2>
        <BookmarkList />
      </div>
    </section>
  );
};
