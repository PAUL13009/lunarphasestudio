"use client";

import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      {/* Spacer to make room for the fixed footer */}
      <div style={{ height: footerHeight }} />

      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 z-0 w-full bg-black px-6 pb-8 pt-12 lg:px-10"
      >
        <div className="mx-auto max-w-[1400px]">
          <h2
            className="select-none text-center font-bold uppercase leading-[0.85] tracking-tighter text-white"
            style={{ fontSize: "clamp(3rem, 12vw, 13rem)" }}
          >
            Lunar Phase Studio
          </h2>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
            <p>All rights reserved &copy; Lunar Phase Studio {currentYear}</p>
            <div className="flex gap-8">
              <a href="#" className="transition-colors hover:text-white">
                Politique de confidentialité
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Mentions légales
              </a>
            </div>
            <p>
              Website by <span className="text-white/70">Lunar Phase Studio</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
