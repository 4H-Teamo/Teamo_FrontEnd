import { create } from "zustand";

type CalendarStore = {
  endDate: string;
  setEndDate: (date: string) => void;
};

const useCalendarStore = create<CalendarStore>((set) => ({
  endDate: "",
  setEndDate: (date) => set({ endDate: date }),
}));

export default useCalendarStore;
