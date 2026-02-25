"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import RotatingText from "@/components/RotatingText";

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

  const heroRaw = clamp((progress - 0.65) / 0.35, 0, 1);
  const heroOpacity = heroRaw;
  const heroTranslateY = lerp(25, 0, heroRaw);
  const [heroTextVisible, setHeroTextVisible] = useState(false);

  useEffect(() => {
    if (heroRaw >= 1) {
      setHeroTextVisible(true);
    } else if (heroRaw < 0.5) {
      setHeroTextVisible(false);
    }
  }, [heroRaw]);

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
        </div>

        {/* ===== HERO CONTENT (fades in) ===== */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-8 lg:px-10 lg:pb-10"
          style={{
            opacity: heroTextVisible ? 1 : 0,
            transform: `translateY(${heroTranslateY}px)`,
          }}
        >
          <div className="pointer-events-auto mx-auto flex max-w-[1600px] flex-col items-end justify-end gap-6">
            {heroTextVisible && (
              <h2 className="max-w-3xl text-right text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-6xl">
                <RotatingText
                  texts={["Nous transformons vos idées en réalité digitale"]}
                  auto={false}
                  animatePresenceInitial={true}
                  splitBy="characters"
                  staggerFrom="first"
                  staggerDuration={0.02}
                  transition={{ type: "spring", damping: 30, stiffness: 200 }}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                />
              </h2>
            )}
            {heroTextVisible && (
              <p className="max-w-sm text-right text-base leading-relaxed text-white/80 lg:text-lg">
                <RotatingText
                  texts={["Driven by Vision, Centered on Craft,"]}
                  auto={false}
                  animatePresenceInitial={true}
                  splitBy="characters"
                  staggerFrom="first"
                  staggerDuration={0.02}
                  transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.25 }}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                />
                <br />
                <RotatingText
                  texts={["Embracing Innovation"]}
                  auto={false}
                  animatePresenceInitial={true}
                  splitBy="characters"
                  staggerFrom="first"
                  staggerDuration={0.02}
                  transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.45 }}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
