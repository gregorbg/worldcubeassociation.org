import { signOut, useSession } from "@/auth.client";
import { useMemo } from "react";
import { authenticatedClient, unauthenticatedClient } from "@/lib/wca/wcaAPI";
import { createQueryFactories } from "@/types/openapi.tanstack";

export function useAPIClient() {
  const { data: session } = useSession();

  return useMemo(() => {
    // No access token means the refresh token is spent; there is nothing to authenticate with.
    if (session?.accessToken) {
      const client = authenticatedClient(session.accessToken);

      // If the backend rejects our access_token (revoked, expired, etc.),
      // the session is no longer usable —
      // drop it so the user is forced through a fresh login rather than
      // continuing to fire requests that 401.
      client.use({
        async onResponse(response) {
          if (response.status === 401) {
            await signOut();
          }

          return response;
        },
      });

      return client;
    } else {
      return unauthenticatedClient;
    }
  }, [session]);
}

export default function useAPI() {
  const apiClient = useAPIClient();

  return useMemo(() => createQueryFactories(apiClient), [apiClient]);
}
