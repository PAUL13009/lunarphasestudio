"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const images = [
  { src: "/archi.png",      top: "0%",   left: "0%",   w: "22%", h: "14%" },
  { src: "/project-4.jpg",  top: "0%",   left: "35%",  w: "18%", h: "12%" },
  { src: "/project-10.jpg", top: "0%",   left: "72%",  w: "20%", h: "13%" },
  { src: "/project-5.jpg",  top: "16%",  left: "15%",  w: "20%", h: "13%" },
  { src: "/project-7.jpg",  top: "22%",  left: "78%",  w: "22%", h: "14%" },
  { src: "/project-9.jpg",  top: "30%",  left: "0%",   w: "24%", h: "15%" },
  { src: "/project-11.jpg", top: "45%",  left: "55%",  w: "20%", h: "13%" },
  { src: "/archi.png",      top: "52%",  left: "18%",  w: "18%", h: "11%" },
  { src: "/project-4.jpg",  top: "62%",  left: "75%",  w: "24%", h: "15%" },
  { src: "/project-10.jpg", top: "72%",  left: "2%",   w: "22%", h: "14%" },
  { src: "/project-5.jpg",  top: "76%",  left: "38%",  w: "18%", h: "12%" },
];

const totalProjects = 27;

const processSteps = [
  {
    name: "Audit Stratégique",
    description:
      "L'analyse avant l'action. Tout projet commence par une immersion dans votre univers. Nous analysons vos objectifs, votre cible et votre concurrence pour définir une feuille de route claire. C'est ici que nous posons les fondations d'un site qui ne se contente pas d'exister, mais qui convertit.",
  },
  {
    name: "Identité Visuelle",
    description:
      "Nous concevons une identité visuelle unique et cohérente qui reflète l'essence de votre marque. Du choix typographique à la palette de couleurs, chaque détail est pensé pour créer une expérience mémorable et différenciante.",
  },
  {
    name: "Production du Site",
    description:
      "Le design prend vie. Nous développons votre site avec les technologies les plus performantes, en garantissant une expérience fluide, rapide et responsive sur tous les appareils. Chaque ligne de code est optimisée pour la performance.",
  },
  {
    name: "Optimisation SEO",
    description:
      "Un beau site ne suffit pas, il faut qu'on le trouve. Nous optimisons chaque page pour les moteurs de recherche afin de maximiser votre visibilité organique et attirer un trafic qualifié vers votre site.",
  },
  {
    name: "Mise en Ligne",
    description:
      "Le lancement n'est que le début. Nous assurons un déploiement sans accroc, avec un suivi rigoureux des performances et un accompagnement post-lancement pour garantir le succès de votre présence digitale.",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function AllWork() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLAnchorElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const fullImageRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const keywordsRef = useRef<HTMLDivElement>(null);
  const stepTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const stepNumberRef = useRef<HTMLSpanElement>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animFrame = useRef<number>(0);
  const activeStepRef = useRef(-1);

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

      // Phase 1 (0 -> 0.08): title shrinks and moves to center
      if (titleRef.current) {
        const titleP = clamp(p / 0.08, 0, 1);
        const scale = lerp(2.2, 1, titleP);
        const yPercent = lerp(0, 40, titleP);
        titleRef.current.style.transform = `translate(-50%, ${yPercent}vh) scale(${scale})`;
        const titleFadeOut = clamp((p - 0.35) / 0.08, 0, 1);
        titleRef.current.style.opacity = String(1 - titleFadeOut);
        titleRef.current.style.pointerEvents = (titleP >= 1 && titleFadeOut < 0.1) ? "auto" : "none";
      }

      // Phase 2 (0.08 -> 0.35): mosaic scrolls
      if (mosaicRef.current) {
        const phase2 = clamp((p - 0.08) / 0.27, 0, 1);
        const imagesOpacity = clamp(phase2 / 0.3, 0, 1);
        const scrollY = phase2 * -60;
        const mosaicFadeOut = clamp((p - 0.35) / 0.08, 0, 1);
        mosaicRef.current.style.opacity = String(imagesOpacity * (1 - mosaicFadeOut));
        mosaicRef.current.style.transform = `translateY(${scrollY}vh)`;
      }

      // Phase 3 (0.4 -> 0.52): fullscreen image opens
      if (fullImageRef.current) {
        const phase3 = clamp((p - 0.4) / 0.12, 0, 1);
        const eased = phase3 * phase3 * (3 - 2 * phase3);
        const inset = lerp(40, 0, eased);
        const radius = lerp(20, 0, eased);
        fullImageRef.current.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
        fullImageRef.current.style.opacity = String(clamp(phase3 / 0.2, 0, 1));
        fullImageRef.current.style.pointerEvents = phase3 > 0.5 ? "auto" : "none";
      }

      // Phase 4 (0.54 -> 1): process overlay
      if (processRef.current) {
        const phase4 = clamp((p - 0.54) / 0.1, 0, 1);
        processRef.current.style.opacity = String(phase4);
        const translateY = lerp(40, 0, phase4);
        processRef.current.style.transform = `translateY(${translateY}px)`;
        processRef.current.style.pointerEvents = phase4 > 0.5 ? "auto" : "none";
      }

      // Active step based on scroll
      const processProgress = clamp((p - 0.56) / 0.44, 0, 0.999);
      const stepCount = processSteps.length;
      const activeIndex = Math.min(
        Math.floor(processProgress * stepCount),
        stepCount - 1
      );

      // Shift keywords row so active step is on the left
      if (keywordsRef.current && stepTitleRefs.current[activeIndex]) {
        const activeEl = stepTitleRefs.current[activeIndex]!;
        const offsetX = activeEl.offsetLeft;
        keywordsRef.current.style.transform = `translateX(-${offsetX}px)`;
      }

      if (activeIndex !== activeStepRef.current) {
        activeStepRef.current = activeIndex;

        // Update step number
        if (stepNumberRef.current) {
          stepNumberRef.current.textContent = String(activeIndex + 1).padStart(2, "0");
        }

        // Highlight active title, dim others
        stepTitleRefs.current.forEach((ref, i) => {
          if (!ref) return;
          ref.style.opacity = i === activeIndex ? "1" : "0.2";
        });

        // Show active description, hide others
        descriptionRefs.current.forEach((ref, i) => {
          if (!ref) return;
          if (i === activeIndex) {
            ref.style.opacity = "1";
            ref.style.transform = "translateY(0px)";
          } else {
            ref.style.opacity = "0";
            ref.style.transform = "translateY(10px)";
          }
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
    <div ref={wrapperRef} className="relative bg-black" style={{ height: "700vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Mosaic images */}
        <div
          ref={mosaicRef}
          className="pointer-events-none absolute inset-0 mx-auto max-w-[1400px] px-6 will-change-transform lg:px-10"
          style={{ opacity: 0, height: "200%", top: "20%" }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="absolute overflow-hidden"
              style={{
                top: img.top,
                left: img.left,
                width: img.w,
                height: img.h,
              }}
            >
              <Image
                src={img.src}
                alt={`Projet ${i + 1}`}
                fill
                className="object-contain object-center"
                quality={75}
              />
            </div>
          ))}
        </div>

        {/* Fullscreen image reveal */}
        <div
          ref={fullImageRef}
          className="absolute inset-0 z-20 will-change-[clip-path]"
          style={{ clipPath: "inset(40% 40% 40% 40% round 20px)", opacity: 0, pointerEvents: "none" }}
        >
          <Image
            src="/Skyline_Marina_Bay_Singapore.jpg"
            alt="Projet vedette"
            fill
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Process overlay content */}
        <div
          ref={processRef}
          className="absolute inset-0 z-30 flex flex-col justify-center will-change-transform"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          {/* Step titles - horizontal row */}
          <div className="mx-6 mb-8 overflow-hidden lg:mx-10">
            <div
              ref={keywordsRef}
              className="flex gap-6 whitespace-nowrap transition-transform duration-700 ease-in-out lg:gap-10"
            >
              {processSteps.map((step, i) => (
                <h3
                  key={i}
                  ref={(el) => { stepTitleRefs.current[i] = el; }}
                  className="flex-shrink-0 text-4xl font-bold uppercase tracking-tight transition-opacity duration-500 sm:text-5xl lg:text-7xl"
                  style={{ opacity: i === 0 ? 1 : 0.2, color: "white" }}
                >
                  {step.name}
                </h3>
              ))}
            </div>
          </div>

          {/* Divider line */}
          <div className="mx-6 flex items-center gap-4 lg:mx-10">
            <span
              ref={stepNumberRef}
              className="text-xs font-medium text-white/50"
            >
              01
            </span>
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Process
            </span>
          </div>

          {/* Description texts - right aligned */}
          <div className="relative mx-6 mt-8 flex justify-end lg:mx-10">
            <div className="relative max-w-md">
              {processSteps.map((step, i) => (
                <p
                  key={i}
                  ref={(el) => { descriptionRefs.current[i] = el; }}
                  className="absolute top-0 right-0 text-base uppercase leading-relaxed text-white/70 transition-all duration-500 lg:text-lg"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    transform: i === 0 ? "translateY(0px)" : "translateY(10px)",
                  }}
                >
                  {step.description}
                </p>
              ))}
              <p className="invisible text-base leading-relaxed lg:text-lg">
                {processSteps[0].description}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <Link
          href="/projets"
          ref={titleRef}
          className="absolute left-1/2 top-[10%] z-40 whitespace-nowrap font-bold uppercase tracking-tight text-white will-change-transform hover:text-white/80 transition-colors"
          style={{
            transform: "translate(-50%, 0vh) scale(2.2)",
            fontSize: "clamp(1.5rem, 3vw, 2.8rem)",
            pointerEvents: "none",
          }}
        >
          Nos Projets
          <sup className="ml-1 text-[0.4em] font-normal text-white/50">
            ({totalProjects})
          </sup>
        </Link>
      </div>
    </div>
  );
}
