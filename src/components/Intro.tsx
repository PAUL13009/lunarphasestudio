"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const text = "Basé à Marseille, Deep Night Studio est un studio de Webdesign et de Stratégie Digitale. Nous créons des interfaces haute performance et des identités visuelles fortes pour des projets d'envergure, partout en France et à l'international.";

// Split into characters, preserving spaces
const chars = text.split("");
const totalChars = chars.length;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    const start = windowH * 0.9;
    const end = -sectionRef.current.offsetHeight * 0.5;
    const p = clamp((start - rect.top) / (start - end), 0, 1);
    setProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section ref={sectionRef} className="bg-black px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-center text-3xl font-bold uppercase leading-snug tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.15]" aria-label={text}>
          {chars.map((char, i) => {
            const charProgress = clamp(
              (progress - i / totalChars) * totalChars,
              0,
              1
            );
            const opacity = 0.15 + 0.85 * charProgress;
            return (
              <span
                key={i}
                style={{ opacity, color: "white" }}
              >
                {char}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
