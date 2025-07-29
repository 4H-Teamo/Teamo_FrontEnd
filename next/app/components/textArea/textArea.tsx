
import React from "react";

type TextAreaProps = {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const TextArea = ({ value, onChange }: TextAreaProps) => {
	return (
		<textarea
			className="w-full h-48 p-5 border border-gray-300 rounded-xl resize-none md:w-6/8 lg:w-[54rem]"
			placeholder="자기소개를 입력하세요"
			value={value}
			onChange={onChange}
		></textarea>
	);
};

export default TextArea;