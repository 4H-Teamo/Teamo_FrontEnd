'use client';

import React from 'react';
import QueryProvider from './QueryProvider';

const RootProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryProvider>
			{children}
		</QueryProvider>
	);
};

export default RootProvider;