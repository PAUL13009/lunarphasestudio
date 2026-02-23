"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import Header from "@/components/Header";
import RotatingText from "@/components/RotatingText";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const values = [
  {
    title: "Vision",
    description:
      "Chaque projet commence par une vision claire. Nous croyons que le design a le pouvoir de transformer les idées en expériences mémorables qui marquent les esprits.",
  },
  {
    title: "Craft",
    description:
      "Le détail fait la différence. Nous apportons un soin artisanal à chaque pixel, chaque animation, chaque interaction pour atteindre un niveau d'excellence qui nous définit.",
  },
  {
    title: "Innovation",
    description:
      "Nous repoussons les limites du web en adoptant les technologies les plus performantes et les approches créatives les plus audacieuses pour des résultats qui surprennent.",
  },
];

const stats = [
  {
    numericValue: 27,
    suffix: "+",
    label: "Projets livrés",
    color: "#1a1a2e",
  },
  {
    numericValue: 15,
    suffix: "+",
    label: "Clients actifs",
    color: "#16213e",
  },
  {
    numericValue: 3,
    suffix: "",
    label: "Années d'expérience",
    color: "#0f3460",
  },
  {
    numericValue: 100,
    suffix: "%",
    label: "Sur mesure",
    color: "#1a1a40",
  },
];

const aboutParagraphs = [
  {
    text: "Nous abordons chaque mission avec une discipline stratégique et une précision opérationnelle absolue.",
    align: "text-left",
  },
  {
    text: "Chaque recommandation, chaque design, chaque ligne de code est le fruit d'une analyse profonde et de standards sans compromis.",
    align: "text-right",
  },
  {
    text: "Nous ne nous contentons pas de solutions conventionnelles. Nous bâtissons des architectures digitales qui redéfinissent les marchés et créent un avantage concurrentiel durable.",
    align: "text-left",
  },
];

function StatBar({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        backgroundColor: stat.color,
        height: open ? "200px" : "80px",
      }}
    >
      <div className="relative flex h-[80px] items-center px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <span
            className="text-lg text-white/70 transition-transform duration-500"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ↓
          </span>
          <span className="text-2xl font-bold uppercase text-white lg:text-3xl">
            {stat.label}
          </span>
        </div>
        <span
          className="absolute top-1/2 -translate-y-1/2 text-6xl font-black text-white/30 lg:text-8xl"
          style={{ left: `${30 + index * 15}%` }}
        >
          {String(index + 1).padStart(4, "0")}
        </span>
      </div>
      <div
        className="px-6 pl-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:px-10 lg:pl-20"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-10px)",
        }}
      >
        {open && (
          <CountUp
            to={stat.numericValue}
            from={0}
            duration={1.5}
            suffix={stat.suffix}
            className="text-5xl font-black text-white lg:text-7xl"
          />
        )}
      </div>
    </div>
  );
}

