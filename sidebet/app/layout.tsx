import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SideBet — Wanna bet?!",
  description: "Friend-to-friend wagers on anything. Powered by Fable 5.",
};

export const viewport: Viewport = {
  themeColor: "#2E2A8E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-text">{children}</body>
    </html>
  );
}
