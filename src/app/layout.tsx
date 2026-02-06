import type { Metadata } from "next";
import Script from "next/script";
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
import { PreconnectDomains } from "@/components/seo/SeoEnhancements";
import { seoConfig } from "@/lib/seo/config";
import WebVitals from "@/components/analytics/WebVitals";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

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

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  manifest: "/manifest.json",

  // Additional SEO improvements
  applicationName: "Plotzed Real Estate",
  keywords: seoConfig.keywords.join(", "),
  authors: [{ name: seoConfig.business.name }],
  creator: seoConfig.business.name,
  publisher: seoConfig.business.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Apple-specific
  appleWebApp: {
    capable: true,
    title: "Plotzed",
    statusBarStyle: "default",
  },

  // Verification (add your verification codes here when ready)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
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
        {/* Google Tag Manager - Head Script */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NMC55FN2');`}
        </Script>
        
        {/* Global SEO: Organization, Website, LocalBusiness schemas */}
        <GlobalSeo />
        {/* Preconnect to external domains for performance */}
        <PreconnectDomains />
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
        {/* Google Tag Manager (noscript) - Body */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NMC55FN2"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <GoogleAnalytics />
        <WebVitals />
        <RecaptchaProvider>
          <SessionProvider>{children}</SessionProvider>
        </RecaptchaProvider>
      </body>
    </html>
  );
}