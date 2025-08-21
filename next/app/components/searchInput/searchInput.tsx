import { IoSearch } from "react-icons/io5";
import React from "react";
import clsx from "clsx";
interface SearchBarProps {
  readOnly?: boolean;
  value?: string;
  className?: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
}
const SearchInput = ({
  onClick,
  className,
  onChange,
  value,
  readOnly = false,
}: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("검색어:", e.currentTarget.value);
    }
  };
  return (
    <div
      className={clsx(
        "flex mix-w-56 h-10 gap-2 items-center  rounded-full bg-[#F4F7FE] px-4 text-[#8F9BBA] text-sm",
        className
      )}
      onClick={onClick}
    >
      <IoSearch className="text-[#2B3674] " />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder="검색"
        className="focus:outline-none  bg-[#F4F7FE] text-black"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchInput;
