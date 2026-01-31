import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { FaGlobe } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import { LangDropdown } from "./ui/LangDropdown";
import { MenuModal } from "./ui/MenuModal";
import styles from "./style.module.css";

export const Header = () => {
  const [openLangDropdown, setOpenLangDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const closeDropdown = () => setOpenLangDropdown(false);
  const { i18n } = useAppTranslation();

  return (
    <header className={styles.headerSection}>
      <div className={`container ${styles.headerCont}`}>
        <Link
          to="/"
          className={`${styles.logo} transition-all duration-200 hover:scale-105 active:scale-95`}
        >
          1LOG
        </Link>

        <div className={`${styles.headerMenu} h-full`}>
          <a
            href="https://t.me/one_log_bot_admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            title="Texnik qo'llab-quvvatlash"
          >
            <MdSupportAgent className="text-3xl text-[#fff]" />
          </a>

          <div className="relative h-full">
            <div
              onClick={() => setOpenLangDropdown(!openLangDropdown)}
              onMouseLeave={closeDropdown}
              className={`${styles.setLang} h-full flex items-center`}
            >
              <div className={styles.headerSelect}>
                <FaGlobe fontSize={20} />
                <span className="uppercase">
                  {i18n.language === "uz-Cyrl" ? "УЗ" : i18n.language.slice(0, 2)}
                </span>
              </div>
              <LangDropdown isOpen={openLangDropdown} onClose={closeDropdown} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpenMenu(true)}
            className="text-2xl"
            aria-label="Menu"
          >
            <RiMenu2Fill />
          </button>
        </div>
      </div>

      <MenuModal isOpen={openMenu} onClose={() => setOpenMenu(false)} />
    </header>
  );
};
