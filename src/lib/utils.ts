import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(second: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, second * 1000);
  });
}

export function fileToBase64(file: File) {
  const reader = new FileReader();

  if (!reader) return;

  reader.onload = () => {
    const base64String = reader.result;
    return base64String;
  };

  reader.readAsDataURL(file);
}
