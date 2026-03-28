import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import BottomNav from "@/components/BottomNav";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Gully Commerce",
  description: "Shopify for Indian street merchants",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gully",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${dmSans.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans select-none touch-pan-y active:bg-transparent">
          <main className="flex-1 flex flex-col pb-24">
            {children}
          </main>
          <BottomNav />
          <Toaster position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
