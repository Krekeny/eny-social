"use client";

import { useState, useEffect } from "react";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";

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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-tangerine" />
          <span className="text-xl font-medium text-charcoal">eny.social</span>
        </div>
        <a
          href="#waitlist"
          className="group flex items-center gap-2 rounded-full bg-charcoal py-0 pl-[14px] pr-[3px] font-['Instrument_Sans'] text-[20px] font-medium leading-[200%] tracking-[-0.6px] text-linen transition-colors hover:bg-tangerine"
        >
          join the waitlist
          <ArrowCircleRightIcon className="h-8 w-8 transition-transform group-hover:translate-x-0.5" weight="regular" />
        </a>
      </div>
    </nav>
  );
}
