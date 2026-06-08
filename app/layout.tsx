import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SideDock from "@/components/SideDock";
import MobileBottomNav from "@/components/MobileBottomNav";
import CustomCursor from "@/components/CustomCursor";
import SocialButtons from "@/components/SocialButtons";
import BackToTop from "@/components/BackToTop";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AniByte ❤ — Discover Anime",
  description: "Your ultimate anime discovery platform. Watch, track, and discover anime for free.",
  icons: {
    icon: "/founder-icon.png",
    apple: "/founder-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.variable} min-h-full flex flex-col bg-[#050505] pb-16 lg:pb-0`}>
        <AuthProvider>
          <CustomCursor />
          <Navbar />
          <SideDock />
          <main className="flex-1 lg:ml-12">{children}</main>
          <Footer />
          <MobileBottomNav />
          <SocialButtons />
          <BackToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
