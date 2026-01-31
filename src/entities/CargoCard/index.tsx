import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCustomDate, formatRelativeDate } from "@/shared/lib/formatDate";
import {
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
  useGetBookmarksQuery,
} from "@/features/bookmark/bookmarkApi";
import { useGetRoutesQuery } from "@/features/routes/routesApi";
import { getCurrency } from "./lib/useCurrency";
import { useCountryFlag } from "@/shared/lib/useCountryFlag";
import { skipToken } from "@reduxjs/toolkit/query";

import { NotificationModal } from "@/shared/ui/Modal/NotificationModal";
import { ContactModal } from "@/shared/ui/Modal/ContactModal";

import type { Cargo } from "@/shared/types/cargo";

import {
  FaBell,
  FaBookmark,
  FaRegBell,
  FaRegBookmark,
  FaRegCalendarAlt,
  FaRegClock,
  FaTruck,
  FaWeightHanging,
} from "react-icons/fa";
import { FaLocationDot, FaMaximize } from "react-icons/fa6";

import styles from "./style.module.css";
import { LiaTruckLoadingSolid } from "react-icons/lia";
import { RiLoader2Line, RiVipCrownLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { useAppSelector } from "@/app/hooks";
import { getFlagUrl } from "@/shared/lib/flag";

export const CargoCard = ({ cargo }: { cargo: Cargo }) => {
  const { t } = useTranslation();
  const userId = useAppSelector((state) => state.user.userId);

  const [notificationModal, setNotificationModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingContact, setIsLoadingContact] = useState(false);

  const { data: bookmarksData } = useGetBookmarksQuery(userId ?? skipToken);
  const { data: routeData } = useGetRoutesQuery(userId ?? skipToken);

  const [createBookmark] = useCreateBookmarkMutation();
  const [deleteBookmark] = useDeleteBookmarkMutation();

  const formattedDate = formatCustomDate(cargo?.date_loading || "");
  const relativeCreatedAt = formatRelativeDate(cargo?.created_at || "");

  const { flag: originFlag } = useCountryFlag(cargo?.origin_country);
  const { flag: destinationFlag } = useCountryFlag(cargo?.destination_country);

  const ownerName = (() => {
    const raw = cargo?.full_name?.trim() ?? "";
    const cleaned = raw
      .replace(/\bNone\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || cargo?.username?.trim() || null;
  })();

  const isBookmarked = bookmarksData?.some(
    (bookmark) => bookmark?.cargo?.id === cargo?.id
  );
  const isNotified =
    routeData?.some(
      (route) => route.origin === cargo.origin && route.destination === cargo.destination
    ) ?? false;

  const handleBookmark = () => {
    if (!userId) return;
    if (isBookmarked) {
      const bookmark = bookmarksData?.find((b) => b.cargo.id === cargo.id);
      if (bookmark) {
        deleteBookmark(bookmark?.id);
      }
    } else {
      createBookmark({
        user: Number(userId),
        cargo: cargo?.id,
      });
    }
  };

  const handleShowContacts = async () => {
    if (isLoadingContact) return;

    setIsLoadingContact(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setIsModalOpen(true);
    } finally {
      setIsLoadingContact(false);
    }
  };

  const closeNotificationModal = () => {
    setNotificationModal(false);
  };

  return (
    <div
      className={`${styles["search-result"]} relative ${cargo?.is_premium ? "p-4 pt-5" : "p-4"} `}
    >
      {cargo?.is_premium && (
        <>
          <span
            className={
              "absolute -top-[14px] left-10 bg-[#fdc700] transform-[translateX(-50%)]  text-white flex items-center gap-x-1  justify-center rounded-2xl backdrop-blur-md p-[6px] text-lg  border border-white/20  shadow-sm hover:shadow-md active:translate-y-0.5 active:shadow-sm"
            }
          >
            <RiVipCrownLine />
          </span>
        </>
      )}

      <div className={styles["search-result__header"]}>
        <span className={styles["search-result__time"]}>
          <button
            onClick={handleBookmark}
            className="flex items-center justify-center rounded-2xl p-2 backdrop-blur-md bg-white/60  border border-white/20  shadow-sm hover:shadow-md active:translate-y-0.5 active:shadow-sm"
          >
            {isBookmarked ? (
              <FaBookmark fontSize={18} />
            ) : (
              <FaRegBookmark fontSize={18} />
            )}
          </button>
          <button
            onClick={() => setNotificationModal(true)}
            className={
              "flex items-center justify-center rounded-2xl p-2 backdrop-blur-md bg-white/60  border border-white/20  shadow-sm hover:shadow-md active:translate-y-0.5 active:shadow-sm"
            }
          >
            {isNotified ? <FaBell fontSize={18} /> : <FaRegBell fontSize={18} />}
          </button>
          <span className="flex items-center gap-x-1  justify-center rounded-2xl p-2 backdrop-blur-md bg-white/60  border border-white/20  shadow-sm hover:shadow-md active:translate-y-0.5 active:shadow-sm">
            <FaRegClock fontSize={18} />
            <span className="text-sm text-gray-500">{relativeCreatedAt}</span>
          </span>
        </span>
        <span className={styles["search-result__price"]}>
          {typeof cargo?.price === "number"
            ? `${cargo?.price.toLocaleString()} ${getCurrency(cargo.price)}`
            : t("fraxt")}
        </span>
      </div>

      <div className={styles["search-result__route"]}>
        <div className={styles["search-result__city"]}>
          {originFlag && (
            <img
              className="!w-5 h-5 sm:!h-5 sm:!w-10 object-cover  shadow-sm shrink-0"
              src={originFlag}
              alt="origin"
              onError={(e) => {
                // fallback in case restcountries/flag url is blocked
                const fallback = getFlagUrl(cargo?.origin_country, 40);
                if (fallback && e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                } else {
                  e.currentTarget.style.display = "none";
                }
              }}
            />
          )}
          <p className="text-xl line-clamp-1 !capitalize">{cargo?.origin}</p>
        </div>

        <span
          className="
      flex items-center justify-center
      p-1.5 rounded-xl
      backdrop-blur-md bg-white/60
      border border-white/20
      shadow-sm hover:shadow-md
      active:translate-y-0.5 transition-all
    "
        >
          <img
            src={`${import.meta.env.BASE_URL}road.png`}
            className="w-8 h-8"
            alt="road"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </span>

        <div className={styles["search-result__city"]}>
          {destinationFlag && (
            <img
              className="!w-5 h-5 sm:!h-5 sm:!w-10 object-cover shadow-sm shrink-0"
              src={destinationFlag}
              alt="destination"
              onError={(e) => {
                const fallback = getFlagUrl(cargo?.destination_country, 40);
                if (fallback && e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                } else {
                  e.currentTarget.style.display = "none";
                }
              }}
            />
          )}
          <p className="text-xl line-clamp-1 !capitalize">{cargo?.destination}</p>
        </div>
      </div>

      {cargo?.type && (
        <p
          className={`mt-3 text-sm text-gray-700 whitespace-pre-line ${
            cargo.is_premium ? "" : "line-clamp-2"
          }`}
        >
          {cargo.type}
        </p>
      )}

      <div className={"flex gap-3 flex-wrap"}>
        {cargo?.distance != null && (
          <div className="flex items-center gap-x-1 col-span-2">
            <span
              className="
         flex items-center justify-center
         p-1.5 rounded-xl
        backdrop-blur-md bg-white/60
        border border-white/20
        shadow-sm hover:shadow-md
        active:translate-y-0.5 transition-all
      "
            >
              <FaLocationDot className="h-4 w-4 text-gray-700" />
            </span>
            <span className="line-clamp-1 font-normal text-gray-800">
              {cargo.distance.toLocaleString()} км
            </span>
          </div>
        )}
        {cargo?.date_loading && (
          <div className="flex items-center gap-x-1">
            <span
              className="
         flex items-center justify-center
         p-1.5 rounded-xl
        backdrop-blur-md bg-white/60
        border border-white/20
        shadow-sm hover:shadow-md
        active:translate-y-0.5 transition-all
      "
            >
              <FaRegCalendarAlt className="h-4 w-4 text-gray-700" />
            </span>
            <span className="line-clamp-1 font-normal text-gray-800">
              {formattedDate}
            </span>
          </div>
        )}
        {cargo?.car_type && (
          <div className="flex items-center gap-x-1">
            <span
              className="
        flex items-center justify-center
        p-1.5 rounded-xl
        backdrop-blur-md bg-white/60
        border border-white/20
        shadow-sm hover:shadow-md
        active:translate-y-0.5 transition-all
      "
            >
              <FaTruck className="h-4 w-4 text-gray-700" />
            </span>
            <span className="line-clamp-1 font-normal text-gray-800">
              {cargo?.car_type?.length > 6
                ? cargo?.car_type?.slice(0, 6)
                : cargo?.car_type}
            </span>
          </div>
        )}
        {cargo?.weight && !Number.isNaN(Number(cargo.weight)) && (
          <div className="flex items-center gap-x-1">
            <span
              className="
        flex items-center justify-center
        p-1.5 rounded-xl
        backdrop-blur-md bg-white/60
        border border-white/20
        shadow-sm hover:shadow-md
        active:translate-y-0.5 transition-all
      "
            >
              <FaWeightHanging className="h-4 w-4 text-gray-700" />
            </span>
            <span className="font-normal text-gray-800">{Number(cargo.weight)}т</span>
          </div>
        )}
        {cargo?.volume && !Number.isNaN(Number(cargo.volume)) && (
          <div className="flex items-center gap-x-1">
            <span
              className="
        flex items-center justify-center
        p-1.5 rounded-xl
        backdrop-blur-md bg-white/60
        border border-white/20
        shadow-sm hover:shadow-md
        active:translate-y-0.5 transition-all
      "
            >
              <FaMaximize className="h-4 w-4 text-gray-700" />
            </span>
            <span className="font-normal text-gray-800">{Number(cargo.volume)} м³</span>
          </div>
        )}
      </div>

      <div className={"grid grid-cols-3 gap-3 items-center justify-between"}>
        <div>
          {cargo?.name && (
            <span className="inline-flex items-center gap-x-1  justify-center rounded-2xl p-2 backdrop-blur-md bg-white/60  border border-white/20  shadow-sm hover:shadow-md active:translate-y-0.5 active:shadow-sm">
              <LiaTruckLoadingSolid fontSize={18} />
              <span className="text-sm font-bold text-black text-nowrap">
                {cargo?.name?.length > 8 ? `${cargo.name.slice(0, 6)}...` : cargo?.name}
              </span>
            </span>
          )}
        </div>

        <div className="flex justify-center justify-self-stretch ">
          <button
            onClick={handleShowContacts}
            disabled={isLoadingContact}
            className={`
    relative flex items-center justify-center gap-2 
    px-4 py-2 text-sm sm:text-base font-medium
    rounded-2xl backdrop-blur-md
    transition-all duration-300

    ${
      isLoadingContact
        ? "bg-blue-400/50 text-white cursor-not-allowed shadow-sm"
        : "bg-[#041e90] text-white shadow-sm hover:shadow-md active:shadow-sm cursor-pointer"
    }
  `}
          >
            {isLoadingContact ? (
              <RiLoader2Line className="animate-spin h-4 w-4 text-white" />
            ) : null}

            <span>{t("showContacts")}</span>
          </button>
        </div>
        <div className={styles["search-result__company"]}>
          {ownerName && (
            <span className="inline-flex items-center gap-x-1  justify-center rounded-2xl p-2 backdrop-blur-md bg-white/60  border border-white/20  shadow-sm hover:shadow-md active:translate-y-0.5 active:shadow-sm">
              <FiUser fontSize={18} />
              <span className="text-sm font-semibold text-black text-nowrap">
                {ownerName.length > 14 ? `${ownerName.slice(0, 14)}...` : ownerName}
              </span>
            </span>
          )}
        </div>

        <ContactModal
          modal={isModalOpen}
          close={() => setIsModalOpen(false)}
          cargo={cargo}
        />
      </div>

      <NotificationModal
        modal={notificationModal}
        close={closeNotificationModal}
        origin={cargo?.origin}
        destination={cargo?.destination}
        isChecked={isNotified}
      />
    </div>
  );
};
