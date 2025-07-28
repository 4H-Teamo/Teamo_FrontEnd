import React from "react";

interface LabelProps {
	id: string,
	text: string
}

const Label = ({id, text}: LabelProps) => {
	return (
		<label htmlFor={id} className="leading-5 text-sm font-light text-gray10">{text}</label>
	);
};

export default Label;