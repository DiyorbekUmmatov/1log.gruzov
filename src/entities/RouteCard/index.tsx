import styles from "./style.module.css";
import { HiArrowSmallRight } from "react-icons/hi2";
import { setFilters } from "@/features/filters/model/filterSlice";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

type RouteData = {
  origin: string;
  destination: string;
  total: number;
};

export const RouteCard: React.FC<RouteData> = ({ origin, destination, total }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { t } = useTranslation();

  const onClick = () => {
    dispatch(
      setFilters({
        ...filters,
        origin,
        destination,
      })
    );
    sessionStorage.setItem("viewMode", "search");
  };

  return (
    <div onClick={onClick} className={styles.topSearchCard}>
      <div className={`${styles.topCardTitle} grid grid-cols-3 justify-between`}>
        <h3>{origin}</h3>
        <div className="flex justify-center items-center">
          <HiArrowSmallRight className="text-2xl text-gray-300 text-center" />
        </div>
        <h3 className="text-end">{destination}</h3>
      </div>
      <div className={styles.topCardDesc}>
        <span>{t("total_ads", { total })}</span>
      </div>
    </div>
  );
};
