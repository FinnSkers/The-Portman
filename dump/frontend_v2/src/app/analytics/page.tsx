"use client";
import React from "react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 px-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:shadow-md transition-all"
          >
            <FaArrowLeft />
            Back to Home
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="px-4">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
