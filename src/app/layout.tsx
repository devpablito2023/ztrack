import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "$/contexts/ThemeContext";
import { SidebarProvider } from "$/contexts/SidebarContext";
import { ToastProvider } from "$/contexts/ToastContext";
import ConditionalLayout from "$/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZGROUP - LinkControl",
  description: "Sistema de control y gestión ZGROUP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-gray-50
          dark:bg-gray-900
          text-gray-900
          dark:text-gray-100
          transition-colors
          duration-200
          ease-in-out
        `}
      >
        <ThemeProvider>
          <SidebarProvider>
            <ToastProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </ToastProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
