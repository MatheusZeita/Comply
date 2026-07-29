import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  currentQuery: string;
  results: any[];
}

const initialState: SearchState = {
  currentQuery: "",
  results: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload;
    },
    clearSearch: (state) => {
      state.currentQuery = "";
      state.results = [];
    },
  },
});

export const { setSearchQuery, setSearchResults, clearSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
