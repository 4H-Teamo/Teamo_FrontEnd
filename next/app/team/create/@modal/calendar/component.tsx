"use client";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import React, { useState, useCallback } from "react";
import { formatCalendar } from "@/app/utils/formatDate";
import { useRouter } from "next/navigation";
import useBackdrop from "@/app/hooks/useBackdrop";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarModalProps {
  onChange: (date: string) => void;
}

const CalendarModal = ({ onChange }: CalendarModalProps) => {
  const [calendarValue, setCalendarValue] = useState<Value>(new Date());
  const router = useRouter();
  const { handleBackdropClick } = useBackdrop();
  const onChangeCalendar = useCallback(
    (nextValue: Value) => {
      setCalendarValue(nextValue);
      if (!Array.isArray(nextValue)) {
        const formattedDate = formatCalendar(nextValue);
        onChange(formattedDate);
        router.back();
      }
    },
    [onChange, router]
  );



  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-blacK/50 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          onChange={onChangeCalendar}
          value={calendarValue}
          selectRange={false}
          formatDay={(_, date) => date.toLocaleString("en", { day: "numeric" })}
        />
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;