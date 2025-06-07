"use client";
import React, { useState, memo } from "react";
import FloatingLogButton from "@/components/FloatingLogButton";
import LogViewerModal from "@/components/LogViewerModal";

function HeaderWithLogButton({ children }: { children?: React.ReactNode }) {
  const [logOpen, setLogOpen] = useState(false);
  return (
    <>
      {children}
      <FloatingLogButton onClick={() => setLogOpen(true)} tooltip="View system logs" />
      <LogViewerModal open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}

export default memo(HeaderWithLogButton);
