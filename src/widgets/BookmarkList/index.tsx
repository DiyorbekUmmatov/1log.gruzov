import { useGetBookmarksQuery } from "@/features/bookmark/bookmarkApi";
import { CargoCard } from "@/entities/CargoCard";
import { BookmarkEmpty } from "@/entities/BookmarkEmpty";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { useAppSelector } from "@/app/hooks";

export const BookmarkList = () => {
  const userId = useAppSelector((state) => state.user.userId);
  const { data, isLoading, error } = useGetBookmarksQuery(userId ?? skipToken);
  const { t } = useAppTranslation();

  return (
    <div className="mt-7">
      {isLoading ? (
        <div className="text-center">{t("loading")}</div>
      ) : error ? (
        <div className="text-red-500 text-center">{JSON.stringify(error)}</div>
      ) : (
        <div className="grid grid-cols-1">
          {(data?.length ?? 0) > 0 ? (
            <div>
              {data
                ?.slice()
                .reverse()
                .map((bookmark) => (
                  <CargoCard key={bookmark.id} cargo={bookmark?.cargo} />
                ))}
            </div>
          ) : (
            <BookmarkEmpty />
          )}
        </div>
      )}
    </div>
  );
};
