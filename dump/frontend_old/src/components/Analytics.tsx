"use client";
import Script from "next/script";

export default function Analytics() {
  return (
    <>
      {/* Plausible Analytics Example */}
      <Script
        strategy="afterInteractive"
        data-domain="yourdomain.com"
        src="https://plausible.io/js/plausible.js"
      />
      {/* Google Analytics Example (uncomment to use) */}
      {/*
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>
      */}
    </>
  );
}
