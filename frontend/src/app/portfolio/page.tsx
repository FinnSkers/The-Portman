"use client";
import React from "react";
import GlassCard from "@/components/GlassCard";
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

  // Placeholder for portfolio creation UI
  return (
    <GlassCard className="max-w-3xl mx-auto mt-12 p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Portfolio Maker</h2>
      <div className="mb-6 text-zinc-700 dark:text-zinc-200">
        <p>Welcome to the Portfolio Maker! Here you will soon be able to customize and generate your personal portfolio website based on your CV data.</p>
        <p className="mt-2">(This page is under construction. Stay tuned for more features!)</p>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition" onClick={() => router.push("/")}>Back to Upload</button>
        <button className="px-5 py-2 rounded-lg bg-purple-500 text-white font-semibold shadow hover:bg-purple-600 transition" onClick={handleGoAnalysis}>View Analysis</button>
      </div>
    </GlassCard>
  );
}
