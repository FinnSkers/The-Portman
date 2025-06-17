import type { Metadata } from "next";
import "@fontsource/press-start-2p";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portman - AI-Powered Career Tools",
  description:
    "Build your portfolio, optimize your resume, and get AI-driven career insights—all in a playful 8-bit world.",
  keywords: ["AI", "career tools", "portfolio", "resume", "8-bit", "retro"],
  authors: [{ name: "Portman Team" }],
  creator: "Portman Team",
  publisher: "Portman",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://portman.ai"),
  openGraph: {
    title: "Portman - AI-Powered Career Tools",
    description:
      "Build your portfolio, optimize your resume, and get AI-driven career insights—all in a playful 8-bit world.",
    url: "https://portman.ai",
    siteName: "Portman",
    images: [
      {
        url: "/8bitlogo.png",
        width: 800,
        height: 600,
        alt: "Portman - AI-Powered Career Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portman - AI-Powered Career Tools",
    description:
      "Build your portfolio, optimize your resume, and get AI-driven career insights—all in a playful 8-bit world.",
    images: ["/8bitlogo.png"],
    creator: "@portman_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/8bitlogo.png",
    shortcut: "/8bitlogo.png",
    apple: "/8bitlogo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased bg-black text-green-400 min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
