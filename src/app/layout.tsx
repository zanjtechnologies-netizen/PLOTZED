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
<<<<<<< HEAD
=======
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183

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

<<<<<<< HEAD
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
=======
// Root Layout
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en" className="scroll-smooth">
=======
    <html lang="en">
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
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
<<<<<<< HEAD
          <SessionProvider>{children}</SessionProvider>
=======
          <SessionProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </SessionProvider>
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
        </RecaptchaProvider>
      </body>
    </html>
  );
}
