"use client";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

export const ThemeWrapper = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    return <ThemeProvider attribute="class">{children}</ThemeProvider>;
  } else {
    return <>{children}</>;
  }
};
