import type { ReactNode } from "react";

import "./globals.css";

type Props = {
  children: ReactNode;
};

/** Root shell — html/body live in `[locale]/layout` for bilingual dir/lang. */
export default function RootLayout({ children }: Props) {
  return children;
}
