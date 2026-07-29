import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCity: "Rio de Janeiro",
};

export const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCity(state, action) {
      state.selectedCity = action.payload;
    },
  },
});

export const { setCity } = citySlice.actions;
export default citySlice.reducer;
