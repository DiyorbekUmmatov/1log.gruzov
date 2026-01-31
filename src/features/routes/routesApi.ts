import { oneLogApi } from "@/app/api";

type Route = {
  user: string;
  origin: string;
  destination: string;
};

interface TopRouteData {
  origin: string;
  destination: string;
  total: number;
}

type ListResponse<T> = { value: T[]; Count: number };

export const routesApi = oneLogApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoutes: builder.query<Route[], string>({
      query: (userId) => `/user/routes/${Number(userId)}/`,
      transformResponse: (response: ListResponse<Route>) => response.value ?? [],
      providesTags: ["Routes"],
    }),
    getTopRoutes: builder.query<TopRouteData[], void>({
      query: () => "/top-cargos/",
      transformResponse: (response: ListResponse<TopRouteData>) => response.value ?? [],
    }),
    addRoute: builder.mutation<
      unknown,
      { user: number; origin: string; destination: string }
    >({
      query: (data) => ({
        body: data,
        url: `/user/save-route/`,
        method: "POST",
      }),
      invalidatesTags: ["Routes"],
    }),
    deleteRoute: builder.mutation<
      unknown,
      { user: number; origin: string; destination: string }
    >({
      query: (data) => ({
        body: data,
        url: `/user/delete-route/`,
        method: "POST",
      }),
      invalidatesTags: ["Routes"],
    }),
  }),
});

export const {
  useGetRoutesQuery,
  useGetTopRoutesQuery,
  useAddRouteMutation,
  useDeleteRouteMutation,
} = routesApi;
