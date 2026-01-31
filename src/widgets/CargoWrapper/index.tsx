import { useEffect, useState } from "react";
import { SearchSettings } from "@/entities/SearchSettings";
import { useGetCargosQuery } from "@/features/cargo/cargoApi";
import { CargoCard } from "@/entities/CargoCard";
import { Pagination } from "@/shared/ui/Pagination";
import { RouteCard } from "@/entities/RouteCard";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { useGetTopRoutesQuery } from "@/features/routes/routesApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "@/app/hooks";

export const CargoWrapper = () => {
  const { t } = useAppTranslation();
  const filters = useAppSelector((state) => state.filters);
  const [currentPage, setCurrentPage] = useState(0);
  const viewMode = sessionStorage.getItem("viewMode") ?? "popular";

  const cargosArgs =
    viewMode === "search" ? { ...filters, page: currentPage + 1 } : skipToken;
  const { data, isLoading, isFetching, error, refetch } = useGetCargosQuery(cargosArgs);
  const {
    data: topRoutes,
    isLoading: topRoutesLoading,
    error: topRoutesError,
  } = useGetTopRoutesQuery(undefined, { skip: viewMode === "search" });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  const pageSize = 5;

  return (
    <section className="py-[15px] mx-auto" id="pagination_top">
      <div>
        {viewMode === "popular" ? (
          <h2 className="max-w-[300px] mx-auto font-semibold text-2xl text-[#595959] text-center">
            {t("popular_directions")}
          </h2>
        ) : (
          viewMode === "search" && (
            <SearchSettings
              resultCount={data?.count}
              isLoading={isLoading}
              isFetching={isFetching}
              onRefetch={refetch}
            />
          )
        )}
        <div>
          {isLoading ? (
            <div className="text-center">{t("loading")}</div>
          ) : error ? (
            <div className="text-red-500 text-center">{JSON.stringify(error)}</div>
          ) : (
            <div className="grid grid-cols-1">
              {viewMode === "search" ? (
                (data?.results?.length ?? 0) > 0 ? (
                  <div>
                    {data?.results?.map((cargo) => (
                      <CargoCard key={cargo.id} cargo={cargo} />
                    ))}
                    <Pagination
                      pageCount={Math.ceil((data?.count || 0) / pageSize)}
                      onPageChange={handlePageChange}
                      forcePage={currentPage}
                    />
                  </div>
                ) : (
                  <div className="col-span-full text-center">{t("noCargo")}</div>
                )
              ) : topRoutesLoading ? (
                <div className="text-center">{t("loading")}</div>
              ) : topRoutesError ? (
                <div className="text-red-500 text-center">
                  {JSON.stringify(topRoutesError)}
                </div>
              ) : (topRoutes?.length ?? 0) > 0 ? (
                topRoutes?.map((route, index) => (
                  <RouteCard
                    key={index}
                    origin={route.origin}
                    destination={route.destination}
                    total={route.total}
                  />
                ))
              ) : (
                <div className="col-span-full text-center">{t("noCargo")}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
