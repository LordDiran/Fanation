import type { Metadata } from "next";
import "@fanation/ui/src/styles.css";
import { AdminBody } from "../components/admin-chrome";

export const metadata: Metadata = {
  title: "Fanation Admin",
  description: "Fanation admin console — users, KYC, moderation, finance, payouts, audit.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <AdminBody>{children}</AdminBody>
    </html>
  );
}
