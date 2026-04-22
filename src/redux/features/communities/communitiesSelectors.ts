import { RootState } from "@/redux/store";

export const selectCommunities = (state: RootState) => state.communities.data;
export const selectCommunitiesLoading = (state: RootState) => state.communities.isLoading;