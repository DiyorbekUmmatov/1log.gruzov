import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./style.module.css";
import { IoIosClose } from "react-icons/io";
import { useTranslation } from "react-i18next";

type Option = {
  label: string;
  value: string;
  flag?: string;
  raw?: unknown;
};

interface DropdownProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onSelect" | "onChange" | "value"
  > {
  icon: React.ReactElement;
  options: Option[];
  selected: Option | null;
  value: string;
  onChange: (value: string) => void;
  onSelect: (option: Option) => void;
  fromAnywhere?: string;
  anywhere?: string;
}

export const CountriesDropdown = React.forwardRef<HTMLInputElement, DropdownProps>(
  (
    {
      icon,
      options,
      selected,
      value,
      fromAnywhere,
      anywhere,
      onChange,
      onSelect,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const [history, setHistory] = useState<Option[]>([]);
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const saved = JSON.parse(localStorage.getItem("search-history") || "[]");
      setHistory(saved);
    }, []);

    const addToHistory = (item: Option) => {
      let newList = [item, ...history];

      newList = newList.filter(
        (v, i, arr) => arr.findIndex((x) => x.label === v.label) === i
      );

      newList = newList.slice(0, 5);

      setHistory(newList);
      localStorage.setItem("search-history", JSON.stringify(newList));
    };

    const removeFromHistory = (label: string) => {
      const newList = history.filter((item) => item.label !== label);
      setHistory(newList);
      localStorage.setItem("search-history", JSON.stringify(newList));
    };

    const popularOptions = useMemo(() => {
      const targetNames = [
        "russia",
        "uzbekistan",
        "turkey",
        "belarus",
        "kazakhstan",
        "kyrgyzstan",
        "tajikistan",
        "china",
      ];

      return options.filter((opt) => targetNames.includes(opt.label.toLowerCase()));
    }, [options]);

    const filteredOptions = useMemo(() => {
      const q = searchTerm.trim();

      if (q) {
        return options;
      }

      const rest = options;

      return {
        popular: popularOptions,
        rest,
      };
    }, [options, searchTerm, popularOptions]);

    useEffect(() => {
      setSearchTerm(value);
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (searchTerm !== value) {
          onChange(searchTerm);
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }, [searchTerm, onChange, value]);

    return (
      <div className={styles["dropdown-container"]} ref={containerRef}>
        <div className={styles.icon}>
          {selected?.flag ? (
            <img src={selected.flag} alt="flag" style={{ width: 30, height: 20 }} />
          ) : (
            icon
          )}
        </div>

        <input
          ref={ref}
          {...props}
          value={searchTerm.length > 10 ? `${searchTerm.slice(0, 10)}...` : searchTerm}
          className={`${styles.input} caret-color-adjust`}
          type="text"
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <button
            className={styles.clearBtn}
            onClick={() => {
              setSearchTerm("");
              onChange("");
            }}
          >
            <IoIosClose className="text-[18px]" />
          </button>
        )}

        {isOpen && (
          <div className={styles.dropdown}>
            {!searchTerm && history.length > 0 && (
              <>
                <div className="px-2 py-1 text-sm font-semibold text-gray-500">
                  <p>{t("form.recently")}</p>
                </div>

                {history.map((h, idx) => (
                  <div key={`history-${idx}`} className={styles["dropdown-content"]}>
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchTerm(h.label);
                        onSelect(h);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 flex-1"
                    >
                      {h.flag && (
                        <div className={styles["image-container"]}>
                          <img src={h.flag} alt="flag" />
                        </div>
                      )}
                      <span className={styles.name}>{h.label}</span>
                    </div>

                    <button
                      className="text-white bg-gray-300 rounded-full "
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(h.label);
                      }}
                    >
                      <IoIosClose className={"text-sm"} />
                    </button>
                  </div>
                ))}

                <div className="my-1 border-b-[0.3px] border-gray-300"></div>
              </>
            )}
            {(fromAnywhere || anywhere) && !searchTerm && (
              <div
                className={styles["dropdown-content"]}
                onMouseDown={() => {
                  const text = fromAnywhere || anywhere || "";
                  setSearchTerm(text);
                  onChange(text);
                  setIsOpen(false);
                }}
              >
                <span className={"px-2 py-1 text-sm font-semibold text-gray-500"}>
                  {fromAnywhere || anywhere}
                </span>
              </div>
            )}

            {Array.isArray(filteredOptions) ? (
              filteredOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={styles["dropdown-content"]}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addToHistory(opt);
                    setSearchTerm(opt.label);
                    onSelect(opt);
                    setIsOpen(false);
                  }}
                >
                  {opt.flag && (
                    <div className={styles["image-container"]}>
                      <img src={opt.flag} alt="flag" />
                    </div>
                  )}
                  <span className={styles.name}>{opt.label}</span>
                </div>
              ))
            ) : (
              <>
                <div className="border-b-[0.3px] border-gray-300">
                  {filteredOptions.popular.map((opt, idx) => (
                    <div
                      key={`pop-${idx}`}
                      className={styles["dropdown-content"]}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addToHistory(opt);
                        setSearchTerm(opt.label);
                        onSelect(opt);
                        setIsOpen(false);
                      }}
                    >
                      {opt.flag && (
                        <div className={styles["image-container"]}>
                          <img src={opt.flag} alt="flag" />
                        </div>
                      )}
                      <span className={styles.name}>{opt.label}</span>
                    </div>
                  ))}
                </div>

                <div className="border-b-[0.3px] border-gray-300">
                  {filteredOptions.rest.map((opt, idx) => (
                    <div
                      key={`rest-${idx}`}
                      className={styles["dropdown-content"]}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addToHistory(opt);
                        setSearchTerm(opt.label);
                        onSelect(opt);
                        setIsOpen(false);
                      }}
                    >
                      {opt.flag && (
                        <div className={styles["image-container"]}>
                          <img src={opt.flag} alt="flag" />
                        </div>
                      )}
                      <span className={styles.name}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

CountriesDropdown.displayName = "CountriesDropdown";
