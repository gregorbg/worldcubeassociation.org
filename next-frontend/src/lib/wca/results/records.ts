import { cache } from "react";
import { serverClient } from "@/lib/wca/wcaAPI";

export const getRecords = cache(
  async (searchParams: { gender: string; region: string; show: string }) => {
    return await serverClient.getRecords({ query: searchParams });
  },
);
