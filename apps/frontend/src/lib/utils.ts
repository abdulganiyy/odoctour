import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function combineDateTime(date:string, time:string) {
  const datePart = new Date(date);
    
  // Extract hours, minutes, and AM/PM
  const timeMatch = time.match(/(\d{1,2}):(\d{2}) (AM|PM)/);
  if (!timeMatch) {
      throw new Error("Invalid time format. Use hh:mm AM/PM.");
  }

  let hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const period = timeMatch[3];

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
      hours += 12;
  } else if (period === "AM" && hours === 12) {
      hours = 0;
  }

  return new Date(
      datePart.getFullYear(),
      datePart.getMonth(),
      datePart.getDate(),
      hours,
      minutes,
      0, // Seconds
      0  // Milliseconds
  );
  // const datePart = new Date(date);
  // const timePart = new Date(time);

  // return new Date(
  //     datePart.getFullYear(),
  //     datePart.getMonth(),
  //     datePart.getDate(),
  //     timePart.getHours(),
  //     timePart.getMinutes(),
  //     timePart.getSeconds(),
  //     timePart.getMilliseconds()
  // );
}