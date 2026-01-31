import { oneLogApi } from "@/app/api";
import type { BookmarkParams, BookmarkPostData } from "@/shared/types/bookmarkType";

type ListResponse<T> = { value: T[]; Count: number };

export const bookmarkApi = oneLogApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookmarks: builder.query<BookmarkParams[], string>({
      query: (userId) => `/user/favourites/${userId}/`,
      transformResponse: (response: ListResponse<BookmarkParams>) => response.value ?? [],
      providesTags: ["Bookmarks"],
    }),

    createBookmark: builder.mutation<unknown, BookmarkPostData>({
      query: (cargo) => ({
        body: cargo,
        url: `/user/favourite/`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks"],
    }),

    deleteBookmark: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/user/favourite/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
  }),
});

export const {
  useGetBookmarksQuery,
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
} = bookmarkApi;
