import React from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";

type TextAreaProps = {
  name: string;
  placeholder?: string;
  className?: string;
};

const TextArea = ({ className, name, placeholder }: TextAreaProps) => {
  const { register } = useFormContext();

  return (
    <textarea
      className={clsx(
        "w-full h-48 p-5 border border-gray-300 font-black font-semibold rounded-xl resize-none md:w-6/8 lg:w-[54rem]",
        className
      )}
      placeholder={placeholder}
      {...register(name)}
    ></textarea>
  );
};

export default TextArea;
