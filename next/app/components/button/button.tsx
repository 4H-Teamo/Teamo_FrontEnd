import React from "react";
import clsx from "clsx";

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	isActive?: boolean;
	className?: string;
	type?: "button" | "submit"
}

const Button = ({ children,type="button", onClick, className, isActive }: ButtonProps) => {
	const classes = clsx("button-common", className, {
		"ring-2 ring-white": isActive,
	});

	return (
		<button className={classes} onClick={onClick} type={type}>
			{children}
		</button>
	);
};

export default Button;