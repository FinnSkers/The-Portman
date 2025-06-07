import React, { memo } from "react";

function ProfileProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-4">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-green-400 transition-all duration-700"
        style={{ width: `${percent}%` }}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}

export default memo(ProfileProgressBar);
