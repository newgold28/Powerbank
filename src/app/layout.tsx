import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { site } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "AbiWande Events & Concierge | Event Planning in Manchester",
    template: "%s | AbiWande Events & Concierge",
  },
  description: site.description,
  keywords: [
    "event planner Manchester",
    "wedding planner Manchester",
    "Nigerian wedding planner UK",
    "concierge services Manchester",
    "African events Manchester",
    "corporate events Manchester",
    "birthday parties Manchester",
    "Amala and Gbegiri catering",
    "Afro DJ Manchester",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: site.name,
    title: "AbiWande Events & Concierge",
    description: site.hero,
    images: ["/images/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AbiWande Events & Concierge",
    description: site.hero,
    images: ["/images/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFCF7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}