import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PORTMAN - AI-Powered Career Platform",
  description: "Transform your career with AI-powered CV optimization, portfolio generation, and ATS analysis. Built for the future of professional development.",
  keywords: ["CV", "Resume", "Portfolio", "AI", "ATS", "Career", "Job Search", "Professional Development"],
  authors: [{ name: "PORTMAN Team" }],
  creator: "PORTMAN",
  publisher: "PORTMAN",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portman.ai",
    title: "PORTMAN - AI-Powered Career Platform",
    description: "Transform your career with AI-powered CV optimization, portfolio generation, and ATS analysis.",
    siteName: "PORTMAN",
  },
  twitter: {
    card: "summary_large_image",
    title: "PORTMAN - AI-Powered Career Platform",
    description: "Transform your career with AI-powered CV optimization, portfolio generation, and ATS analysis.",
    creator: "@portman_ai",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
