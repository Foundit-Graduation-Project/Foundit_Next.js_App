import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setReports } = reportsSlice.actions;
export default reportsSlice.reducer;
