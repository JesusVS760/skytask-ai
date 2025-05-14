import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDateTime(dateStr: string, timeStr: string): Date {
  const combinedStr = `${dateStr}T${timeStr}`;
  return new Date(combinedStr);
}
