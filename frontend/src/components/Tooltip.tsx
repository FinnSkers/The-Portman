// Accessible Tooltip component for info icons and field explanations
import React, { useState, useRef } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className }) => {
  const [visible, setVisible] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const id = useRef("tooltip-" + Math.random().toString(36).substr(2, 9));

  const show = () => {
    timeout.current = setTimeout(() => setVisible(true), 100);
  };
  const hide = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setVisible(false);
  };

  return (
    <span className={"relative inline-block " + (className || "")}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={0}
      aria-describedby={id.current}
      role="button"
      style={{ outline: "none" }}
    >
      {children}
      {visible && (
        <span
          id={id.current}
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs shadow-lg whitespace-pre-line min-w-[120px] max-w-xs"
          style={{ top: "100%" }}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
