"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import AnimatedContent from "@/components/AnimatedContent";
import Header from "@/components/Header";
import RotatingText from "@/components/RotatingText";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

interface Project {
  slug: string;
  category: string;
  title: string;
  image: string;
  gallery: string[];
  description: string;
  client: string;
  year: string;
  services: string[];
}

const projects: Project[] = [
  {
    slug: "arch-studio",
    category: "WEBDESIGN",
    title: "Arch Studio",
    image: "/archi.png",
    gallery: ["/archi.png", "/project-2.jpg", "/project-3.jpg", "/project-8.jpg"],
    description:
      "Nous concevons des résidences et des espaces inspirés par votre vision, alliant design réfléchi, collaboration et créativité pour façonner des lieux de vie qui s'adaptent naturellement à votre quotidien.",
    client: "Arch Studio",
    year: "2025",
    services: ["Direction Artistique", "Webdesign", "Développement Front-end"],
  },
  {
    slug: "urban-perspective",
    category: "IDENTITÉ VISUELLE",
    title: "Urban Perspective",
    image: "/project-4.jpg",
    gallery: ["/project-4.jpg", "/project-5.jpg", "/project-6.jpg", "/project-11.jpg"],
    description:
      "Création d'une identité visuelle complète pour un cabinet d'architecture contemporaine. Du logotype à la charte graphique, chaque élément a été conçu pour refléter la précision et l'audace de leurs réalisations architecturales.",
    client: "Urban Architects",
    year: "2025",
    services: ["Identité Visuelle", "Charte Graphique", "Supports Print"],
  },
  {
    slug: "skyline-residences",
    category: "STRATÉGIE DIGITALE",
    title: "Skyline Residences",
    image: "/project-10.jpg",
    gallery: ["/project-10.jpg", "/project-9.jpg", "/project-7.jpg", "/project-3.jpg"],
    description:
      "Stratégie digitale complète pour un programme immobilier de prestige. Nous avons conçu un écosystème digital performant intégrant site web, campagnes d'acquisition et optimisation SEO pour maximiser la visibilité et les conversions.",
    client: "Skyline Group",
    year: "2024",
    services: ["Stratégie Digitale", "SEO", "Campagnes Ads"],
  },
  {
    slug: "nordic-essence",
    category: "WEBDESIGN",
    title: "Nordic Essence",
    image: "/project-5.jpg",
    gallery: ["/project-5.jpg", "/project-1.jpg", "/project-8.jpg", "/project-6.jpg"],
    description:
      "Un e-commerce minimaliste pour une marque de mobilier scandinave. L'interface épurée met en valeur chaque pièce avec des visuels grand format et une expérience d'achat sans friction, pensée pour la conversion.",
    client: "Nordic Living",
    year: "2025",
    services: ["Webdesign", "Développement E-commerce", "UX Design"],
  },
  {
    slug: "terra-studio",
    category: "IDENTITÉ VISUELLE",
    title: "Terra Studio",
    image: "/project-7.jpg",
    gallery: ["/project-7.jpg", "/project-4.jpg", "/project-2.jpg", "/project-10.jpg"],
    description:
      "Refonte complète de l'identité visuelle d'un studio de design d'intérieur. Un univers graphique chaleureux et organique qui traduit leur approche artisanale et leur goût pour les matériaux naturels.",
    client: "Terra Intérieurs",
    year: "2024",
    services: ["Identité Visuelle", "Direction Artistique", "Webdesign"],
  },
  {
    slug: "horizon-digital",
    category: "STRATÉGIE DIGITALE",
    title: "Horizon Digital",
    image: "/project-9.jpg",
    gallery: ["/project-9.jpg", "/project-11.jpg", "/project-5.jpg", "/project-1.jpg"],
    description:
      "Accompagnement stratégique pour une startup tech en pleine croissance. De l'audit de marque au déploiement de leur plateforme digitale, nous avons structuré leur présence en ligne pour accélérer leur développement.",
    client: "Horizon Tech",
    year: "2025",
    services: ["Audit Stratégique", "Webdesign", "Optimisation SEO"],
  },
  {
    slug: "atelier-lumiere",
    category: "WEBDESIGN",
    title: "Atelier Lumière",
    image: "/project-11.jpg",
    gallery: ["/project-11.jpg", "/project-3.jpg", "/project-6.jpg", "/project-9.jpg"],
    description:
      "Site portfolio pour un photographe d'art et d'architecture. Une galerie immersive qui laisse toute la place aux images, avec des transitions cinématographiques et un chargement optimisé pour des visuels haute résolution.",
    client: "Atelier Lumière",
    year: "2024",
    services: ["Webdesign", "Développement Front-end", "Optimisation Performance"],
  },
];

