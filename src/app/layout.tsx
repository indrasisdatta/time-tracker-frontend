// import { ThemeProvider } from "@/Provider/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./common/components/Header";
// import { ThemeProvider } from "next-themes";
import { ThemeWrapper } from "./ThemeWrapper";

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
        <ThemeWrapper>
          <Header />
          <div className="container mx-auto p-8">{children}</div>
        </ThemeWrapper>
      </body>
    </html>
  );
}
