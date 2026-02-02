import { QueryClient } from "@tanstack/react-query";
import { apiFetch } from "./apiClient";

/*
  ✅ React Query should use apiFetch
  So token automatically attach ho jayega
*/

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        // example: ["/api/articles"]
        return apiFetch(queryKey[0] as string);
      },

      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 min cache
    },

    mutations: {
      retry: false,
    },
  },
});
