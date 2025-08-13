import React from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
type TextAreaProps = {
  value: string;
  name: string;
  placeholder?: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const TextArea = ({
  className,
  name,
  value,
  placeholder,
  onChange,
}: TextAreaProps) => {
  const { register } = useFormContext();
  return (
    <textarea
      className={clsx(
        "w-full h-48 p-5 border border-gray-300 rounded-xl resize-none md:w-6/8 lg:w-[54rem]",
        className
      )}
      placeholder={placeholder}
      value={value ?? ""}
      {...register(name)}
      onChange={onChange}
    ></textarea>
  );
};

export default TextArea;
