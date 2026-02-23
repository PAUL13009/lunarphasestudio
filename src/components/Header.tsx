"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import ServicesOverlay from "@/components/ServicesOverlay";
import ContactOverlay from "@/components/ContactOverlay";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "/projets", label: "Projets" },
  { href: "/a-propos", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const anyOverlayOpen = servicesOpen || contactOpen;

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const heroStart = vh * 1.2;
      const heroEnd = vh * 2.5;
      const y = window.scrollY;

      setVisible(y > heroStart && y < heroEnd);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <header
      className={`fixed top-0 w-full bg-black transition-transform duration-500 ease-in-out ${
        visible || anyOverlayOpen ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ zIndex: anyOverlayOpen ? 70 : 50 }}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
        >
          Deep Night Studio
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.href.startsWith("/") ? (
                <Link
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-wider text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-wider text-white/70 transition-colors hover:text-white"
                  onClick={(e) => {
                    if (link.href === "#services") {
                      e.preventDefault();
                      setServicesOpen(true);
                    } else if (link.href === "#contact") {
                      e.preventDefault();
                      setContactOpen(true);
                    }
                  }}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-8 md:flex">
          <span className="text-sm text-white/50">
            {currentTime} &middot; France
          </span>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            )}
          </svg>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-black/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("/") ? (
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:text-white"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (link.href === "#services") {
                        e.preventDefault();
                        setServicesOpen(true);
                      } else if (link.href === "#contact") {
                        e.preventDefault();
                        setContactOpen(true);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li className="mt-2 border-t border-white/10 pt-3">
              <a
                href="#contact"
                className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  setContactOpen(true);
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}

      {servicesOpen &&
        createPortal(
          <ServicesOverlay onClose={() => setServicesOpen(false)} />,
          document.body
        )}
      {contactOpen &&
        createPortal(
          <ContactOverlay onClose={() => setContactOpen(false)} />,
          document.body
        )}
    </header>
  );
}
