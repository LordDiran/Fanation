import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fanation/ui/src/styles.css";
import { AdminBody } from "../components/admin-chrome";

/**
 * Same call as the landing site and the fan app — one typeface across all three surfaces.
 * `next/font` downloads Inter at build time and serves it from our own origin, so there
 * is no runtime request to Google or Fontshare and no flash of fallback text.
 *
 * Exposed as a CSS variable rather than a class because `<body>` is rendered by a client
 * component (`AdminBody`) and `styles.css` already owns the body `font-family`.
 */
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Fanation Admin",
  description: "Fanation admin console — users, KYC, moderation, finance, payouts, audit.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <AdminBody>{children}</AdminBody>
    </html>
  );
}
