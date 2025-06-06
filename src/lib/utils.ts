import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDateTime(dateStr: Date): Date {
  const combinedStr = `${dateStr}`;
  return new Date(combinedStr);
}
