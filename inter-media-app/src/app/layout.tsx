import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers/Providers";
import ChatWidget from "@/components/chat/ChatWidget";
import { ToastProvider } from "@/components/providers/toast-provider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { BusinessSEO } from "@/components/seo/BusinessSEO";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: false
});

export const metadata: Metadata = {
  title: {
    default: "Inter Medi-A - Toko Printer, Fotocopy & Komputer Terpercaya",
    template: "%s | Inter Medi-A"
  },
  description: "Toko printer, fotocopy, dan komputer terpercaya di Jakarta. Jual printer Canon, Epson, HP, mesin fotocopy, laptop, komputer. Service bergaransi, harga terjangkau, pengiriman cepat.",
  keywords: [
    "toko printer jakarta",
    "jual printer canon epson hp",
    "mesin fotocopy jakarta", 
    "service printer jakarta",
    "toko komputer jakarta",
    "laptop murah jakarta",
    "printer inkjet laserjet",
    "tinta printer original",
    "spare part printer",
    "inter media jakarta"
  ],
  authors: [{ name: "Inter Medi-A" }],
  creator: "Inter Medi-A",
  publisher: "Inter Medi-A",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://inter-media-ihwxphe1d-saptos-projects-29b8c876.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Inter Medi-A - Toko Printer, Fotocopy & Komputer Terpercaya",
    description: "Toko printer, fotocopy, dan komputer terpercaya di Jakarta. Jual printer Canon, Epson, HP, mesin fotocopy, laptop, komputer. Service bergaransi, harga terjangkau.",
    url: '/',
    siteName: 'Inter Medi-A',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Inter Medi-A - Toko Printer & Komputer',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Inter Medi-A - Toko Printer, Fotocopy & Komputer",
    description: "Toko printer, fotocopy, dan komputer terpercaya di Jakarta. Service bergaransi, harga terjangkau.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <meta name="google-site-verification" content="bxCxl1excnh39afDaUA2a_iIdQRsjm1zsMWVMfGpAUg" />
        <BusinessSEO />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <ToastProvider />
        </Providers>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
