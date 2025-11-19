import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes intelligently, merging conflicting utilities.
 * Uses clsx for conditional class concatenation and tailwind-merge to resolve conflicts.
 *
 * @param {...ClassValue[]} inputs - Class names or conditional class objects.
 * @returns {string} Merged class string.
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-4 overrides px-2)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
