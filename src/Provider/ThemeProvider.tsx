"use client";
import { useState, createContext, ReactNode } from "react";

interface ThemeContextProps {
  mode: string;
  toggleTheme: (theme: boolean) => void;
}
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextProps>({
  mode: "",
  toggleTheme: () => {
    // set mode
  },
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  let savedTheme = "";
  if (
    localStorage?.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    savedTheme = "dark";
    localStorage?.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark:text-white");
    document.body.classList.add("dark:bg-dark");
  }
  const [mode, setMode] = useState(savedTheme);

  const toggleTheme = (isDark: boolean) => {
    if (isDark) {
      setMode("dark");
      localStorage?.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark:text-white");
      document.body.classList.add("dark:bg-dark");
    } else {
      setMode("light");
      localStorage?.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
