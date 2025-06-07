"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxSection({
  children,
  background,
  speed = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  background?: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [offsetTop, setOffsetTop] = useState(0);

  useEffect(() => {
    function handleResize() {
      if (ref.current) {
        setOffsetTop(ref.current.offsetTop);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const y = useTransform(scrollY, [offsetTop - 500, offsetTop + 500], [0, -200 * speed]);

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`} style={{ minHeight: 400 }}>
      {background && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y }}
          aria-hidden
        >
          {background}
        </motion.div>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] w-full px-4 md:px-0">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </div>
    </section>
  );
}
