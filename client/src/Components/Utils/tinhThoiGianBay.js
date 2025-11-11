import { differenceInMinutes, parse } from "date-fns";

export const calculateDuration = (start, end) => {
  const startDate = parse(start, "HH:mm", new Date());
  const endDate = parse(end, "HH:mm", new Date());
  const diffInMinutes = differenceInMinutes(endDate, startDate);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return `${hours} giờ ${minutes} phút`;
};
