import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/shared/config/storageKeys";

export interface UserState {
  userId: string | null;
}

function getInitialUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
}

const initialState: UserState = {
  userId: getInitialUserId(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string | null>) {
      state.userId = action.payload;
    },
    clearUserId(state) {
      state.userId = null;
    },
  },
});

export const { setUserId, clearUserId } = userSlice.actions;
export const userReducer = userSlice.reducer;
