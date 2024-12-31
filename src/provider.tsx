import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // refetchOnWindowFocus: false,
            // staleTime: 1000 * 60 * 60 * 1, // 1 hour // this works with constant refreseshs but not with queryData updates
            // gcTime: 1000 * 60 * 60 * 1, // 1 hour // this works with queryData updates but not with constant refreseshs

            // refetchOnMount: false,
            // refetchOnReconnect: false,
            // staleTime: Infinity,
            // gcTime: Infinity,

            refetchOnWindowFocus: false,
            // staleTime: Infinity, // Prevent refetching on page changes
            // gcTime: Infinity, // 1 hour for garbage collection
        },
    },
});
