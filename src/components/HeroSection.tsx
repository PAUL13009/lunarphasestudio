"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const isAnimating = useRef(false);
  const progressRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const scrollableHeight = wrapperRef.current.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;
    const p = clamp(-rect.top / scrollableHeight, 0, 1);
    progressRef.current = p;
    setProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-snap: one scroll in phase 1 triggers full transition
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!wrapperRef.current || isAnimating.current) return;

      const scrollableHeight = wrapperRef.current.offsetHeight - window.innerHeight;
      const wrapperTop = wrapperRef.current.offsetTop;
      const p = progressRef.current;

      // Phase 1 (splash): scroll down → snap to hero finale
      if (p < 0.1 && e.deltaY > 0) {
        e.preventDefault();
        isAnimating.current = true;
        window.scrollTo({
          top: wrapperTop + scrollableHeight,
          behavior: "smooth",
        });
        setTimeout(() => {
          isAnimating.current = false;
        }, 1200);
      }

      // Hero finale: scroll up → snap back to splash
      if (p > 0.9 && p <= 1 && e.deltaY < 0) {
        const pastHero = window.scrollY > wrapperTop + scrollableHeight + 10;
        if (!pastHero) {
          e.preventDefault();
          isAnimating.current = true;
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setTimeout(() => {
            isAnimating.current = false;
          }, 1200);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Interpolations based on scroll progress ---

  const insetTop = lerp(28, 0, progress);
  const insetBottom = lerp(18, 0, progress);
  const insetX = lerp(20, 0, progress);
  const borderRadius = lerp(12, 0, progress);
  const clipPath = `inset(${insetTop}% ${insetX}% ${insetBottom}% ${insetX}% round ${borderRadius}px)`;

  const overlayOpacity = clamp((progress - 0.5) / 0.5, 0, 0.35);

  const splashOpacity = clamp(1 - progress / 0.4, 0, 1);
  const splashTranslateY = lerp(0, -30, clamp(progress / 0.4, 0, 1));

  const heroOpacity = clamp((progress - 0.65) / 0.35, 0, 1);
  const heroTranslateY = lerp(25, 0, clamp((progress - 0.65) / 0.35, 0, 1));

  const bgWhiteOpacity = clamp(1 - progress / 0.6, 0, 1);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "250vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* White background that fades out */}
        <div
          className="absolute inset-0 bg-white"
          style={{ opacity: bgWhiteOpacity }}
        />

        {/* Full-size image revealed by animated clip-path */}
        <div className="absolute inset-0" style={{ clipPath }}>
          <Image
            src="/Skyline_Marina_Bay_Singapore.jpg"
            alt="Deep Night Studio"
            fill
            priority
            className="object-cover object-center"
            quality={90}
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </div>

        {/* ===== SPLASH CONTENT (fades out) ===== */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col"
          style={{
            opacity: splashOpacity,
            transform: `translateY(${splashTranslateY}px)`,
          }}
        >
          {/* Giant title */}
          <div className="flex-shrink-0 px-4 pt-4 lg:px-6 lg:pt-6">
            <h1 className="splash-title select-none font-bold uppercase leading-[0.85] tracking-tighter text-black">
              Deep Night
              <br />
              Studio
            </h1>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom splash text */}
          <div className="flex-shrink-0 px-6 pb-6 lg:px-10 lg:pb-8">
            <div className="flex items-end justify-end">
              <p className="max-w-xs text-right text-sm leading-relaxed text-black/60 lg:text-base">
                Driven by Vision, Centered on Craft,
                <br />
                Embracing Innovation
              </p>
            </div>
          </div>
        </div>

        {/* ===== HERO CONTENT (fades in) ===== */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-8 lg:px-10 lg:pb-10"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
          }}
        >
          <div className="pointer-events-auto mx-auto flex max-w-[1600px] items-end justify-end">
            <p className="max-w-sm text-right text-base leading-relaxed text-white/80 lg:text-lg">
              Driven by Vision, Centered on Craft,
              <br />
              Embracing Innovation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
