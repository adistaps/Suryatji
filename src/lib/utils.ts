import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format angka ke Rupiah, misal: 150000 → "Rp 150.000" */
export function formatRp(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}
