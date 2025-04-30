import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { cn } from '@/lib/utils'; // Import cn utility

// Initialize the Inter font
const inter = Inter({
  variable: '--font-inter', // Define a CSS variable
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TaskVerse', // Update title
  description: 'Freelance platform for projects, tasks, and finance.', // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Ensure no whitespace or comments are direct children of <html> before <body>
    <html lang="en" suppressHydrationWarning>
      {/* Use cn to apply font variable and other base classes */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
