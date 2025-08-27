import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CashHandle Token Store",
  description: "Trade tokens based on HandCash handles with dividend potential",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
        <Providers>
          <div className="min-h-screen">
            <NavBar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
