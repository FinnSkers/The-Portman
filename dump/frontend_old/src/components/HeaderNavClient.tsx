"use client";
import React, { memo } from "react";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

function HeaderNavClient() {
  const [navOpen, setNavOpen] = useState(false);
  const { data: session, status } = useSession();
  return (
    <nav className="flex items-center justify-between w-full max-w-7xl mx-auto gap-4 md:gap-8" aria-label="Main navigation">
      <a
        href="/"
        className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight hover:opacity-90 transition logo-site"
        aria-label="PORTMAN Home"
      >
        <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mr-1 align-super tracking-widest" style={{fontSize:'0.7em', letterSpacing:'0.15em', textTransform:'uppercase'}}>the</span>
        <span className="font-extrabold tracking-tight text-2xl md:text-3xl text-indigo-600 dark:text-indigo-300">PORTMAN</span>
      </a>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={navOpen}
        aria-controls="main-nav-menu"
        onClick={() => setNavOpen((v) => !v)}
      >
        <span className="sr-only">{navOpen ? "Close menu" : "Open menu"}</span>
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {navOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>      {/* Desktop nav */}      <ul id="main-nav-menu" className={`fixed md:static top-16 left-0 w-full md:w-auto bg-white/95 dark:bg-gray-900/95 md:bg-transparent md:dark:bg-transparent shadow-lg md:shadow-none flex-col md:flex-row gap-6 md:gap-8 text-base font-semibold text-gray-700 dark:text-gray-200 md:flex transition-all duration-300 z-40 ${navOpen ? 'flex' : 'hidden md:flex'}`} role="menu">
        <li><a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition block py-3 md:py-0 px-6 md:px-0" role="menuitem" tabIndex={navOpen ? 0 : -1}>Features</a></li>
        <li><a href="/portfolio" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition block py-3 md:py-0 px-6 md:px-0" role="menuitem" tabIndex={navOpen ? 0 : -1}>Portfolio</a></li>
        <li><a href="/ats-resume" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition block py-3 md:py-0 px-6 md:px-0" role="menuitem" tabIndex={navOpen ? 0 : -1}>ATS Resume</a></li>
        <li><a href="/analytics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition block py-3 md:py-0 px-6 md:px-0" role="menuitem" tabIndex={navOpen ? 0 : -1}>Analytics</a></li>
        <li><a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition block py-3 md:py-0 px-6 md:px-0" role="menuitem" tabIndex={navOpen ? 0 : -1}>Testimonials</a></li>
        <li><a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition block py-3 md:py-0 px-6 md:px-0" role="menuitem" tabIndex={navOpen ? 0 : -1}>FAQ</a></li>
      </ul>
      <div className="flex items-center gap-3">
        <a href="https://github.com/FinnSkers/The-Portman" target="_blank" rel="noopener" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="GitHub">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" /></svg>
        </a>
        <a href="https://twitter.com/shajidtheportman" target="_blank" rel="noopener" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="Twitter">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z" /></svg>
        </a>
        {status === "loading" ? (
          <button
            className="px-4 py-2 rounded bg-indigo-400 text-white font-semibold shadow text-sm flex items-center gap-2 cursor-not-allowed opacity-60"
            disabled
          >
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Loading...
          </button>
        ) : session ? (
          <div className="flex items-center gap-2">
            {session.user?.image && (
              <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full border border-indigo-300 shadow" />
            )}
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{session.user?.name || session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="ml-2 px-3 py-1 rounded bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-700 text-xs font-semibold transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => window.location.href = "/login"}
            className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

export default memo(HeaderNavClient);
