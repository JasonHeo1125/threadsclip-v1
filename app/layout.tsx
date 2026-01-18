import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ThreadClip - 쓰레드 아카이브 & 검색",
  description: "Threads 게시물을 저장하고 나중에 쉽게 검색하세요. Save and search your favorite Threads posts.",
  keywords: ["threads", "archive", "search", "bookmark", "쓰레드", "아카이브", "검색", "북마크"],
  authors: [{ name: "ThreadClip" }],
  openGraph: {
    title: "ThreadClip",
    description: "쓰레드 게시물을 저장하고 검색하세요",
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThreadClip",
    description: "쓰레드 게시물을 저장하고 검색하세요",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

      </head>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js')
                .catch(function(err) { console.error('SW registration failed:', err); });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
