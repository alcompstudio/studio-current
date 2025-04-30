import type { Metadata } from 'next';
// Correctly import a font from next/font/google
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

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
      {/* Apply the font variable to the body */}
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
