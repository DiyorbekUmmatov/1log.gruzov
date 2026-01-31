import { oneLogApi } from "@/app/api";

// type Destination = {
//   destination: string;
// };

// export const searchApi = oneLogApi.injectEndpoints({
//   endpoints: (builder) => ({
//     searchCities: builder.query<Destination[], string>({
//       query: (q) => `/origin-search/?q=${q}`,
//     }),
//   }),
// });

// export const { useSearchCitiesQuery } = searchApi;
export type CitySearchItem = {
  id: number;
  name: string;
  code: string;
  country: string;
  import_count: number;
  export_count: number;
};

type CitiesResponse = { value: CitySearchItem[]; Count: number };

export const searchApi = oneLogApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCities: builder.query<CitySearchItem[], string>({
      query: (q) => `/cities/?q=${encodeURIComponent(q)}`,
      transformResponse: (response: CitiesResponse) => response.value ?? [],
    }),
    searchDestinations: builder.query<CitySearchItem[], string>({
      query: (q) => `/cities/?q=${encodeURIComponent(q)}`,
      transformResponse: (response: CitiesResponse) => response.value ?? [],
    }),
  }),
});

export const { useSearchCitiesQuery, useSearchDestinationsQuery } = searchApi;
