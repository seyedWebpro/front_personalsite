"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  THEME_COOKIE,
  type ColorScheme,
  type ThemePreference,
} from "@/theme/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  scheme: ColorScheme;
  setPreference: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function persistPreference(preference: ThemePreference): void {
  const secure =
    typeof location !== "undefined" && location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${THEME_COOKIE}=${preference}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

function applyDocumentTheme(preference: ThemePreference, scheme: ColorScheme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", scheme === "dark");
  root.style.colorScheme = scheme;
  root.dataset.theme = preference;
}

function subscribeSystemScheme(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSystemScheme(): ColorScheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSystemScheme(): ColorScheme {
  return "light";
}

export function ThemeProvider({
  children,
  initialPreference,
}: {
  children: ReactNode;
  initialPreference: ThemePreference;
}) {
  const [preference, setPreferenceState] = useState(initialPreference);
  const systemScheme = useSyncExternalStore(
    subscribeSystemScheme,
    getSystemScheme,
    getServerSystemScheme,
  );

  const scheme: ColorScheme =
    preference === "system" ? systemScheme : preference;

  const setPreference = useCallback(
    (next: ThemePreference) => {
      persistPreference(next);
      setPreferenceState(next);
      const nextScheme =
        next === "system" ? getSystemScheme() : next;
      applyDocumentTheme(next, nextScheme);
    },
    [],
  );

  useEffect(() => {
    applyDocumentTheme(preference, scheme);
  }, [preference, scheme]);

  const value = useMemo(
    () => ({ preference, scheme, setPreference }),
    [preference, scheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
