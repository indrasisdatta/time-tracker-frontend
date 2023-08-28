import { ThemeProvider } from "@/Provider/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ThemeSwitch } from "@/common/components/ThemeSwitch";
import { Header } from "@/common/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timesheet App",
  description: "Track your daily timesheet entries",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <ThemeSwitch />
          <div className="container mx-auto p-8">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
