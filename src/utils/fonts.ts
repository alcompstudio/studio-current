// src/utils/fonts.ts
import { Inter } from 'next/font/google'; // Use next/font/google

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Basic hook to return the font family string.
// In a real app, this might involve more complex logic or context.
export function useGoogleFont(fontName: string): string {
  if (fontName === 'Inter') {
    // Returning the CSS variable name is usually better for global application
    // return inter.variable;
    // However, if the component needs the direct font-family string:
    return inter.style.fontFamily;
  }
  // Fallback or handle other fonts
  return 'sans-serif';
}

// Export the font object itself if needed elsewhere (e.g., in layout)
export { inter };
