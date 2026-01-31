import i18n from "@/shared/config/i18n";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL as string,
  responseHandler: "content-type",
});

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const lang = i18n.language === "ru" ? "ru" : i18n.language.slice(0, 2);
  const url = typeof args === "string" ? args : args.url;

  const updatedUrl = `/${lang}/api/v1${url}`;
  return rawBaseQuery(
    typeof args === "string"
      ? ({ url: updatedUrl } as FetchArgs)
      : { ...args, url: updatedUrl },
    api,
    extraOptions
  );
};

export const oneLogApi = createApi({
  reducerPath: "oneLogApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["Cargos", "Bookmarks", "Routes"],
  endpoints: () => ({}),
});
