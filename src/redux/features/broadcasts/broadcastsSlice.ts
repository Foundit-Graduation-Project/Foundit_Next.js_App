import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const broadcastsSlice = createSlice({
  name: "broadcasts",
  initialState,
  reducers: {
    setBroadcasts: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setBroadcasts } = broadcastsSlice.actions;
export default broadcastsSlice.reducer;
