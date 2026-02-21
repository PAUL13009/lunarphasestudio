"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const services = [
  {
    title: "Webdesign",
    description:
      "Nous concevons des interfaces sur-mesure, pensées pour captiver et convertir. Chaque pixel est orchestré pour sublimer votre marque et offrir une expérience utilisateur sans friction.",
    details: ["Sites vitrines", "E-commerce", "Plateformes web", "Landing pages"],
  },
  {
    title: "Identité Visuelle",
    description:
      "Nous façonnons des identités de marque uniques qui incarnent votre vision. Du logo à la charte graphique, chaque élément est conçu pour marquer les esprits durablement.",
    details: ["Logotype", "Charte graphique", "Supports print", "Guidelines"],
  },
  {
    title: "Stratégie Digitale",
    description:
      "Nous élaborons des stratégies digitales sur-mesure pour maximiser votre visibilité et vos conversions. Une approche data-driven au service de vos ambitions.",
    details: ["Audit stratégique", "SEO & SEA", "Content strategy", "Analytics"],
  },
  {
    title: "Développement",
    description:
      "Nous développons des solutions techniques performantes et évolutives. Un code propre, optimisé et maintenable pour des produits digitaux qui durent.",
    details: ["Front-end", "Intégration", "Animations", "Performance"],
  },
];

