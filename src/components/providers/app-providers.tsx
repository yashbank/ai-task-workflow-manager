"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    </SessionProvider>
  );
}
