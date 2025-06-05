"use client";
import React, { useRef, useEffect } from "react";

export default function AnimatedParticles({
  className = "",
  color = "#6366f1",
  count = 60,
}: {
  className?: string;
  color?: string;
  count?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    // Responsive canvas
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = 400;
    }
    resize();
    window.addEventListener("resize", resize);
    // Enhanced particles: depth, blur, speed
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (canvas?.width || 800),
      y: Math.random() * (canvas?.height || 400),
      r: Math.random() * 2 + 1 + Math.random() * 3, // more size variety
      dx: (Math.random() - 0.5) * (0.5 + Math.random()),
      dy: (Math.random() - 0.5) * (0.5 + Math.random()),
      blur: Math.random() * 2,
      alpha: 0.5 + Math.random() * 0.5,
      z: Math.random(),
    }));
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        if (p.blur > 0) ctx.shadowBlur = p.blur * 4;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.restore();
        p.x += p.dx * (0.5 + p.z);
        p.y += p.dy * (0.5 + p.z);
        if (canvas && (p.x < 0 || p.x > canvas.width)) p.dx *= -1;
        if (canvas && (p.y < 0 || p.y > canvas.height)) p.dy *= -1;
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [color, count]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
