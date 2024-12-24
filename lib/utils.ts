import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollToSection = (id: string) => {
  const cleanId = id.startsWith('#') ? id.substring(1) : id;

  const element = document.getElementById(cleanId);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
