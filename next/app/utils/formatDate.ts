//(2025-08-13T05:51:53.415Z)
export const toISOString = (date: Date | null): string => {
  if (!date) return "";
  return date.toISOString();
};

//(2025-08-13T05:51:53.415Z -> 2025-08-13)
export const formatISOToKorean = (date: string | Date): string => {
  if (!date) return "";

  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }

  return date.split("T")[0];
};
