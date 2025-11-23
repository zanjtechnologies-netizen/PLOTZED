import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Libre_Baskerville,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";
import { GlobalSeo } from "@/components/seo";
import { seoConfig } from "@/lib/seo/config";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Root Layout Metadata (fallback for pages without metadata)
export const metadata: Metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.description,
};

// Root Layout - Minimal, provides only essentials
// Header/Footer are added by (main) group layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Global SEO: Organization, Website, LocalBusiness schemas */}
        <GlobalSeo />
      </head>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${libreBaskerville.variable}
          ${playfairDisplay.variable}
          antialiased bg-[#0C1A3D] text-white
        `}
      >
        <RecaptchaProvider>
          <SessionProvider>{children}</SessionProvider>
        </RecaptchaProvider>
      </body>
    </html>
  );
}
