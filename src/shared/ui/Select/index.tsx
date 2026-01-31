import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./style.module.css";
import { types } from "./types";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: React.ReactElement;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ icon, ...props }, ref) => {
    const { t } = useTranslation();

    return (
      <div className={styles["select-container"]}>
        <div className={styles.icon}>{icon}</div>
        <select
          ref={ref}
          {...props}
          defaultValue={"all"}
          className={`w-full truncate whitespace-nowrap overflow-hidden text-ellipsis border rounded caret-color-adjust  ${
            props.value === "all" ? "text-[#959595]" : "!text-black"
          }`}
        >
          <option value="all" disabled>
            {t("cargo_type")}
          </option>
          <option value="">{t("all_cargo_type")}</option>
          {types
            .filter((t) => t.value !== null)
            .map((t, index) => (
              <option key={index} value={t.value}>
                {t.value}
              </option>
            ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
