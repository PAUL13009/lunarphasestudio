"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

const projects = [
  {
    name: "Arch Studio",
    image: "/archi.png",
    year: "2025",
  },
  {
    name: "Horizon",
    image: "/project-4.jpg",
    year: "2024",
  },
  {
    name: "Vertex",
    image: "/project-10.jpg",
    year: "2024",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const leftBracketRef = useRef<HTMLSpanElement>(null);
  const rightBracketRef = useRef<HTMLSpanElement>(null);
  const targetScale = useRef(0.3);
  const currentScale = useRef(0.3);
  const animFrame = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    const progress = clamp((windowH - rect.top) / (windowH * 0.9), 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    targetScale.current = 0.3 + 0.7 * eased;
  }, []);

  useEffect(() => {
    const animate = () => {
      currentScale.current += (targetScale.current - currentScale.current) * 0.08;

      if (imageRef.current) {
        imageRef.current.style.transform = `scale(${currentScale.current})`;
      }

      const spread = (currentScale.current - 0.3) / 0.7;
      const translateX = spread * 120;

      if (leftBracketRef.current) {
        leftBracketRef.current.style.transform = `translateX(${-translateX}px)`;
      }
      if (rightBracketRef.current) {
        rightBracketRef.current.style.transform = `translateX(${translateX}px)`;
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
    <article ref={cardRef} className="group">
      {/* Project number + name with brackets */}
      <div className="mb-10 flex items-center justify-center gap-6 lg:mb-14">
        <span
          ref={leftBracketRef}
          className="text-5xl font-light text-white/20 will-change-transform lg:text-7xl"
        >
          [
        </span>
        <div className="text-center">
          <p className="text-xs text-white/40 mb-2">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            {project.name}
          </h3>
        </div>
        <span
          ref={rightBracketRef}
          className="text-5xl font-light text-white/20 will-change-transform lg:text-7xl"
        >
          ]
        </span>
      </div>

      {/* Project image */}
      <div className="relative mx-auto aspect-[4/3] w-full max-w-3xl overflow-hidden">
        <div
          ref={imageRef}
          className="relative h-full w-full will-change-transform"
          style={{ transform: "scale(0.3)" }}
        >
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-contain object-center"
            quality={85}
          />
        </div>
      </div>

      {/* Project year */}
      <div className="mx-auto mt-6 flex max-w-3xl justify-end">
        <p className="text-sm text-white/40">{project.year}</p>
      </div>
    </article>
  );
}

export default function Portfolio() {
  return (
    <section className="bg-black px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <div className="mb-20 border-b border-white/10 pb-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Selected Works
          </p>
        </div>

        {/* Projects list */}
        <div className="flex flex-col gap-32 lg:gap-44">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
