// import { ThemeProvider } from "@/Provider/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./common/components/Header";
// import { ThemeProvider } from "next-themes";
import { ThemeWrapper } from "./ThemeWrapper";
// import { NextProgressBar } from "./common/components/NextProgressBar";
import { Suspense, useCallback } from "react";
import { Loader } from "./common/components/Loader";
import { PageLoader } from "./common/components/PageLoader";
import { AuthContextProvider } from "../context/AuthContext";
// import { LoggedinUserData } from "@/utils/auth";
import { redirect, useRouter } from "next/navigation";

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
  // const router = useRouter();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <ThemeWrapper>
            <Header />
            <Suspense fallback={<PageLoader />}>
              <div className="container mx-auto md:p-8 my-8">{children}</div>
            </Suspense>
          </ThemeWrapper>
        </AuthContextProvider>
      </body>
    </html>
  );
}
