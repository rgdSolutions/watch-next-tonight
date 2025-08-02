import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function returnFirstWord(str: string) {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }
  return str.split(' ')[0].toLowerCase();
}
