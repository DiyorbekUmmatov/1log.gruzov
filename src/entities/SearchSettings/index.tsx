import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaRotate } from "react-icons/fa6";
import { RiLoader2Line, RiVipCrownFill, RiVipCrownLine } from "react-icons/ri";
import { setIsPremium } from "@/features/filters/model/filterSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

interface SettingsProps {
  resultCount?: number;
  isLoading: boolean;
  isFetching: boolean;
  onRefetch: () => void;
}

export const SearchSettings: React.FC<SettingsProps> = ({
  resultCount,
  isLoading,
  isFetching,
  onRefetch,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isPremium = useAppSelector((state) => Boolean(state.filters.is_premium));

  const isBusy = isLoading || isFetching;
  const premiumIcon = useMemo(
    () =>
      isPremium ? (
        <RiVipCrownFill className="w-5 h-5" />
      ) : (
        <RiVipCrownLine className="w-5 h-5" />
      ),
    [isPremium]
  );

  return (
    <div className="container space-y-3">
      <div className="my-5 w-full flex justify-between items-center">
        <div className="flex items-center w-full justify-between">
          <p>{t("search_head.isPremium")}</p>

          <button
            onClick={() => dispatch(setIsPremium(!isPremium))}
            disabled={isBusy}
            className={`
              inline-flex items-center gap-x-2 px-2 py-2 rounded-[28px] font-medium
              transition-all duration-300
              ${
                isBusy
                  ? "bg-gray-400 cursor-not-allowed opacity-50"
                  : "bg-[#041e90] text-white cursor-pointer"
              }
            `}
          >
            {isBusy ? (
              <RiLoader2Line className="animate-spin h-4 w-4 text-white" />
            ) : (
              premiumIcon
            )}
          </button>
        </div>
      </div>

      <div className="my-5 w-full flex justify-between items-center">
        <p
          dangerouslySetInnerHTML={{
            __html: t("found_cargos", { count: resultCount }),
          }}
        />

        <button
          onClick={onRefetch}
          disabled={isBusy}
          className={`
            flex items-center mt-2 gap-x-2 px-4 py-1.5 rounded-[28px] font-medium
            transition-all duration-300
            ${
              isBusy
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-[#041e90] text-white cursor-pointer"
            }
          `}
        >
          {isBusy ? (
            <RiLoader2Line className="animate-spin h-4 w-4 text-white" />
          ) : (
            <FaRotate />
          )}
          <span>{t("search_head.update")}</span>
        </button>
      </div>
    </div>
  );
};
