"use client";
import React, { HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  blur?: "sm" | "md" | "lg" | "xl";
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = true,
  gradient = false,
  blur = "md",
  ...rest
}) => {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md", 
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl"
  };

  return (
    <motion.div
      {...rest}
      className={cn(
        "relative rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl",
        blurClasses[blur],
        gradient && "bg-gradient-to-br from-white/10 to-white/5",
        hover && "hover:bg-white/10 hover:border-white/20 transition-all duration-300",
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
