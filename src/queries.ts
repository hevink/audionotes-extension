import { useQuery } from "@tanstack/react-query";
import { getUser, getUserPlan } from "./action";
export const STALE_TIME = 1000 * 60 * 60 * 24;

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

export const useGetUserPlan = () => {
  return useQuery({
    queryKey: ["plan"],
    queryFn: async () => {
      const { data, error } = await getUserPlan();
      if (error) {
        console.error("Error getting user plan:", error);
        return null;
      }
      return data;
    },
    staleTime: STALE_TIME,
  });
};
