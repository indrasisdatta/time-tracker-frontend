import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

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
    <html lang="en" className="dark">
      <body className={inter.className}>
        <header className="border-b-[1px] border-gray-300">
          <nav className="mx-auto flex justify-content-between p-3 lg:px-8">
            <div className="flex items-center flex-shrink-0 text-black dark:text-white mr-6 hover:bg-gray-700">
              <Link
                href="/"
                className="text-indigo-600 font-bold dark:text-white"
              >
                Timesheet App
              </Link>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
              <div className="text-sm lg:flex-grow">
                <Link
                  href="calendar"
                  className="block mt-1 md:mt-4 lg:inline-block lg:mt-0 text-indigo-700 dark:text-teal-100 dark:hover:text-white mr-4"
                >
                  Calendar
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <div className="container mx-auto p-8">{children}</div>
      </body>
    </html>
  );
}
