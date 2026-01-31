import { oneLogApi } from "@/app/api";
import type { Cargo } from "@/shared/types/cargo";

type ListResponse<T> = { value: T[]; Count: number };

export const notificationApi = oneLogApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Cargo[], string>({
      query: (userId) => `/user/notifications/${userId}/`,
      transformResponse: (response: ListResponse<Cargo>) => response.value ?? [],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
