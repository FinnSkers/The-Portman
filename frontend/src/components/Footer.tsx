import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-black/90 glass border-t border-green-400 py-8 flex flex-col md:flex-row md:justify-between items-center text-center text-green-300 font-sans text-sm px-6 gap-4">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 mb-2 md:mb-0">        <div className="relative h-8 w-8">
          <Image
            src="/8bitlogo.svg"
            alt="Portman Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-8bit text-green-400 text-lg tracking-wider">
          Portman
        </span>
      </div>
      {/* Navigation Links */}
      <nav className="flex flex-wrap gap-4 mb-2 md:mb-0">
        <Link
          href="/"
          className="hover:text-pink-400 transition-colors"
        >
          Home
        </Link>
        <Link
          href="#features"
          className="hover:text-pink-400 transition-colors"
        >
          Features
        </Link>
        <Link
          href="#testimonials"
          className="hover:text-pink-400 transition-colors"
        >
          Testimonials
        </Link>
        <Link
          href="#portfolios"
          className="hover:text-pink-400 transition-colors"
        >
          Portfolios
        </Link>
        <Link
          href="#dashboard"
          className="hover:text-pink-400 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="#profile"
          className="hover:text-pink-400 transition-colors"
        >
          Profile
        </Link>
      </nav>
      {/* Social Links */}
      <div className="flex gap-3 mb-2 md:mb-0">
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="hover:text-pink-400 transition-colors"
        >
          Twitter
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-pink-400 transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-pink-400 transition-colors"
        >
          LinkedIn
        </a>
      </div>
      {/* Legal & Copyright */}
      <div className="flex flex-col items-center md:items-end gap-1">
        <span>&copy; {new Date().getFullYear()} Portman. All rights reserved.</span>
        <span>
          Built with{" "}
          <span className="text-pink-400">♥</span> by the Portman Team.
        </span>
        <Link
          href="/privacy"
          className="hover:text-pink-400 transition-colors underline"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="hover:text-pink-400 transition-colors underline"
        >
          Terms of Service
        </Link>
        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="mt-1 px-3 py-1 font-8bit text-green-400 border border-green-400 rounded hover:bg-green-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Back to top"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
