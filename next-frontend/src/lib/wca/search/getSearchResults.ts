import { serverClient } from "@/lib/wca/wcaAPI";
import { cache } from "react";

export const getSearchResults = cache(async (query: string) => {
  return await serverClient.omniSearch({ query: { q: query } });
});
