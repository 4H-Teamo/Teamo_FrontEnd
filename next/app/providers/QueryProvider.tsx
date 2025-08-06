//
// 'use client';
//
// import { QueryClientProvider } from '@tanstack/react-query';
// import React, { useRef } from 'react';
// import { getQueryClient } from './queryClient';
//
// const QueryProvider = ({ children }: { children: React.ReactNode }) => {
// 	const queryClientRef = useRef(getQueryClient());
//
// 	return (
// 		<QueryClientProvider client={queryClientRef.current}>
// 			{children}
// 			</QueryClientProvider>
// 	);
// };
//
// export default QueryProvider;
'use client';

import {QueryClientProvider} from '@tanstack/react-query';
import React, {useRef} from 'react';
import {getQueryClient} from "@/app/providers/queryClient";

const QueryProvider = ({children}:{children:React.ReactNode}) => {
	const queryClientRef=useRef(getQueryClient());
	return(
	<QueryClientProvider client={queryClientRef.current}>
		{children}
	</QueryClientProvider>
	)
}
export default QueryProvider;