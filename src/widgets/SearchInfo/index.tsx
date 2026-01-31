import { useTranslation } from "react-i18next";
import { useGetStatisticsQuery } from "@/features/statistics/statisticsApi";
import { StatisticsCard } from "@/entities/StatisticsCard";
import { FaUsers } from "react-icons/fa";
import { BsFillBoxFill } from "react-icons/bs";
import { FaUserCheck, FaUserTie } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";

export const SearchInfo = () => {
  const { t } = useTranslation();
  const { data: statistics } = useGetStatisticsQuery();

  return (
    <section className="py-[15px] mx-auto">
      <div>
        <h2 className="flex flex-col gap-y-2.5 font-bold text-3xl">
          <span className="text-[#041e90]">{t("info_title_top.line1")}</span>
          <span className="text-[#5a78ff7a]">{t("info_title_top.line2")}</span>
        </h2>
        <p className="font-medium text-[#041e90] mt-2.5">{t("info_description")}</p>
        <div className="my-[15px] grid grid-cols-1 sm:grid-cols-3 gap-[15px]">
          <StatisticsCard
            value={statistics?.users}
            text={t("statistics.users")}
            icon={<FaUsers fontSize={35} />}
          />
          <StatisticsCard
            value={statistics?.cargos}
            text={t("statistics.cargos")}
            icon={<BsFillBoxFill fontSize={35} />}
          />
          <StatisticsCard
            value={statistics?.active_users}
            text={t("statistics.active_users")}
            icon={<FaUserCheck fontSize={35} />}
          />
          <StatisticsCard
            value={statistics?.logists}
            text={t("statistics.logists")}
            icon={<FaUserTie fontSize={35} />}
          />
          <StatisticsCard
            value={statistics?.drivers}
            text={t("statistics.drivers")}
            icon={<MdLocalShipping fontSize={35} />}
          />
          <StatisticsCard
            value={statistics?.premium_cargos}
            text={t("statistics.premium_cargos")}
            icon={<RiVipCrownFill fontSize={35} />}
          />
        </div>
        <h2 className="flex flex-col gap-y-2.5 font-bold text-3xl">
          <span className="text-[#041e90]">{t("bottom_title.line1")}</span>
          <span className="text-[#5a78ff7a]">{t("bottom_title.line2")}</span>
        </h2>
      </div>
    </section>
  );
};
