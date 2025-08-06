import {QueryClient}from "@tanstack/react-query";

export const getQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: 1,
				refetchOnWindowFocus: false,
				throwOnError: true,
				staleTime: 1000 * 20,
			},
		},
	});