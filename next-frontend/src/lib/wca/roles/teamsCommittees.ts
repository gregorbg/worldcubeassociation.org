import { cache } from "react";
import { serverClient } from "@/lib/wca/wcaAPI";

export const getTeamsCommittees = cache(async () => {
  return await serverClient.userGroups({
    query: {
      isActive: true,
      groupType: "teams_committees",
      isHidden: false,
    },
  });
});

export const getTeamCommitteeMembers = cache(
  async (groupId: number, pastMembers: boolean = false) => {
    return await serverClient.userRoles({
      query: {
        groupId,
        isActive: pastMembers,
        sort: "status:desc,name:asc",
      },
    });
  },
);
