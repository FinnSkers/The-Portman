import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">Privacy Policy</h1>
      <p className="mb-4">PORTMAN is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights regarding your information.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">What We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Your account information (name, email, password hash)</li>
        <li>Uploaded CVs and portfolio data</li>
        <li>Usage analytics (anonymized)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Your Data</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To provide and improve the PORTMAN service</li>
        <li>To personalize your experience and portfolio</li>
        <li>To comply with legal obligations</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">Your Rights</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Export your data at any time (see your profile page)</li>
        <li>Delete your account and all associated data</li>
        <li>Contact us for any privacy-related requests</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p className="mb-4">For privacy questions, email <a href="mailto:hello@portman.ai" className="text-indigo-600 underline">hello@portman.ai</a>.</p>
      <p className="text-xs text-gray-400 mt-8">This policy may be updated. Last updated: June 2025.</p>
    </div>
  );
}
