import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { setFilters } from "@/features/filters/model/filterSlice";
import { useGetCountriesQuery } from "@/app/countriesApi";
import { Select } from "@/shared/ui/Select";
import { CountriesDropdown } from "@/shared/ui/Dropdown";
import { FaTruck } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useSearchCitiesQuery, type CitySearchItem } from "@/app/searchApi";
import { ValueExchangeButton } from "@/features/InputValueExchange/ui/ValueExchangeButton";
import type { Country } from "@/shared/types/apiType";
import { useAppDispatch } from "@/app/hooks";

type Option = {
  label: string;
  value: string;
  flag?: string;
  raw?: unknown;
};

const isCitySearchItem = (raw: unknown): raw is CitySearchItem => {
  if (!raw || typeof raw !== "object") return false;
  return (
    "name" in raw &&
    typeof (raw as { name?: unknown }).name === "string" &&
    "country" in raw &&
    typeof (raw as { country?: unknown }).country === "string" &&
    "code" in raw &&
    typeof (raw as { code?: unknown }).code === "string"
  );
};

const isRestCountry = (raw: unknown): raw is Country => {
  if (!raw || typeof raw !== "object") return false;
  return "cca2" in raw && typeof (raw as { cca2?: unknown }).cca2 === "string";
};

export const SearchForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { data: countries } = useGetCountriesQuery();

  const [originValue, setOriginValue] = useState("");
  const [destinationValue, setDestinationValue] = useState("");

  const [originCountry, setOriginCountry] = useState<Option | null>(null);
  const [destinationCountry, setDestinationCountry] = useState<Option | null>(null);

  const [carTypeValue, setCarTypeValue] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const originQuery = originCountry ? "" : originValue.trim();
  const destinationQuery = destinationCountry ? "" : destinationValue.trim();

  const { data: originCities = [] } = useSearchCitiesQuery(originQuery, {
    skip: originQuery.length < 1,
  });

  const { data: destinationCities = [] } = useSearchCitiesQuery(destinationQuery, {
    skip: destinationQuery.length < 1,
  });

  const countryFlagMap = useMemo(() => {
    return (countries || []).reduce(
      (acc, c) => {
        if (c?.cca2 && (c.flags?.svg || c.flags?.png)) {
          acc[c.cca2.toUpperCase()] = c.flags.svg || c.flags.png;
        }
        return acc;
      },
      {} as Record<string, string>
    );
  }, [countries]);

  const filterCountries = (query: string) => {
    const list = (countries || []).map((c) => ({
      label: c.name.common,
      value: c.name.common,
      flag: c.flags.svg || c.flags.png,
      raw: c,
    }));

    if (!query) return list;

    const q = query.toLowerCase();
    return list.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 20);
  };

  const originOptions: Option[] = [
    ...filterCountries(originQuery),
    ...originCities.map((city) => {
      const count = city.export_count;
      const label = count
        ? `${city.name}, ${city.country} (${count})`
        : `${city.name}, ${city.country}`;

      return {
        label,
        value: city.name,
        flag: countryFlagMap[city.code?.toUpperCase()] ?? undefined,
        raw: city,
      };
    }),
  ];

  const destinationOptions: Option[] = [
    ...filterCountries(destinationQuery),
    ...destinationCities.map((city) => {
      const count = city.import_count;
      const label = count
        ? `${city.name}, ${city.country} (${count})`
        : `${city.name}, ${city.country}`;

      return {
        label,
        value: city.name,
        flag: countryFlagMap[city.code?.toUpperCase()] ?? undefined,
        raw: city,
      };
    }),
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      let origin = originValue;
      let destination = destinationValue;
      let origin_country = "";
      let destination_country = "";

      if (originCountry?.raw) {
        if (isCitySearchItem(originCountry.raw)) {
          origin = originCountry.raw.name;
          origin_country = originCountry.raw.code;
        } else if (isRestCountry(originCountry.raw)) {
          origin = "";
          origin_country = originCountry.raw.cca2;
        }
      }

      if (destinationCountry?.raw) {
        if (isCitySearchItem(destinationCountry.raw)) {
          destination = destinationCountry.raw.name;
          destination_country = destinationCountry.raw.code;
        } else if (isRestCountry(destinationCountry.raw)) {
          destination = "";
          destination_country = destinationCountry.raw.cca2;
        }
      }

      dispatch(
        setFilters({
          origin,
          destination,
          origin_country,
          destination_country,
          car_type: carTypeValue,
          is_premium: false,
        })
      );

      sessionStorage.setItem("viewMode", "search");
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setIsSearching(false);
    }
  };

  const valueChange = () => {
    setOriginValue(destinationValue);
    setDestinationValue(originValue);

    const temp = originCountry;
    setOriginCountry(destinationCountry);
    setDestinationCountry(temp);
  };

  return (
    <form className="flex flex-col gap-y-4" onSubmit={onSubmit}>
      <div className="relative flex flex-col gap-y-4">
        <CountriesDropdown
          icon={
            <div className="flex items-center pr-3 mr-2 border-r border-gray">
              <FaLocationDot className="text-[#041E90]" />
            </div>
          }
          placeholder={t("form.from")}
          options={originOptions}
          value={originValue}
          selected={originCountry}
          fromAnywhere={t("fromAnywhere")}
          onChange={(val) => {
            setOriginValue(val);
            setOriginCountry(null);
          }}
          onSelect={(item) => {
            setOriginCountry(item);
            setOriginValue(item.label);
          }}
        />

        <ValueExchangeButton valueChange={valueChange} />

        <CountriesDropdown
          icon={
            <div className="flex items-center pr-3 mr-2 border-r border-gray">
              <FaLocationDot className="text-[#041E90]" />
            </div>
          }
          placeholder={t("form.to")}
          options={destinationOptions}
          value={destinationValue}
          selected={destinationCountry}
          anywhere={t("anywhere")}
          onChange={(val) => {
            setDestinationValue(val);
            setDestinationCountry(null);
          }}
          onSelect={(item) => {
            setDestinationCountry(item);
            setDestinationValue(item.label);
          }}
        />
      </div>

      <Select
        className="input"
        icon={
          <div className="flex items-center pr-3 mr-2 border-r border-gray">
            <FaTruck className="text-[#041E90]" />
          </div>
        }
        value={carTypeValue}
        onChange={(e) => setCarTypeValue(e.target.value)}
      />

      <button
        type="submit"
        disabled={isSearching}
        className={`px-3 py-2 rounded-[28px] text-xl text-white duration-300 ${
          isSearching
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FF9F4C] hover:bg-[#FF8C33]"
        }`}
      >
        {isSearching ? t("form.searching") : t("form.search")}
      </button>
    </form>
  );
};
