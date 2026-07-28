import type { Metadata } from "next";
import "@fanation/ui/src/styles.css";
import { ThemeBody } from "../components/theme";

export const metadata: Metadata = {
  title: "Fanation — Turn your audience into a community that pays you back",
  description: "Fanation creator platform — subscriptions, PPV, live gifting, and messaging.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Brand fonts — fail gracefully offline; system stack is the fallback. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <ThemeBody>{children}</ThemeBody>
    </html>
  );
}
