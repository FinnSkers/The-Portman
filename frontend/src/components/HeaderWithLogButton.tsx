"use client";
import React, { useState } from "react";
import FloatingLogButton from "@/components/FloatingLogButton";
import LogViewerModal from "@/components/LogViewerModal";

export default function HeaderWithLogButton({ children }: { children?: React.ReactNode }) {
  const [logOpen, setLogOpen] = useState(false);
  return (
    <>
      {children}
      <FloatingLogButton onClick={() => setLogOpen(true)} tooltip="View system logs" />
      <LogViewerModal open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}
