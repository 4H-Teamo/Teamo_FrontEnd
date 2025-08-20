"use client";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { useState, useCallback } from "react";
import { formatCalendar } from "../../../../utils/formatDate";
import { useRouter } from "next/navigation"

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarModalProps {
  onChange: (date: string) => void;
}

const CalendarModal = ({ onChange }: CalendarModalProps) => {
  const [calendarValue, setCalendarValue] = useState<Value>(new Date());
  const router = useRouter();

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
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