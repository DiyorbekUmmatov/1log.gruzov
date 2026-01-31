import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setLang } from "@/shared/lib/setLang";
import styles from "./style.module.css";
import { setUserId } from "@/features/user/model/userSlice";
import { STORAGE_KEYS } from "@/shared/config/storageKeys";
import { useAppDispatch } from "@/app/hooks";

export const Welcome = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    sessionStorage.setItem("viewMode", "popular");

    if (params.id && params.lang) {
      localStorage.setItem(STORAGE_KEYS.USER_ID, params.id);
      localStorage.setItem("lang", params.lang ?? "ru");
      dispatch(setUserId(params.id ?? null));
    }

    i18n.changeLanguage(setLang());

    if (params.id && params.lang) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, params.id, params.lang, i18n, navigate]);

  return (
    <main className={`${styles.welcome} welcome h-screen grid place-content-center`}>
      <div className="flex items-center gap-x-5">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[10%]">
          <span className={styles.loader}></span>
        </div>
      </div>
    </main>
  );
};
