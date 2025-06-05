import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutShell from "@/components/ClientLayoutShell";
import HeaderWithLogButton from "@/components/HeaderWithLogButton";

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
        {/* Modern Header - improved alignment and branding */}
        <header className="w-full flex justify-center items-center px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-indigo-100 dark:border-indigo-900">
          <nav className="flex items-center justify-between w-full max-w-7xl mx-auto gap-8">
            <a
              href="/"
              className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight hover:opacity-90 transition logo-site"
              aria-label="PORTMAN Home"
            >
              <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mr-1 align-super tracking-widest" style={{fontSize:'0.7em', letterSpacing:'0.15em', textTransform:'uppercase'}}>the</span>
              <span className="font-extrabold tracking-tight text-2xl md:text-3xl text-indigo-600 dark:text-indigo-300">PORTMAN</span>
            </a>
            <ul className="flex items-center gap-8 text-base font-semibold text-gray-700 dark:text-gray-200">
              <li><a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Features</a></li>
              <li><a href="#templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Templates</a></li>
              <li><a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Testimonials</a></li>
              <li><a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">FAQ</a></li>
              <li><a href="#blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Blog</a></li>
            </ul>
            <div className="flex items-center gap-3">
              <a href="https://github.com/shajidtheportman/portman" target="_blank" rel="noopener" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" /></svg>
              </a>
              <a href="https://twitter.com/shajidtheportman" target="_blank" rel="noopener" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z" /></svg>
              </a>
            </div>
          </nav>
        </header>
        <ClientLayoutShell>
          {children}
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
      </body>
    </html>
  );
}
