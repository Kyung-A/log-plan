export const formatDateToInsert = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return date;
};
