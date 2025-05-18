import type { Metadata } from "next";
import "./globals.css";
import Toaster from "@/components/layout/toaster-client";
import { cn } from "@/lib/utils";
import { inter } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "TaskVerse",
  description: "Freelance platform for projects, tasks, and finance.",
};

// Корневой компонент разметки
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
