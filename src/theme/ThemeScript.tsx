import { THEME_INIT_SCRIPT } from "@/theme/theme";

/** Blocking init so the first paint matches the saved preference (no flash). */
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  );
}
