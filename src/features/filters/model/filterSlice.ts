import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  page: number;
  origin: string;
  destination: string;
  origin_country?: string;
  destination_country?: string;
  car_type: string;
  is_premium: boolean;
}

const initialState: FilterState = {
  page: 1,
  origin: "",
  destination: "",
  origin_country: "",
  destination_country: "",
  car_type: "",
  is_premium: false,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Omit<FilterState, "page">>) {
      return { ...state, ...action.payload, page: 1 };
    },
    setIsPremium(state, action: PayloadAction<boolean>) {
      state.is_premium = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setFilters, setIsPremium, resetFilters, setPage } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
