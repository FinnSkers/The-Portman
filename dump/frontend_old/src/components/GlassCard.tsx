"use client";
import React, { memo } from "react";

function GlassCard({ children, className = "", ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={`glass p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default memo(GlassCard);
