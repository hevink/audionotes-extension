import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDateTime = (dateString: Date) => {
  const date = dateString.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = dateString
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  return { date, time };
};

export function formatTime(seconds: number, hrDisplay: boolean): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return hrDisplay
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(remainingSeconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(
        2,
        "0"
      )}`;
}

export const truncateText = (text: string, length: number = 30): string => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
