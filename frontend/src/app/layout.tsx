import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PORTMAN - AI-Powered Career Platform",
  description: "Transform your career journey with PORTMAN's cutting-edge AI technology. Upload CVs, get intelligent insights, benchmark against industry standards, and generate stunning portfolios.",
  keywords: ["AI", "career", "CV", "resume", "portfolio", "professional", "job search", "analytics"],
  authors: [{ name: "PORTMAN Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
