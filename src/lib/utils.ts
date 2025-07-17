import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `RT${year}${month}${day}${random}`;
}

export function validateSouthAfricanPostalCode(postalCode: string): boolean {
  const pattern = /^[0-9]{4}$/;
  return pattern.test(postalCode);
}

export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const patterns = [
    /^(\+27|0)[1-9][0-9]{8}$/, 
    /^(\+27|0)[6-8][0-9]{8}$/, 
  ];
  
  return patterns.some(pattern => pattern.test(phone.replace(/\s/g, '')));
}
