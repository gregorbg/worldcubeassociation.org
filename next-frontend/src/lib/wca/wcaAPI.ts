import { createClient, OPERATIONS, type Ops } from "@/types/openapi";

export const serverClient = createClient<Ops>(OPERATIONS, {
  serverUrl: process.env.WCA_BACKEND_API_URL,
});

export const serverClientWithToken = (token: string) =>
  createClient<Ops>(OPERATIONS, {
    serverUrl: process.env.WCA_BACKEND_API_URL,
    auth: { bearer: token },
  });

export const unauthenticatedClient = createClient<Ops>(OPERATIONS, {
  serverUrl: process.env.NEXT_PUBLIC_WCA_FRONTEND_API_URL,
});

export const authenticatedClient = (token: string) =>
  createClient<Ops>(OPERATIONS, {
    serverUrl: process.env.NEXT_PUBLIC_WCA_FRONTEND_API_URL,
    auth: { bearer: token },
  });
