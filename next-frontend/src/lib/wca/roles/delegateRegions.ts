import { cache } from "react";
import { serverClient } from "@/lib/wca/wcaAPI";

// The biggest region has a few hundred Delegates, so one page always holds all of them.
const DELEGATES_PER_PAGE = 1000;

export const getDelegateRegions = cache(async () => {
  return await serverClient.userGroups({
    query: {
      isActive: true,
      groupType: "delegate_regions",
    },
  });
});

export const getDelegatesInGroup = cache(async (groupId: number) => {
  return await serverClient.userRoles({
    query: {
      groupId,
      isActive: true,
      sort: "location,name",
      per_page: DELEGATES_PER_PAGE,
    },
  });
});

export const getDelegatesInSubgroups = cache(async (groupId: number) => {
  return await serverClient.userRoles({
    query: {
      parentGroupId: groupId,
      isActive: true,
      sort: "location,name",
      per_page: DELEGATES_PER_PAGE,
    },
  });
});
