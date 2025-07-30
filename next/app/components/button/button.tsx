import React from "react";

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	type?: "button" | "submit"
}

const Button = ({ children,type="button", onClick, className}: ButtonProps) => {
	return (
		<button className={className} onClick={onClick} type={type}>
			{children}
		</button>
	);
};

export default Button;