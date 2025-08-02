'use client';
import { useFormContext } from "react-hook-form";

interface InputFormProps {
	name: string;
	className:string
	placeholder?: string;
	type?: string;

}
const InputForm = ({ name, placeholder,className, type = "text" }: InputFormProps) => {
	const { register } = useFormContext();

	return (
		<div className="font-medium ">
			<input
				type={type}

				{...register(name)}
				placeholder={placeholder}
				className={className}
			/>

		</div>
	);
};
export default InputForm;