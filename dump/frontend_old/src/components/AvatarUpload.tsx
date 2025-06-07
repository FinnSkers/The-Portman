"use client";
import React, { memo, useRef } from "react";

function AvatarUpload({ avatarUrl, onChange }: { avatarUrl?: string; onChange: (file: File) => void }) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative group">
        <img
          src={avatarUrl || "/icon-192x192.png"}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-4 border-indigo-300 shadow-lg object-cover bg-white dark:bg-gray-800"
        />
        <button
          type="button"
          className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => fileInput.current?.click()}
          aria-label="Change avatar"
        >
          <span className="text-lg">✏️</span>
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files[0]) onChange(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
}

export default memo(AvatarUpload);
