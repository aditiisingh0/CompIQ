import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import KeepAlive from "@/components/KeepAlive";

export const metadata: Metadata = {
  title: "CompIQ — Compensation Intelligence",
  description:
    "Level-structured salary data for India and global tech. See what engineers actually make.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-text-primary font-body">
        <Nav />
        <KeepAlive />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}