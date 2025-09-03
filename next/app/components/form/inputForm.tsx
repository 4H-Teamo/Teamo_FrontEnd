"use client";
import { useFormContext } from "react-hook-form";

interface InputFormProps {
  name: string;
  className: string;
  placeholder?: string;
  type?: string;
}
const InputForm = ({ name, placeholder, className, type }: InputFormProps) => {
  const { register } = useFormContext();

  const inputClassName =
    type === "number"
      ? `${className} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`
      : className;

  return (
    <div className="font-medium w-full">
      <input
        type={type}
        {...register(name, {
          valueAsNumber: type === "number",
        })}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  );
};
export default InputForm;
