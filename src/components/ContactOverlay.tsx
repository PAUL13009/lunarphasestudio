"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import RotatingText from "@/components/RotatingText";

export default function ContactOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"closed" | "open" | "hiding" | "curtain">("closed");
  const closing = useRef(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const timer = setTimeout(() => setPhase("open"), 50);
    return () => {
      document.documentElement.style.overflow = "";
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const triggerClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setPhase("hiding");
    setTimeout(() => setPhase("curtain"), 400);
    setTimeout(onClose, 1200);
  }, [onClose]);

  const isOpen = phase === "open";
  const showContent = phase === "open";
  const showCurtain = phase === "open" || phase === "hiding";
  const isHiding = phase === "hiding";

  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    if (showContent) {
      const t = setTimeout(() => setTitleVisible(true), 1000);
      return () => clearTimeout(t);
    } else {
      setTitleVisible(false);
    }
  }, [showContent]);

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

      {/* Image - curtain */}
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
          alt="Contact"
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
        <h2 className="text-3xl font-bold uppercase tracking-tight text-white lg:text-5xl">
          {titleVisible && (
            <RotatingText
              texts={["Contactez-nous"]}
              auto={false}
              animatePresenceInitial={true}
              splitBy="characters"
              staggerFrom="first"
              staggerDuration={0.025}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            />
          )}
        </h2>
      </div>

      {/* Contact form - right half */}
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
        <p className="mb-8 text-sm uppercase leading-relaxed tracking-wider text-white lg:text-base">
          Un projet en tête ? Parlez-nous de vos ambitions.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-6"
        >
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                Nom
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full border-b border-white/15 bg-transparent py-3 text-sm capitalize text-white outline-none placeholder:normal-case placeholder:text-white/20 focus:border-white/50 transition-colors duration-300"
              />
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                Prénom
              </label>
              <input
                type="text"
                placeholder="Votre prénom"
                className="w-full border-b border-white/15 bg-transparent py-3 text-sm capitalize text-white outline-none placeholder:normal-case placeholder:text-white/20 focus:border-white/50 transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="Votre email"
              className="w-full border-b border-white/15 bg-transparent py-3 text-sm text-white outline-none placeholder:normal-case placeholder:text-white/20 focus:border-white/50 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white">
              Téléphone
            </label>
            <input
              type="tel"
              placeholder="Votre numéro de téléphone"
              className="w-full border-b border-white/15 bg-transparent py-3 text-sm text-white outline-none placeholder:normal-case placeholder:text-white/20 focus:border-white/50 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white">
              Société
            </label>
            <input
              type="text"
              placeholder="Votre entreprise"
              className="w-full border-b border-white/15 bg-transparent py-3 text-sm capitalize text-white outline-none placeholder:normal-case placeholder:text-white/20 focus:border-white/50 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Décrivez votre projet..."
              className="w-full resize-none border-b border-white/15 bg-transparent py-3 text-sm text-white outline-none placeholder:normal-case placeholder:text-white/20 focus:border-white/50 transition-colors duration-300"
            />
          </div>

          <button
            type="submit"
            className="mt-4 self-start border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
