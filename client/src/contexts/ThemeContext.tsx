import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
  storageKey?: string;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = true,
  storageKey = "solelyart-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    
    if (switchable) {
      const stored = localStorage.getItem(storageKey);
      if (stored && ["light", "dark", "system"].includes(stored)) {
        return stored as Theme;
      }
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (theme === "system") {
      return getSystemTheme();
    }
    return theme as "light" | "dark";
  });

  // Handle system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Update resolved theme when theme changes
  useEffect(() => {
    if (theme === "system") {
      setResolvedTheme(getSystemTheme());
    } else {
      setResolvedTheme(theme as "light" | "dark");
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove("light", "dark");
    
    // Add the resolved theme class
    root.classList.add(resolvedTheme);

    // Store preference
    if (switchable) {
      localStorage.setItem(storageKey, theme);
    }
  }, [resolvedTheme, theme, switchable, storageKey]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "light";
      // If system, toggle to opposite of current resolved theme
      return resolvedTheme === "light" ? "dark" : "light";
    });
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// Export type for use in other components
export type { Theme };
