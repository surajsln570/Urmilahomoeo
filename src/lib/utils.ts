import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function weekdayFromDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
}
