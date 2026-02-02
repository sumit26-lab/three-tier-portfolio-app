// hooks/useIsAdmin.ts
import { useQuery } from "@tanstack/react-query";

export function useIsAdmin() {
  return useQuery({
    queryKey: ["adminStatus"],
    queryFn: async () => {
      const res = await fetch("/api/admin/me", {
        headers: {
          "x-admin-key": localStorage.getItem("adminKey") || ""
        }
      });
      if (!res.ok) throw new Error("Not admin");
      return res.json();
    },
    retry: false
  });
}
