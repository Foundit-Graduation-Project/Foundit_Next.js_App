import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const helpdeskSlice = createSlice({
  name: "helpdesk",
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setTickets } = helpdeskSlice.actions;
export default helpdeskSlice.reducer;
