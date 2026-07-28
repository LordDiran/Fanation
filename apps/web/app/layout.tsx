import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fanation/ui/src/styles.css";
import { ThemeBody } from "../components/theme";

/**
 * Same call as `apps/landing/app/layout.tsx`, deliberately — one typeface across the
 * marketing site, the app and the console. `next/font` downloads Inter at build time and
 * serves it from our own origin, so there is no request to Google or Fontshare at runtime
 * and no flash of fallback text on a slow or filtered network.
 *
 * Exposed as a CSS variable rather than a class because `<body>` is rendered by a client
 * component (`ThemeBody`) and `styles.css` already owns the body `font-family`. The
 * variable lands on `<html>`; the stylesheet reads it.
 */
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

/**
 * Absolute base for `og:image` and `twitter:image`. Without it Next falls back to
 * `https://${VERCEL_URL}` — the *deployment-specific* hostname, which changes on every
 * push and 404s once that deployment is pruned. `VERCEL_PROJECT_PRODUCTION_URL` is the
 * production alias (and becomes the custom domain the moment one is attached), so the
 * card keeps resolving. Set at build time by Vercel; localhost is the local fallback.
 */
const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Fanation — Turn your audience into a community that pays you back",
  description: "Fanation creator platform — subscriptions, PPV, live gifting, and messaging.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <ThemeBody>{children}</ThemeBody>
    </html>
  );
}
