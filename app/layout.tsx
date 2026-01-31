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
  title: "AI Development & Training | Custom AI Solutions | BonusThoughts",
  description: "Forward deployed AI engineers who build your AI ideas. Plus on-site AI training for Claude, GPT-4, Gemini. Agents, RAG systems, LLM apps. 2-8 week delivery.",
  keywords: ["AI development agency", "custom AI solutions", "AI training", "Claude training", "GPT-4 training", "Gemini training", "AI agents development", "RAG system development", "LLM application development", "AI integration services", "forward deployed engineers", "corporate AI training"],
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
    title: "AI Development Agency | Build Your AI Ideas",
    description: "Forward deployed engineers who build custom AI solutions. Agents, RAG, LLM apps. 2-8 weeks.",
    images: [
      {
        url: "https://bonusthoughts.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "BonusThoughts - AI Development Agency",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Development Agency | Custom AI Solutions | BonusThoughts",
    description: "Forward deployed AI engineers who build your AI ideas. Agents, RAG systems, LLM apps. 2-8 week delivery.",
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
