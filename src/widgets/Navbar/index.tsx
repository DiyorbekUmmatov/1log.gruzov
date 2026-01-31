import { NavLink, useLocation } from "react-router-dom";
import { useGetBookmarksQuery } from "@/features/bookmark/bookmarkApi";
import { useGetNotificationsQuery } from "@/features/notification/notificationApi";
import { FaBell, FaBookmark, FaSearch } from "react-icons/fa";
import { FaCirclePlus, FaFileLines } from "react-icons/fa6";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { useAppSelector } from "@/app/hooks";

export const Navbar = () => {
  const location = useLocation();
  const userId = useAppSelector((state) => state.user.userId);
  const { data: bookmarks } = useGetBookmarksQuery(userId ?? skipToken);
  const { data: notifications } = useGetNotificationsQuery(userId ?? skipToken);
  const { t } = useAppTranslation();

  const navItems = [
    { to: "/", label: t("nav.search"), icon: <FaSearch fontSize={28} /> },
    {
      to: "/bookmarks",
      label: t("nav.bookmarks"),
      icon: <FaBookmark fontSize={28} />,
      counter: bookmarks?.length,
    },
    { to: "/add", label: t("nav.add"), icon: <FaCirclePlus fontSize={28} /> },
    {
      to: "/notifications",
      label: t("nav.notifications"),
      icon: <FaBell fontSize={28} />,
      counter: notifications?.length,
    },
    {
      to: "/applications",
      label: t("nav.applications"),
      icon: <FaFileLines fontSize={28} />,
    },
  ];

  return (
    <div className="main-container">
      <nav className="fixed w-[95%] bottom-4 left-[2.5%] right-[2.5%] bg-[rgba(151,150,150,0.682)] backdrop-blur-xs rounded-[28px] pt-5 pb-4 flex justify-center items-center">
        <div className="container w-full grid grid-cols-5 gap-1 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                                flex flex-col items-center gap-1 relative
                                transition-all duration-200 text-black text-[11px]
                                ${isActive ? "scale-105 text-white" : ""}
                                `
              }
            >
              {item.icon}

              {typeof item.counter === "number" && item.counter > 0 && (
                <span className="px-2.5 py-1 text-xs rounded-full absolute -top-4 right-1 bg-red-600">
                  {item.counter}
                </span>
              )}

              <span>{item.label}</span>

              <div
                className={`absolute translate-[-50%] -bottom-2 left-1/2 right-1/2  
                                    w-1 h-1 rounded-full mt-1 transition-all duration-200 
                                    ${location.pathname === item.to ? "bg-white" : "bg-transparent"}
                                `}
              />
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
