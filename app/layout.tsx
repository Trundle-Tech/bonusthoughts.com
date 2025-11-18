import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Program Director | Executive Teams | BonusThoughts",
  description: "Veteran-led AI Program Director for executives with teams but no velocity. Direct your AI initiatives like military operations—10-16 weeks instead of 18 months. Former NGA architect. TS/SCI cleared.",
  keywords: ["AI program director", "AI consultant", "AI strategy", "executive AI", "AI implementation", "NGA", "SDVOSB", "veteran-owned"],
  authors: [{ name: "BonusThoughts" }],
  creator: "BonusThoughts",
  publisher: "BonusThoughts",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  metadataBase: new URL("https://bonusthoughts.com"),
  alternates: {
    canonical: "https://bonusthoughts.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bonusthoughts.com",
    siteName: "BonusThoughts",
    title: "AI Program Director | Executive Teams",
    description: "Veteran-led AI Program Director for executives with teams but no velocity. Direct your AI initiatives like military operations—10-16 weeks instead of 18 months.",
    images: [
      {
        url: "https://bonusthoughts.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "BonusThoughts - AI Program Director",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Program Director | Executive Teams | BonusThoughts",
    description: "Former NGA architect. Direct your AI initiatives like military operations. 10-16 weeks instead of 18 months.",
    creator: "@nlynch_ai",
    images: ["https://bonusthoughts.com/og-image.png"],
  },
  verification: {
    google: "", // Add Google Search Console verification code here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-Z92LYYX56T" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
