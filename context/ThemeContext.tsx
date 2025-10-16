"use client"

import { createContext, useContext, useState, ReactNode, SetStateAction } from 'react';

interface ThemeContextType {
  theme: "light" | "dark" | null;
  setGlobalTheme: React.Dispatch<SetStateAction<"light" | "dark" | null>>
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light", 
  setGlobalTheme: function holder(){},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setGlobalTheme] = useState<"light" | "dark" | null>("light");

  return (
    <ThemeContext.Provider value={{ theme, setGlobalTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);