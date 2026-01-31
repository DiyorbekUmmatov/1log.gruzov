import type { Country } from "@/shared/types/apiType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_RESTCOUNTRIES_API,
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => `/all?fields=name,flags,cca2`,
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
