import type { Metadata, Viewport } from "next";
import { Outfit, Inter, Noto_Sans_Devanagari, Public_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["900"],
});

const noto = Noto_Sans_Devanagari({
  variable: "--font-noto",
  subsets: ["devanagari"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Gully Commerce | Pro Social Selling",
    template: "%s | Gully Commerce",
  },
  description: "Advanced social commerce platform for Bharat. Simplified, fast, and powerful.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gully Commerce",
  },
  openGraph: {
    type: "website",
    siteName: "Gully Commerce",
    title: "Gully Commerce | Pro Social Selling",
    description: "The fastest way for social sellers in Bharat to list and scale. Built for WhatsApp.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gully Commerce - Pro Social Selling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gully Commerce | Pro Social Selling",
    description: "The fastest way for social sellers in Bharat to list and scale.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#3f4eae",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import AuthGuard from "@/components/AuthGuard";
import LayoutWrapper from "@/components/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${noto.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col font-inter bg-slate-100 antialiased`}>
        <AuthGuard>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthGuard>
      </body>
    </html>
  );
}
