import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Play Prague — Film Fest Schedule",
  description: "Interactive schedule (Oct 7–11, 2025) with filters, My Plan, and tickets.",
  themeColor: "#111827",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
