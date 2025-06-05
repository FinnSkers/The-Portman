"use client";
import React, { useState } from "react";
import Analytics from "@/components/Analytics";

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
