"use client";
import calendar from "@/app/assets/calendar.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCalendarStore from "@/app/store/calendarStore";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
  interface Props{
    value?:string;
    onChange?:()=>void;
  }
const PLACEHOLDER_TEXT = "날짜를 선택하세요";
  const DateBox = ({value,onChange}:Props) => {
  const router = useRouter();
  const { setValue } = useFormContext();
  const endDate = useCalendarStore((s) => s.endDate);

  useEffect(() => {
    if (endDate) {
      setValue("endDate", endDate);
    }
  }, [endDate, setValue]);

  const handleDateBoxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/team/create/calendar");
  };

  return (
    <button onClick={handleDateBoxClick}  className="input-calendar">
      <span className={endDate ? "" : "text-gray20"}>
        {endDate || PLACEHOLDER_TEXT}
      </span>
      <Image src={calendar} alt="달력" />
    </button>
  );
};
export default DateBox;