export default function ServicesOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"closed" | "open" | "hiding" | "curtain">("closed");
  const scrollValue = useRef(0);
  const currentScroll = useRef(0);
  const animFrame = useRef<number>(0);
  const closing = useRef(false);
  const activeServiceRef = useRef(0);

  const serviceTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const serviceDescRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const serviceDetailsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const serviceNumberRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const timer = setTimeout(() => setPhase("open"), 50);
    return () => {
      document.documentElement.style.overflow = "";
      clearTimeout(timer);
    };
  }, []);

  const triggerClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setPhase("hiding");
    setTimeout(() => setPhase("curtain"), 400);
    setTimeout(onClose, 1200);
  }, [onClose]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (closing.current) return;

      scrollValue.current += e.deltaY * 0.0008;
      scrollValue.current = clamp(scrollValue.current, 0, 1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [triggerClose]);

  useEffect(() => {
    const animate = () => {
      currentScroll.current += (scrollValue.current - currentScroll.current) * 0.08;
      const p = clamp(currentScroll.current, 0, 0.999);

      const stepCount = services.length;
      const activeIndex = Math.min(Math.floor(p * stepCount), stepCount - 1);

      if (activeIndex !== activeServiceRef.current) {
        activeServiceRef.current = activeIndex;

        if (serviceNumberRef.current) {
          serviceNumberRef.current.textContent = String(activeIndex + 1).padStart(2, "0");
        }

        serviceTitleRefs.current.forEach((ref, i) => {
          if (!ref) return;
          ref.style.opacity = i === activeIndex ? "1" : "0";
          ref.style.transform = i === activeIndex ? "translateY(0px)" : "translateY(15px)";
        });

        serviceDescRefs.current.forEach((ref, i) => {
          if (!ref) return;
          ref.style.opacity = i === activeIndex ? "1" : "0";
          ref.style.transform = i === activeIndex ? "translateY(0px)" : "translateY(10px)";
        });

        serviceDetailsRefs.current.forEach((ref, i) => {
          if (!ref) return;
          ref.style.opacity = i === activeIndex ? "1" : "0";
          ref.style.transform = i === activeIndex ? "translateY(0px)" : "translateY(10px)";
        });

        dotRefs.current.forEach((ref, i) => {
          if (!ref) return;
          ref.style.backgroundColor =
            i <= activeIndex ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)";
        });
      }

      animFrame.current = requestAnimationFrame(animate);
    };

    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  const isOpen = phase === "open";
  const showContent = phase === "open";
  const showCurtain = phase === "open" || phase === "hiding";
  const isHiding = phase === "hiding";

  return (
    <div
      className="fixed inset-0 z-[60]"
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: showCurtain || phase === "curtain" ? 1 : 0,
          transition: phase === "curtain"
            ? "opacity 0.6s cubic-bezier(0.33,1,0.68,1) 0.4s"
            : "opacity 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* Close button */}
      <button
        onClick={triggerClose}
        className="absolute top-20 right-8 z-50 flex h-12 w-12 items-center justify-center text-white/60 hover:text-white hover:rotate-90"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "scale(1)" : "scale(0.5)",
          pointerEvents: showContent ? "auto" : "none",
          transition: isHiding
            ? "opacity 0.25s ease, transform 0.25s ease, color 0.3s"
            : "opacity 0.5s ease 1.2s, transform 0.5s ease 1.2s, color 0.3s",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      {/* Image - curtain opens from right, closes back */}
      <div
        className="absolute inset-0 z-10 will-change-[clip-path]"
        style={{
          clipPath: showCurtain ? "inset(0 50% 0 0)" : "inset(0 0% 0 0)",
          transition: phase === "curtain"
            ? "clip-path 0.8s cubic-bezier(0.33,1,0.68,1)"
            : "clip-path 1.4s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}
      >
        <Image
          src="/Skyline_Marina_Bay_Singapore.jpg"
          alt="Nos services"
          fill
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Title - centered on left half */}
      <div
        className="absolute left-0 top-0 z-20 flex h-full w-1/2 items-center justify-center"
        style={{ pointerEvents: "none" }}
      >
        <h2
          className="text-3xl font-bold uppercase tracking-tight text-white will-change-transform lg:text-5xl"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0px)" : "translateY(30px)",
            transition: isHiding
              ? "opacity 0.3s ease, transform 0.3s ease"
              : "opacity 0.8s ease 1s, transform 0.8s ease 1s",
          }}
        >
          Nos Services
        </h2>
      </div>

      {/* Services content - right half */}
      <div
        className="absolute right-0 top-0 z-20 flex h-full w-1/2 flex-col justify-center px-8 lg:px-16"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateX(0px)" : "translateX(50px)",
          transition: isHiding
            ? "opacity 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.16,1,0.3,1)"
            : "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.8s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.8s",
        }}
      >
        <span ref={serviceNumberRef} className="mb-6 text-sm font-bold text-white/30">
          01
        </span>

        <div className="relative mb-8">
          {services.map((service, i) => (
            <h3
              key={i}
              ref={(el) => { serviceTitleRefs.current[i] = el; }}
              className={`${i === 0 ? "" : "absolute top-0 left-0"} text-4xl font-bold uppercase tracking-tight text-white transition-all duration-600 sm:text-5xl lg:text-6xl`}
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0px)" : "translateY(15px)",
              }}
            >
              {service.title}
            </h3>
          ))}
        </div>

        <div className="mb-8 h-px w-full bg-white/15" />

        <div className="relative mb-10">
          {services.map((service, i) => (
            <p
              key={i}
              ref={(el) => { serviceDescRefs.current[i] = el; }}
              className={`${i === 0 ? "" : "absolute top-0 left-0"} max-w-md text-sm leading-relaxed text-white/60 transition-all duration-500 lg:text-base`}
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0px)" : "translateY(10px)",
              }}
            >
              {service.description}
            </p>
          ))}
          <p className="invisible max-w-md text-sm leading-relaxed lg:text-base">
            {services[0].description}
          </p>
        </div>

        <div className="relative mb-12">
          {services.map((service, i) => (
            <div
              key={i}
              ref={(el) => { serviceDetailsRefs.current[i] = el; }}
              className={`${i === 0 ? "" : "absolute top-0 left-0"} flex flex-wrap gap-2 transition-all duration-500`}
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0px)" : "translateY(10px)",
              }}
            >
              {service.details.map((detail) => (
                <span
                  key={detail}
                  className="border border-white/15 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white/50"
                >
                  {detail}
                </span>
              ))}
            </div>
          ))}
          <div className="invisible flex flex-wrap gap-2">
            {services[0].details.map((detail) => (
              <span key={detail} className="px-3 py-1.5 text-xs">{detail}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {services.map((_, i) => (
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
  );
}
