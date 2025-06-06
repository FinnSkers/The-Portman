"use client";
import React, { memo } from "react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

function FloatingLogButton({ onClick, tooltip }: { onClick: () => void; tooltip?: string }) {
  return (
    <button
      className="fixed bottom-8 right-8 z-50 bg-gray-900 hover:bg-indigo-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-all duration-200 group focus:outline-none focus:ring-4 focus:ring-indigo-300"
      onClick={onClick}
      aria-label={tooltip || "View Logs"}
    >
      <DocumentMagnifyingGlassIcon className="w-8 h-8" />
      {tooltip && (
        <span className="absolute bottom-20 right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {tooltip}
        </span>
      )}
    </button>
  );
}

export default memo(FloatingLogButton);
