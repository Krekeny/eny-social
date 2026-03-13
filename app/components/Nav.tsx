"use client";

import { useState, useEffect } from "react";
import ButtonCta from "./ui/ButtonCta";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-linen/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1536px] items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center">
          <img src="/logos/eny-logo-variant.svg" alt="eny.social" className="h-10" />
        </a>
        <ButtonCta href="/#waitlist">join the waitlist</ButtonCta>
      </div>
    </nav>
  );
}
