import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    setCommunities: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setCommunities } = communitiesSlice.actions;
export default communitiesSlice.reducer;
