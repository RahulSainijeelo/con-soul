import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-friendly slug from a string.
 * E.g. "Uttarakhand Mussoorie & Rishikesh 7 Days" → "uttarakhand-mussoorie-rishikesh-7-days"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Safely parse a date value to ISO string.
 * Returns null if the value is invalid.
 */
export function parseDateSafe(dateVal: unknown, fallback?: unknown): string | null {
    if (!dateVal || (typeof dateVal !== "string" && typeof dateVal !== "number")) {
        return typeof fallback === "string" ? fallback : null;
    }
    try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) {
            return typeof fallback === "string" ? fallback : null;
        }
        return d.toISOString();
    } catch {
        return typeof fallback === "string" ? fallback : null;
    }
}

/**
 * Format a date string to Indian locale (e.g., "15 Aug 2026").
 */
export function formatDateIN(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
