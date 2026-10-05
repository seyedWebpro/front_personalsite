export const THEME_COOKIE = "ps_theme";

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type ColorScheme = "light" | "dark";

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

export function isThemePreference(value: string): value is ThemePreference {
  return (THEME_PREFERENCES as readonly string[]).includes(value);
}

export function parseThemePreference(value: string | null | undefined): ThemePreference {
  if (value && isThemePreference(value)) return value;
  return DEFAULT_THEME_PREFERENCE;
}

/** SSR class: only an explicit dark cookie is known without the OS. System is resolved by ThemeScript. */
export function ssrDarkClass(preference: ThemePreference): string {
  return preference === "dark" ? "dark" : "";
}

export const THEME_INIT_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);var p=m?decodeURIComponent(m[1]):"${DEFAULT_THEME_PREFERENCE}";if(p!=="light"&&p!=="dark"&&p!=="system")p="${DEFAULT_THEME_PREFERENCE}";var d=p==="dark"||(p!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";e.dataset.theme=p;}catch(n){}})();`;
