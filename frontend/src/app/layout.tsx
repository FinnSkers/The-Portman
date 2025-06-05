import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutShell from "@/components/ClientLayoutShell";
import HeaderNavClient from "@/components/HeaderNavClient";
import FloatingChatTip, { FloatingProTip } from "@/components/FloatingChatTip";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PORTMAN - AI-Powered Portfolio Creator | Transform Your CV into a Professional Website",
  description: "Create stunning, responsive portfolio websites from your CV using advanced AI. PORTMAN leverages DeepSeek AI and RAG technology to transform your resume into a professional online presence.",
  keywords: "portfolio creator, CV to website, AI portfolio, professional website, resume builder, portfolio maker, AI-powered, responsive design",
  authors: [{ name: "PORTMAN Team" }],
  creator: "PORTMAN",
  publisher: "PORTMAN",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://portman.ai'),
  openGraph: {
    title: "PORTMAN - AI-Powered Portfolio Creator",
    description: "Transform Your CV into a Professional Website with AI",
    url: 'https://portman.ai',
    siteName: 'PORTMAN',
    images: [
      {
        url: '/portfolio-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PORTMAN - AI Portfolio Creator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PORTMAN - AI-Powered Portfolio Creator",
    description: "Transform Your CV into a Professional Website with AI",
    images: ['/portfolio-og-image.jpg'],
    creator: '@portmanai',
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />
        <SessionProviderWrapper>
          {/* Modern Header - improved alignment and branding */}
          <header className="w-full flex justify-center items-center px-4 md:px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-indigo-100 dark:border-indigo-900">
            <HeaderNavClient />
          </header>
          <ClientLayoutShell>
            <div className="relative z-0">
              {children}
            </div>
          </ClientLayoutShell>
          {/* Modern Footer */}
          <footer className="w-full border-t border-indigo-100 dark:border-indigo-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-12 mt-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-8">
              <div className="flex flex-col items-start gap-2 text-indigo-600 dark:text-indigo-300 font-bold text-lg logo-site">
                <span className="flex items-center gap-1">
                  <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mr-1 align-super tracking-widest" style={{fontSize:'0.7em', letterSpacing:'0.15em', textTransform:'uppercase'}}>the</span>
                  <span className="font-extrabold tracking-tight text-lg md:text-2xl text-indigo-600 dark:text-indigo-300">PORTMAN</span>
                </span>
                <span className="text-xs text-gray-400 font-normal">
                  AI Portfolio Generator
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <a
                    href="#features"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    Features
                  </a>
                  <a
                    href="#templates"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    Templates
                  </a>
                  <a
                    href="#testimonials"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    Testimonials
                  </a>
                  <a
                    href="#faq"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    FAQ
                  </a>
                  <a
                    href="#blog"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    Blog
                  </a>
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300 md:ml-8">
                  <a
                    href="mailto:hello@portman.ai"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    Contact
                  </a>
                  <a
                    href="https://github.com/shajidtheportman/portman"
                    target="_blank"
                    rel="noopener"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://twitter.com/shajidtheportman"
                    target="_blank"
                    rel="noopener"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    Twitter
                  </a>
                </div>
              </div>
              <form className="flex flex-col md:flex-row gap-2 items-center">
                <input
                  type="email"
                  placeholder="Join our newsletter"
                  className="px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-700 bg-white/60 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition text-sm"
                >
                  Subscribe
                </button>
              </form>
              <div className="text-xs text-gray-400 mt-4 md:mt-0 text-center md:text-right w-full md:w-auto">
                &copy; {new Date().getFullYear()} PORTMAN. All rights reserved.
              </div>
            </div>
          </footer>
          {/* Floating Chat and Pro Tip Buttons - always on top */}
          <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
            <div className="pointer-events-auto">
              <FloatingChatTip />
            </div>
            <div className="pointer-events-auto">
              <FloatingProTip />
            </div>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
