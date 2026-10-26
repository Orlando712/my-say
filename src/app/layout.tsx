import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MySay - Photo-Grounded Speech Board",
  description:
    "A photo-grounded communication board for people who find speaking difficult at shop counters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f7f6f2] font-sans text-stone-900">
        {children}
      </body>
    </html>
  );
}
