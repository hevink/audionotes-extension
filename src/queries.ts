import { useQuery } from "@tanstack/react-query";
import { getUser } from "./action";

export const useGetUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await getUser();
      if (error) {
        console.error("Error getting user:", error);
        return null;
      }
      return data;
    },
    enabled,
  });
};
