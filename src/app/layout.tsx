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
    <html lang="en" suppressHydrationWarning data-oid="1iy6-d_">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          "border-[3px]",
          "border-0",
          "relative",
          "relative",
          "top-auto right-auto bottom-auto left-auto",
          "static",
          "static",
          "top-auto right-auto bottom-auto left-auto",
          "flex",
          "block",
          "top-0 right-0 bottom-0 left-0",
          "relative",
          "relative",
          "top-auto right-auto bottom-auto left-auto",
          "static",
          "static",
        )}
        data-oid="o8kd3zy"
      >
        {children}
        <Toaster data-oid="fsw8t4:" />
      </body>
    </html>
  );
}
