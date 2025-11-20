'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

/**
 * Theme provider component for managing light/dark mode.
 * Uses next-themes for seamless theme switching with system preference support.
 *
 * Docs: https://github.com/pacocoursey/next-themes
 *
 * @param {ThemeProviderProps} props - Theme provider props including children and theme configuration.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
