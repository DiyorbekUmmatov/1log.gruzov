import { oneLogApi } from "@/app/api";

export type StatisticsResponse = {
  users: number;
  cargos: number;
  active_users: number;
  premium_cargos: number;
  logists: number;
  drivers: number;
};

const statisticsApi = oneLogApi.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<StatisticsResponse, void>({
      query: () => `/user/statistics/`,
    }),
  }),
});

export const { useGetStatisticsQuery } = statisticsApi;
