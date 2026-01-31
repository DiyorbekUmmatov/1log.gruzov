import { oneLogApi } from "@/app/api";
import type { Cargos } from "@/shared/types/apiType";
import type { Cargo, CargoParams, UpdateData } from "@/shared/types/cargo";

export const cargoApi = oneLogApi.injectEndpoints({
  endpoints: (builder) => ({
    getCargos: builder.query<Cargos, CargoParams>({
      query: (params) => {
        const query = new URLSearchParams();

        if (params.page) query.append("page", params.page.toString());
        if (params.car_type && params.car_type !== "all")
          query.append("car_type", params.car_type);
        if (params.origin) query.append("origin", params.origin);
        if (params.destination) query.append("destination", params.destination);
        if (params.origin_country) query.append("origin_country", params.origin_country);
        if (params.destination_country)
          query.append("destination_country", params.destination_country);
        if (params.created_at) query.append("created_at", params.created_at);
        if (params.date) query.append("date", params.date);
        if (params.weight) query.append("weight", params.weight);
        if (params.volume) query.append("volume", params.volume);
        if (params.is_premium) query.append("is_premium", String(params.is_premium));

        return `/cargos/?${query.toString()}`;
      },
      providesTags: ["Cargos"],
    }),

    getCargoById: builder.query<Cargo, number>({
      query: (id) => `/cargo/${id}/`,
      providesTags: ["Cargos"],
    }),

    patchCargoActions: builder.mutation<Cargo, { cargoId: number; data: UpdateData }>({
      query: ({ cargoId, data }) => {
        const fields = Object.entries(data).filter(([, value]) => value !== undefined);
        const [field, value] = fields[0];
        return {
          url: `/cargo/${cargoId}/`,
          method: "PATCH",
          body: { [field]: value },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Cargos"],
    }),
  }),
});

export const {
  useGetCargosQuery,
  useLazyGetCargosQuery,
  useGetCargoByIdQuery,
  usePatchCargoActionsMutation,
} = cargoApi;
