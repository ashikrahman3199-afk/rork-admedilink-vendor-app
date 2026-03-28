// import { createTRPCReact } from "@trpc/react-query";
// import { httpLink } from "@trpc/client";
// import type { AppRouter } from "../backend/trpc/app-router";
// import superjson from "superjson";

// Mock implementation to clear "No modules in context" error
export const trpc = {
  Provider: ({ children }: any) => children,
  createClient: () => ({}),
  useContext: () => ({
    example: {
      hi: {
        useMutation: () => ({ mutate: () => { } }),
        useQuery: () => ({ data: null }),
      }
    }
  }),
} as any;

export const trpcClient = {};
