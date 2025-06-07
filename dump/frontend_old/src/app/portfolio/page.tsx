"use client";
import React from "react";
import GlassCard from "@/components/GlassCard";
import PortfolioGenerator from "@/components/PortfolioGenerator";
import { useCVStore } from "@/store/useCVStore";
import { useRouter } from "next/navigation";

export default function PortfolioPage() {
  const { data } = useCVStore();
  const router = useRouter();

  const handleGoAnalysis = () => router.push("/analysis");

  if (!data) return (
    <GlassCard className="max-w-2xl mx-auto mt-16 p-8 text-center">
      <div className="text-red-600 font-semibold mb-4">No CV data found. Please upload your CV first.</div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => router.push("/")}>Go Back</button>
    </GlassCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 py-8">
      {/* Header with navigation */}
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Portfolio Generator</h1>
          <div className="flex gap-3">
            <button className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition" onClick={() => router.push("/")}>Back to Upload</button>
            <button className="px-5 py-2 rounded-lg bg-purple-500 text-white font-semibold shadow hover:bg-purple-600 transition" onClick={() => router.push("/ats-resume")}>ATS Resume</button>
            <button className="px-5 py-2 rounded-lg bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition" onClick={handleGoAnalysis}>View Analysis</button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Create stunning portfolio websites from your CV data</p>
      </div>

      {/* Portfolio Generator */}
      <PortfolioGenerator />
    </div>
  );
}
