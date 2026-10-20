import { serverClient } from "@/lib/wca/wcaAPI";
import { cache } from "react";

const getActiveRolesOfType = cache(
  async (groupType: string, perPage: number = 25) => {
    return await serverClient.userRoles({
      query: { isActive: true, groupType, per_page: perPage },
    });
  },
);

export const getOfficersRoles = () => getActiveRolesOfType("officers");
export const getBoardRoles = () => getActiveRolesOfType("board");
// This will break again if we ever get over 100 translators
export const getTranslatorRoles = () =>
  getActiveRolesOfType("translators", 100);
