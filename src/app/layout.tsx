import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pass Nexus | Premium Event Ticketing Platform",
  description: "The next generation of digital event management and QR pass generation.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: "FC9ifnmeRuLSZKFivlB5E3PDDb3ZBobo3cDy0uRAh4E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Providers>
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
