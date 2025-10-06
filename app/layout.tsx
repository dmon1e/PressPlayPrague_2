import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Press Play Prague — Film Fest Schedule",
  description: "Interactive schedule (Oct 7–11, 2025) with filters, My Plan, and tickets.",
  // ❌ remove themeColor from here
};

export const viewport: Viewport = {
  themeColor: "#111827", // ✅ move it here
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

