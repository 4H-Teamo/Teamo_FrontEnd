import React from "react";
import clsx from "clsx";

interface ButtonProps {
	children: React.ReactNode;
	onClick: () => void;
	isActive?: boolean;
	className?: string;
}

const Button = ({ children, onClick, className, isActive }: ButtonProps) => {
	const classes = clsx("button-common", className, {
		"ring-2 ring-white": isActive,
	});

	return (
		<button className={classes} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;