import React from "react";

export default function CreateLayout({
	                                     children,
	                                     modal,
                                     }: {
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	return (
		<>
			<div>{children}</div>
			{modal}
		</>
	);
}