function CtaReveal() {
  const ctaRef = useRef<HTMLElement>(null);
  const [ctaHeight, setCtaHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (ctaRef.current) setCtaHeight(ctaRef.current.offsetHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      <div style={{ height: ctaHeight }} />
      <section
        ref={ctaRef}
        className="fixed bottom-0 left-0 z-0 flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] px-6"
      >
        <div className="mx-auto max-w-[1400px]">
          {/* Giant name - curtain text */}
          <h2
            className="mb-16 select-none text-center font-bold uppercase leading-[0.85] tracking-tighter text-white"
            style={{ fontSize: "clamp(3rem, 12vw, 13rem)" }}
          >
            Deep Night Studio
          </h2>

          {/* CTA content */}
          <div className="text-center">
            <h3 className="mb-8 text-4xl font-bold uppercase tracking-tight lg:text-6xl">
              Un projet en tête ?
            </h3>
            <Link
              href="/#contact"
              className="inline-block border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ValuesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const valueTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const valueDescRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const valueNumberRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animFrame = useRef<number>(0);
  const activeValueRef = useRef(-1);

  const handleScroll = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const scrollableHeight = wrapperRef.current.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;
    const p = clamp(-rect.top / scrollableHeight, 0, 1);
    targetProgress.current = p;
  }, []);

  useEffect(() => {
    const animate = () => {
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.06;
      const p = currentProgress.current;

      // Phase 1 (0 -> 0.2): image is fullscreen, then slides to left half
      if (imageRef.current) {
        const slideP = clamp(p / 0.2, 0, 1);
        const eased = slideP * slideP * (3 - 2 * slideP);
        const rightInset = lerp(0, 50, eased);
        imageRef.current.style.clipPath = `inset(0 ${rightInset}% 0 0)`;
      }

      // Title appears on the left once curtain is open
      if (sectionTitleRef.current) {
        const titleP = clamp((p - 0.18) / 0.12, 0, 1);
        sectionTitleRef.current.style.opacity = String(titleP);
        const titleY = lerp(30, 0, titleP);
        sectionTitleRef.current.style.transform = `translateY(${titleY}px)`;
      }

      // Phase 1 (0.1 -> 0.25): content fades in on right
      if (contentRef.current) {
        const fadeP = clamp((p - 0.1) / 0.15, 0, 1);
        contentRef.current.style.opacity = String(fadeP);
        const translateX = lerp(30, 0, fadeP);
        contentRef.current.style.transform = `translateX(${translateX}px)`;
      }

      // Phase 2 (0.25 -> 1): cycle through values
      const valuesProgress = clamp((p - 0.25) / 0.75, 0, 0.999);
      const stepCount = values.length;
      const activeIndex = Math.min(
        Math.floor(valuesProgress * stepCount),
        stepCount - 1
      );

      if (activeIndex !== activeValueRef.current) {
        activeValueRef.current = activeIndex;

        if (valueNumberRef.current) {
          valueNumberRef.current.textContent = String(activeIndex + 1).padStart(2, "0");
        }

        valueTitleRefs.current.forEach((ref, i) => {
          if (!ref) return;
          if (i === activeIndex) {
            ref.style.opacity = "1";
            ref.style.transform = "translateY(0px)";
          } else {
            ref.style.opacity = "0";
            ref.style.transform = "translateY(15px)";
          }
        });

        valueDescRefs.current.forEach((ref, i) => {
          if (!ref) return;
          if (i === activeIndex) {
            ref.style.opacity = "1";
            ref.style.transform = "translateY(0px)";
          } else {
            ref.style.opacity = "0";
            ref.style.transform = "translateY(10px)";
          }
        });

        dotRefs.current.forEach((ref, i) => {
          if (!ref) return;
          ref.style.backgroundColor =
            i <= activeIndex ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)";
        });
      }

      animFrame.current = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animFrame.current);
    };
  }, [handleScroll]);

  return (
    <div ref={wrapperRef} className="relative bg-black" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Image - starts fullscreen, slides to left half */}
        <div
          ref={imageRef}
          className="absolute inset-0 z-10 will-change-[clip-path]"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          <Image
            src="/Skyline_Marina_Bay_Singapore.jpg"
            alt="Nos valeurs"
            fill
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Section title - centered on the left half image */}
        <h2
          ref={sectionTitleRef}
          className="absolute left-[25%] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold uppercase tracking-tight text-white will-change-transform lg:text-5xl"
          style={{ opacity: 0 }}
        >
          Nos Valeurs
        </h2>

        {/* Values content - right half */}
        <div
          ref={contentRef}
          className="absolute right-0 top-0 z-20 flex h-full w-1/2 flex-col justify-center px-8 lg:px-16"
          style={{ opacity: 0 }}
        >
          {/* Step number */}
          <span
            ref={valueNumberRef}
            className="mb-6 text-sm font-bold text-white/30"
          >
            01
          </span>

          {/* Value titles */}
          <div className="relative mb-8">
            {values.map((value, i) => (
              <h3
                key={i}
                ref={(el) => { valueTitleRefs.current[i] = el; }}
                className={`${i === 0 ? "" : "absolute top-0 left-0"} text-4xl font-bold uppercase tracking-tight text-white transition-all duration-600 sm:text-5xl lg:text-6xl`}
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateY(0px)" : "translateY(15px)",
                }}
              >
                {value.title}
              </h3>
            ))}
          </div>

          {/* Divider */}
          <div className="mb-8 h-px w-full bg-white/15" />

          {/* Value descriptions */}
          <div className="relative">
            {values.map((value, i) => (
              <p
                key={i}
                ref={(el) => { valueDescRefs.current[i] = el; }}
                className={`${i === 0 ? "" : "absolute top-0 left-0"} max-w-md text-sm leading-relaxed text-white/60 transition-all duration-500 lg:text-base`}
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateY(0px)" : "translateY(10px)",
                }}
              >
                {value.description}
              </p>
            ))}
            <p className="invisible max-w-md text-sm leading-relaxed lg:text-base">
              {values[0].description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="mt-12 flex gap-3">
            {values.map((_, i) => (
              <div
                key={i}
                ref={(el) => { dotRefs.current[i] = el; }}
                className="h-[3px] w-8 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColoredParagraph({
  text,
  progress,
}: {
  text: string;
  progress: number;
}) {
  const chars = text.split("");
  const total = chars.length;
  return (
    <>
      {chars.map((char, i) => {
        const charProgress = clamp((progress - i / total) * total, 0, 1);
        const opacity = 0.15 + 0.85 * charProgress;
        return (
          <span key={i} style={{ opacity, color: "white" }}>
            {char}
          </span>
        );
      })}
    </>
  );
}

function AboutIntro() {
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

  const totalChars = aboutParagraphs.reduce((sum, p) => sum + p.text.length, 0);

  return (
    <section ref={sectionRef} className="bg-black px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-16 lg:gap-24">
        {aboutParagraphs.map((para, idx) => {
          const charsBefore = aboutParagraphs
            .slice(0, idx)
            .reduce((sum, p) => sum + p.text.length, 0);
          const paraProgress = clamp(
            (progress * totalChars - charsBefore) / para.text.length,
            0,
            1
          );

          return (
            <p
              key={idx}
              className={`${para.align} text-3xl font-bold uppercase leading-snug tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.15]`}
              style={{ maxWidth: "85%" , alignSelf: idx % 2 === 0 ? "flex-start" : "flex-end" }}
            >
              <ColoredParagraph text={para.text} progress={paraProgress} />
            </p>
          );
        })}
      </div>
    </section>
  );
}

export default function APropos() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isAnimating = useRef(false);
  const progressRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!wrapperRef.current || isAnimating.current) return;

      const scrollableHeight = wrapperRef.current.offsetHeight - window.innerHeight;
      const wrapperTop = wrapperRef.current.offsetTop;
      const p = progressRef.current;

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

      if (p > 0.9 && p <= 1 && e.deltaY < 0) {
        const pastHero = window.scrollY > wrapperTop + scrollableHeight + 10;
        if (!pastHero) {
          e.preventDefault();
          isAnimating.current = true;
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => {
            isAnimating.current = false;
          }, 1200);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const insetTop = lerp(28, 0, progress);
  const insetBottom = lerp(18, 0, progress);
  const insetX = lerp(20, 0, progress);
  const borderRadius = lerp(12, 0, progress);
  const clipPath = `inset(${insetTop}% ${insetX}% ${insetBottom}% ${insetX}% round ${borderRadius}px)`;

  const overlayOpacity = clamp((progress - 0.5) / 0.5, 0, 0.55);
  const splashOpacity = clamp(1 - progress / 0.4, 0, 1);
  const splashTranslateY = lerp(0, -30, clamp(progress / 0.4, 0, 1));
  const heroRaw = clamp((progress - 0.88) / 0.12, 0, 1);
  const heroOpacity = mounted ? heroRaw : 0;
  const heroTranslateY = lerp(30, 0, heroRaw);
  const [heroTextVisible, setHeroTextVisible] = useState(false);

  useEffect(() => {
    if (heroRaw >= 1 && mounted) {
      setHeroTextVisible(true);
    } else if (heroRaw < 0.5) {
      setHeroTextVisible(false);
    }
  }, [heroRaw, mounted]);
  const bgWhiteOpacity = clamp(1 - progress / 0.6, 0, 1);

  return (
    <>
    <Header />
    <main className="relative z-10 min-h-screen bg-black text-white">
      {/* Hero with same splash as homepage */}
      <div ref={wrapperRef} className="relative" style={{ height: "250vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-white"
            style={{ opacity: bgWhiteOpacity }}
          />

          <div className="absolute inset-0" style={{ clipPath }}>
            <Image
              src="/Skyline_Marina_Bay_Singapore.jpg"
              alt="Deep Night Studio"
              fill
              priority
              className="object-cover object-center"
              quality={90}
            />
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          </div>

          {/* Splash content */}
          <div
            className="pointer-events-none absolute inset-0 z-10 flex flex-col"
            style={{
              opacity: splashOpacity,
              transform: `translateY(${splashTranslateY}px)`,
            }}
          >
            <div className="flex-shrink-0 px-4 pt-4 lg:px-6 lg:pt-6">
              <h1 className="splash-title select-none font-bold uppercase leading-[0.85] tracking-tighter text-black">
                A propos
                <br />
                du studio
              </h1>
            </div>
            <div className="flex-1" />
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

          {/* Hero finale content */}
          <div
            className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-6 lg:px-10"
            style={{
              opacity: heroTextVisible ? 1 : 0,
              transform: `translateY(${heroTranslateY}px)`,
            }}
          >
            <div className="mx-auto w-full max-w-[1600px]">
              {heroTextVisible && (
                <>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                    <RotatingText
                      texts={["À propos"]}
                      auto={false}
                      animatePresenceInitial={true}
                      splitBy="characters"
                      staggerFrom="first"
                      staggerDuration={0.03}
                      transition={{ type: "spring", damping: 30, stiffness: 200 }}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    />
                  </p>
                  <h2 className="max-w-3xl text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
                    <RotatingText
                      texts={["Nous créons des"]}
                      auto={false}
                      animatePresenceInitial={true}
                      splitBy="characters"
                      staggerFrom="first"
                      staggerDuration={0.02}
                      transition={{ type: "spring", damping: 30, stiffness: 200 }}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    />
                    <br />
                    <RotatingText
                      texts={["expériences digitales"]}
                      auto={false}
                      animatePresenceInitial={true}
                      splitBy="characters"
                      staggerFrom="first"
                      staggerDuration={0.02}
                      transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.3 }}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    />
                    <br />
                    <span className="text-white/50">
                      <RotatingText
                        texts={["d'exception"]}
                        auto={false}
                        animatePresenceInitial={true}
                        splitBy="characters"
                        staggerFrom="first"
                        staggerDuration={0.025}
                        transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.6 }}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      />
                    </span>
                  </h2>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About intro with letter coloring */}
      <AboutIntro />

      {/* Values */}
      <ValuesSection />

      </main>

      {/* CTA - fixed behind, revealed by curtain lift */}
      <CtaReveal />
    </>
  );
}
