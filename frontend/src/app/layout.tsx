import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Full-Stack App",
  description: "Full-Stack Authentication Flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} h-screen bg-gradient-to-b from-white to-[#d6dbdc]`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
