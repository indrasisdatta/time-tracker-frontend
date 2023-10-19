// import { ThemeProvider } from "@/Provider/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./common/components/Header";
// import { ThemeProvider } from "next-themes";
import { ThemeWrapper } from "./ThemeWrapper";
// import { NextProgressBar } from "./common/components/NextProgressBar";
import { Suspense } from "react";
import { Loader } from "./common/components/Loader";
import { PageLoader } from "./common/components/PageLoader";

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
          <Suspense fallback={<PageLoader />}>
            <div className="container mx-auto md:p-8 my-8">{children}</div>
          </Suspense>
        </ThemeWrapper>
      </body>
    </html>
  );
}
