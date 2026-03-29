import { RootState } from "@/redux/store";

export const selectCommunities = (state: RootState) => state.communities.items;
export const selectCommunitiesLoading = (state: RootState) => state.communities.loading;
