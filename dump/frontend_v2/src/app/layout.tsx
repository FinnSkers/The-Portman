import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { EnvironmentInitializer } from "@/components/environment-initializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PORTMAN - AI-Powered Portfolio Creator",
  description: "Transform your CV into a stunning portfolio with AI-powered insights and professional templates",
  keywords: ["portfolio", "CV", "resume", "AI", "career", "professional"],
  authors: [{ name: "PORTMAN Team" }],
  openGraph: {
    title: "PORTMAN - AI-Powered Portfolio Creator",
    description: "Transform your CV into a stunning portfolio with AI-powered insights",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background`}>
        <EnvironmentInitializer />
        <ErrorBoundary>
          <Providers>
            <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-background/95 to-muted/20">
              <Navigation />
              <main className="flex-1 pt-16">
                {children}
              </main>
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
