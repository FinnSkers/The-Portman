import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ModernStatusPopup from "@/components/ModernStatusPopup";
import ThemeToggle from "../components/ThemeToggle";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PORTMAN - AI-Powered Career Platform",
  description: "Transform your career journey with PORTMAN's cutting-edge AI technology. Upload CVs, get intelligent insights, benchmark against industry standards, and generate stunning portfolios.",
  keywords: ["AI", "career", "CV", "resume", "portfolio", "professional", "job search", "analytics"],
  authors: [{ name: "PORTMAN Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ThemeToggle />
          <ModernStatusPopup/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
