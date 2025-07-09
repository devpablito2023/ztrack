"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // ✅ Ref para evitar aplicaciones duplicadas del tema
  const lastAppliedTheme = useRef<string>("");
  const renderCount = useRef(0);

  renderCount.current++;
  console.log(`🎨 ThemeProvider render #${renderCount.current}`);

  // Función para obtener el tema del sistema
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Función para aplicar el tema al DOM
  const applyTheme = (themeToApply: Theme) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const isDark =
      themeToApply === "dark" ||
      (themeToApply === "system" && getSystemTheme() === "dark");

    const resolvedThemeValue = isDark ? "dark" : "light";
    const themeKey = `${themeToApply}-${resolvedThemeValue}`;

    // ✅ Evitar aplicaciones duplicadas
    if (lastAppliedTheme.current === themeKey) {
      console.log(`🎨 Theme already applied: ${themeKey} - skipping`);
      return;
    }

    lastAppliedTheme.current = themeKey;

    // Aplicar clases CSS
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Actualizar resolved theme
    setResolvedTheme(resolvedThemeValue);

    // Debug logs
    console.log("🎨 Theme applied:", {
      theme: themeToApply,
      resolved: resolvedThemeValue,
      systemTheme: getSystemTheme(),
      htmlClasses: root.classList.toString(),
      isDark,
      renderCount: renderCount.current,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // Cargar tema guardado al montar
  useEffect(() => {
    console.log(
      `🚀 ThemeProvider mount effect - render #${renderCount.current}`
    );

    const savedTheme = localStorage.getItem("zgroup-theme") as Theme;
    const initialTheme = savedTheme || "system";

    console.log("🚀 ThemeProvider mounted:", {
      savedTheme,
      initialTheme,
      systemTheme: getSystemTheme(),
      renderCount: renderCount.current,
    });

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    // ✅ Cleanup para StrictMode
    return () => {
      console.log(
        `🧹 ThemeProvider mount effect cleanup - render #${renderCount.current}`
      );
    };
  }, []);

  // Aplicar tema cuando cambie
  useEffect(() => {
    if (!mounted) {
      console.log(`⏳ Theme effect skipped - not mounted yet`);
      return;
    }

    console.log(`🎯 Theme effect triggered:`, {
      theme,
      mounted,
      renderCount: renderCount.current,
    });
    applyTheme(theme);
    localStorage.setItem("zgroup-theme", theme);
  }, [theme, mounted]);

  // Escuchar cambios en el tema del sistema
  useEffect(() => {
    if (!mounted || theme !== "system") {
      console.log(`⏳ System theme listener skipped:`, { mounted, theme });
      return;
    }

    console.log(`🌓 Setting up system theme listener`);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      console.log("🌓 System theme changed:", e.matches ? "dark" : "light");
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      console.log(`🧹 System theme listener cleanup`);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [mounted, theme]);

  // Función personalizada para cambiar tema
  const handleSetTheme = (newTheme: Theme) => {
    console.log("🎯 Theme change requested:", {
      from: theme,
      to: newTheme,
      renderCount: renderCount.current,
    });
    setTheme(newTheme);
  };

  // Prevenir flash durante hidratación
  if (!mounted) {
    console.log(`⏳ ThemeProvider not mounted - returning placeholder`);
    return (
      <ThemeContext.Provider
        value={{
          theme: "system",
          setTheme: () => {},
          resolvedTheme: "light",
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