function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: (rect: DOMRect) => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (cardRef.current) {
      onClick(cardRef.current.getBoundingClientRect());
    }
  };

  return (
    <button
      ref={cardRef}
      onClick={handleClick}
      className="group relative overflow-hidden text-left w-full h-full cursor-pointer"
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        quality={85}
      />
      <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />
      <div className="absolute bottom-8 left-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
          {project.category}
        </p>
        <h2 className="text-2xl font-semibold text-white lg:text-3xl">
          {project.title}
        </h2>
      </div>
    </button>
  );
}

function ProjectDetail({
  project,
  originRect,
  onClose,
}: {
  project: Project;
  originRect: DOMRect;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"origin" | "settled" | "closing" | "returning">("origin");
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("settled"));
    });
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(() => {
    setPhase("closing");
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
      setPhase("returning");
    }, 800);
    setTimeout(onClose, 1900);
  }, [onClose]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const containerCenter = el.scrollTop + el.clientHeight / 2;
      let closest = 0;
      let minDist = Infinity;
      imageRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const center = ref.offsetTop + ref.offsetHeight / 2;
        const dist = Math.abs(containerCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveImage(closest);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToImage = (index: number) => {
    const ref = imageRefs.current[index];
    if (ref && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: ref.offsetTop - scrollRef.current.clientHeight / 2 + ref.offsetHeight / 2,
        behavior: "smooth",
      });
    }
  };

  const isSettled = phase === "settled";
  const isClosing = phase === "closing";
  const isReturning = phase === "returning";
  const showInfo = isSettled;

  const atOrigin = phase === "origin" || isReturning;

  const carouselStyle: React.CSSProperties = atOrigin
    ? {
        top: originRect.top,
        left: originRect.left,
        width: originRect.width,
        height: originRect.height,
      }
    : {
        top: 0,
        left: 0,
        width: "55%",
        height: "100%",
      };

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ pointerEvents: isSettled || isClosing ? "auto" : "none" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: isSettled || isClosing ? 1 : 0,
          transition: isReturning
            ? "opacity 1s cubic-bezier(0.33,1,0.68,1)"
            : "opacity 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={handleClose}
      />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center text-white/60 hover:text-white hover:rotate-90"
        style={{
          opacity: showInfo ? 1 : 0,
          transform: showInfo ? "scale(1)" : "scale(0.5)",
          transition: isClosing
            ? "opacity 0.5s ease, transform 0.5s ease, color 0.3s"
            : "opacity 0.5s ease 0.8s, transform 0.5s ease 0.8s, color 0.3s",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      {/* Carousel - animates from clicked card position to left panel */}
      <div
        className="absolute z-10 flex flex-col overflow-hidden"
        style={{
          ...carouselStyle,
          transition: "top 1s cubic-bezier(0.33,1,0.68,1), left 1s cubic-bezier(0.33,1,0.68,1), width 1s cubic-bezier(0.33,1,0.68,1), height 1s cubic-bezier(0.33,1,0.68,1)",
        }}
      >
        {/* Scroll list - hidden during return, replaced by static image */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-smooth"
          style={{
            scrollbarWidth: "none",
            overflowY: isSettled ? "auto" : "hidden",
            opacity: isReturning ? 0 : 1,
            transition: "opacity 0.01s",
          }}
        >
          <div
            className="flex flex-col"
            style={{
              gap: isSettled ? "4px" : "0px",
              padding: isSettled ? "4px" : "0px",
              paddingTop: isSettled ? "80px" : "0px",
              paddingBottom: isSettled ? "80px" : "0px",
              transition: isClosing
                ? "gap 0.9s ease 0.3s, padding 0.9s ease 0.3s"
                : "gap 0.9s ease 0.4s, padding 0.9s ease 0.4s",
            }}
          >
            {project.gallery.map((src, i) => (
              <div
                key={i}
                ref={(el) => { imageRefs.current[i] = el; }}
                className="relative w-full shrink-0"
                style={{
                  aspectRatio: i === 0 && phase === "origin" ? "auto" : "4/3",
                  height: i === 0 && phase === "origin" ? "100%" : "auto",
                  opacity: i === 0 ? 1 : isSettled ? 1 : 0,
                  transform: i === 0 ? "none" : isSettled ? "translateY(0)" : "translateY(30px)",
                  transition: isClosing
                    ? `opacity 0.7s ease ${0.1 * (project.gallery.length - 1 - i)}s, transform 0.7s ease ${0.1 * (project.gallery.length - 1 - i)}s`
                    : `opacity 0.7s ease ${0.5 + i * 0.1}s, transform 0.7s ease ${0.5 + i * 0.1}s`,
                }}
              >
                <Image
                  src={src}
                  alt={`${project.title} - ${i + 1}`}
                  fill
                  className="object-cover"
                  quality={90}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Static first image shown during return - avoids layout shifts */}
        {isReturning && (
          <div className="absolute inset-0">
            <Image
              src={project.gallery[0]}
              alt={project.title}
              fill
              className="object-cover"
              quality={90}
            />
          </div>
        )}

        {/* Image indicators */}
        <div
          className="absolute left-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2"
          style={{
            opacity: showInfo ? 1 : 0,
            transition: isClosing ? "opacity 0.5s ease" : "opacity 0.5s ease 0.9s",
          }}
        >
          {project.gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToImage(i)}
              className="h-6 w-[3px] rounded-full transition-all duration-500"
              style={{
                backgroundColor: i === activeImage ? "white" : "rgba(255,255,255,0.25)",
                transform: i === activeImage ? "scaleY(1.5)" : "scaleY(1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: Project info - slides in from right, disappears first on close */}
      <div
        className="absolute right-0 top-0 z-10 flex h-full w-[45%] flex-col justify-center px-8 md:px-16"
        style={{
          opacity: showInfo ? 1 : 0,
          transform: showInfo ? "translateX(0)" : "translateX(60px)",
          transition: isClosing
            ? "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s"
            : "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s",
        }}
      >
        <div
          style={{
            opacity: showInfo ? 1 : 0,
            transform: showInfo ? "translateY(0)" : "translateY(20px)",
            transition: isClosing
              ? "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s"
              : "opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s",
          }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/40">
            {project.category}
          </p>
          <h2 className="mb-8 text-4xl font-bold uppercase tracking-tight lg:text-6xl">
            {project.title}
          </h2>
        </div>

        <div
          className="mb-12 h-px w-full bg-white/10"
          style={{
            transform: showInfo ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: showInfo ? "left" : "right",
            transition: isClosing
              ? "transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s"
              : "transform 1s cubic-bezier(0.16,1,0.3,1) 0.6s",
          }}
        />

        <div
          style={{
            opacity: showInfo ? 1 : 0,
            transform: showInfo ? "translateY(0)" : "translateY(20px)",
            transition: isClosing
              ? "opacity 0.7s ease 0.05s, transform 0.7s ease 0.05s"
              : "opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s",
          }}
        >
          <p className="mb-12 text-sm leading-relaxed text-white/60 lg:text-base">
            {project.description}
          </p>

          <div className="mb-8 flex gap-16">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                Client
              </p>
              <p className="text-sm font-medium">{project.client}</p>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                Année
              </p>
              <p className="text-sm font-medium">{project.year}</p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
              Services
            </p>
            <div className="flex flex-wrap gap-2">
              {project.services.map((s) => (
                <span
                  key={s}
                  className="border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projets() {
  const [reveal] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("reveal") === "true";
  });

  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(!reveal);
  const [entrance, setEntrance] = useState(reveal ? 0 : 3);
  const isAnimating = useRef(false);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!reveal) return;
    const t1 = setTimeout(() => setEntrance(1), 100);
    const t2 = setTimeout(() => setEntrance(2), 1200);
    const t3 = setTimeout(() => {
      setEntrance(3);
      setMounted(true);
    }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [reveal]);

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

  const handleOpen = (project: Project, rect: DOMRect) => {
    setOriginRect(rect);
    setOpenProject(project);
  };

  const insetTop = lerp(28, 0, progress);
  const insetBottom = lerp(18, 0, progress);
  const insetX = lerp(20, 0, progress);
  const borderRadius = lerp(12, 0, progress);

  const entranceInsetTop = entrance >= 1 ? 28 : 45;
  const entranceInsetBottom = entrance >= 1 ? 18 : 45;
  const entranceInsetX = entrance >= 1 ? 20 : 45;
  const entranceBorderRadius = entrance >= 1 ? 12 : 20;

  const finalInsetTop = entrance < 3 ? entranceInsetTop : insetTop;
  const finalInsetBottom = entrance < 3 ? entranceInsetBottom : insetBottom;
  const finalInsetX = entrance < 3 ? entranceInsetX : insetX;
  const finalBorderRadius = entrance < 3 ? entranceBorderRadius : borderRadius;
  const clipPath = `inset(${finalInsetTop}% ${finalInsetX}% ${finalInsetBottom}% ${finalInsetX}% round ${finalBorderRadius}px)`;

  const overlayOpacity = clamp((progress - 0.5) / 0.5, 0, 0.55);
  const splashOpacity = entrance < 2 ? 0 : clamp(1 - progress / 0.4, 0, 1);
  const splashTranslateY = entrance < 2 ? 20 : lerp(0, -30, clamp(progress / 0.4, 0, 1));
  const heroRaw = clamp((progress - 0.88) / 0.12, 0, 1);
  const heroOpacity = mounted ? heroRaw : 0;
  const heroTranslateY = lerp(30, 0, heroRaw);
  const bgWhiteOpacity = entrance < 2 ? 0 : clamp(1 - progress / 0.6, 0, 1);

  const [heroTextVisible, setHeroTextVisible] = useState(false);

  useEffect(() => {
    if (heroRaw >= 1 && mounted) {
      setHeroTextVisible(true);
    } else if (heroRaw < 0.5) {
      setHeroTextVisible(false);
    }
  }, [heroRaw, mounted]);

  return (
    <>
      <Header />
      <main className="relative z-10 min-h-screen bg-black text-white">
        {/* Black cover during entrance to prevent any flash */}
        <div
          className="fixed inset-0 z-[100] bg-black pointer-events-none"
          style={{
            opacity: entrance < 1 ? 1 : 0,
            transition: "opacity 0.5s ease",
            visibility: entrance >= 2 ? "hidden" : "visible",
          }}
        />

        {/* Hero with same splash as other pages */}
        <div ref={wrapperRef} className="relative" style={{ height: "250vh" }}>
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
            <div
              className="absolute inset-0 bg-white"
              style={{
                opacity: bgWhiteOpacity,
                transition: entrance < 3 ? "opacity 1.2s cubic-bezier(0.22,1,0.36,1)" : undefined,
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                clipPath,
                opacity: entrance >= 1 ? 1 : 0,
                transition: entrance < 3
                  ? "clip-path 1.4s cubic-bezier(0.22,1,0.36,1), opacity 1s cubic-bezier(0.22,1,0.36,1)"
                  : undefined,
              }}
            >
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
                transition: entrance < 3
                  ? "opacity 1s cubic-bezier(0.22,1,0.36,1) 0.2s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.2s"
                  : undefined,
              }}
            >
              <div className="flex-shrink-0 px-4 pt-4 lg:px-6 lg:pt-6">
                <h1 className="splash-title select-none font-bold uppercase leading-[0.85] tracking-tighter text-black">
                  Nos
                  <br />
                  Projets
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
                        texts={["Portfolio"]}
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
                        texts={["Découvrez nos"]}
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
                        texts={["réalisations"]}
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
                          texts={["les plus marquantes"]}
                          auto={false}
                          animatePresenceInitial={true}
                          splitBy="characters"
                          staggerFrom="first"
                          staggerDuration={0.02}
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

        {/* Project grids */}
        <section style={{ opacity: entrance >= 3 ? 1 : 0, transition: "opacity 0.5s ease" }}>
          <div className="grid h-[100vh] grid-cols-1 gap-0 md:grid-cols-2 md:grid-rows-2">
            <AnimatedContent distance={60} duration={0.9} delay={0} threshold={0.15} className="relative overflow-hidden">
              <ProjectCard project={projects[0]} onClick={(rect) => handleOpen(projects[0], rect)} />
            </AnimatedContent>
            <AnimatedContent distance={60} duration={0.9} delay={0.15} threshold={0.15} className="relative overflow-hidden">
              <ProjectCard project={projects[1]} onClick={(rect) => handleOpen(projects[1], rect)} />
            </AnimatedContent>
            <AnimatedContent distance={60} duration={0.9} delay={0.3} threshold={0.15} className="relative overflow-hidden">
              <ProjectCard project={projects[2]} onClick={(rect) => handleOpen(projects[2], rect)} />
            </AnimatedContent>
            <AnimatedContent distance={60} duration={0.9} delay={0.45} threshold={0.15} className="relative overflow-hidden">
              <ProjectCard project={projects[3]} onClick={(rect) => handleOpen(projects[3], rect)} />
            </AnimatedContent>
          </div>
        </section>

        <section style={{ opacity: entrance >= 3 ? 1 : 0, transition: "opacity 0.5s ease" }}>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:grid-rows-2" style={{ height: "100vh" }}>
            <AnimatedContent distance={60} duration={0.9} delay={0} threshold={0.15} className="relative overflow-hidden">
              <ProjectCard project={projects[4]} onClick={(rect) => handleOpen(projects[4], rect)} />
            </AnimatedContent>
            <AnimatedContent distance={60} duration={0.9} delay={0.15} threshold={0.15} className="relative overflow-hidden">
              <ProjectCard project={projects[5]} onClick={(rect) => handleOpen(projects[5], rect)} />
            </AnimatedContent>
            <AnimatedContent distance={60} duration={0.9} delay={0.3} threshold={0.15} className="relative overflow-hidden">
              <ProjectCard project={projects[6]} onClick={(rect) => handleOpen(projects[6], rect)} />
            </AnimatedContent>
            <AnimatedContent distance={60} duration={0.9} delay={0.45} threshold={0.15} className="relative overflow-hidden">
              <ProjectCard project={projects.length > 7 ? projects[7] : projects[0]} onClick={(rect) => handleOpen(projects.length > 7 ? projects[7] : projects[0], rect)} />
            </AnimatedContent>
          </div>
        </section>

        {/* Project detail overlay */}
        {openProject && originRect && (
          <ProjectDetail
            key={openProject.slug}
            project={openProject}
            originRect={originRect}
            onClose={() => setOpenProject(null)}
          />
        )}
      </main>
    </>
  );
}
