import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vita — Gamified Life Tracker",
  description: "Track your daily activities, earn XP, and level up your life with Vita.",
};

import AppLayout from "@/components/AppLayout";
import { GoalsProvider } from "@/components/GoalsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoalsProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </GoalsProvider>
      </body>
    </html>
  );
}
