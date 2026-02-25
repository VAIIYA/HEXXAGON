import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hexxagon (Rubies vs Pearls)",
  description: "Play Hexxagon, the addictive game of rubies vs diamonds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <WalletContextProvider>
          <div className="app-container">
            <Header />
            <div className="main-content">
              {children}
            </div>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
