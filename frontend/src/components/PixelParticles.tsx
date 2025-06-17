"use client";
import { useEffect, useRef } from "react";

const colors = ["#39ff14", "#ff00a8", "#00e1ff", "#fff700"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PixelParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const particles = Array.from({ length: 60 }, () => ({
      x: randomInt(0, window.innerWidth),
      y: randomInt(0, window.innerHeight),
      size: randomInt(4, 10),
      color: colors[randomInt(0, colors.length - 1)],
      speedY: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
    }));

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > window.innerHeight) {
          p.y = -p.size;
          p.x = randomInt(0, window.innerWidth);
        }
        if (p.x < 0 || p.x > window.innerWidth) {
          p.x = randomInt(0, window.innerWidth);
        }
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
