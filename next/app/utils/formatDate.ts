//(2025-08-13T05:51:53.415Z)
export const toISOString = (date: Date | null): string => {
  if (!date) return "";
  return date.toISOString();
};

//(2025-08-13T05:51:53.415Z -> 2025-08-13)
export const formatISOToKorean = (isoDate: string): string => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};
