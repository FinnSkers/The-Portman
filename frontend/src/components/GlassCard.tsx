"use client";
import React from "react";

export default function GlassCard({ children, className = "", ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={`glass p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
