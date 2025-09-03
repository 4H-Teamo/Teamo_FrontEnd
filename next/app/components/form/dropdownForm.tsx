"use client";
import { useState } from "react";
import ArrowDown from "@/app/assets/arrowDown.svg";
import Image from "next/image";

interface OptionType {
  id: number | boolean;
  label: string;
}

interface DropDownProps {
  options?: OptionType[] | undefined;
  value: number | boolean;
  onChange: (value: number | boolean) => void;
  placeholder?: string;
}

const DropDownForm = ({
  options,
  value,
  onChange,
  placeholder,
}: DropDownProps) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const toggleDropDown = () => setShowDropDown(!showDropDown);
  const handleSelect = (val: number | boolean) => {
    onChange(val);
    setShowDropDown(false);
  };

  const selected = options?.find((opt) => opt.id === value)?.label;
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          className="input-common font-semibold cursor-pointer"
          readOnly
          value={selected || ""}
          placeholder={placeholder || "선택하세요"}
          onClick={toggleDropDown}
        />
        <Image
          src={ArrowDown}
          alt="아래 화살표"
          width={20}
          height={20}
          className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${
            showDropDown ? "rotate-180" : ""
          }`}
        />
      </div>
      {showDropDown && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl">
          {options?.map((opt) => (
            <li
              key={String(opt.id)}
              className="p-5 text-sm font-medium cursor-pointer hover:bg-gray-100 rounded-xl"
              onClick={() => handleSelect(opt.id)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDownForm;
