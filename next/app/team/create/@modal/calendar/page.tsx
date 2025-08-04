"use client";
import CalendarModal from "@/app/team/create/@modal/calendar/component";
import useCalendarStore from "@/app/store/calendarStore";

export default function CalendarPage() {
  const { setEndDate } = useCalendarStore();

  return (
    <CalendarModal
      onChange={(date) => {
        setEndDate(date);
      }}
    />
  );
}
