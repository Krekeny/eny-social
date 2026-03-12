"use client";

import { useState, useEffect } from "react";
import NavLink from "./ui/NavLink";
import GrainedBlob from "./GrainedBlob";

const slides = [
  { word: "people", image: "/images/pexels-kindelmedia-7148409 1.png" },
  { word: "media", image: "/images/pexels-shvets-production-7533377 1.png" },
  { word: "communities", image: "/images/pexels-guilhermealmeida-1858175.png" },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen px-6 pt-28 pb-20">
      {/* Grained star blob — decorative, bleeds left edge, behind text */}
      <GrainedBlob className="pointer-events-none absolute -left-[40%] -top-[10%] h-[120vh] w-[120vh]" />

      <div className="relative mx-auto max-w-xl lg:max-w-[1536px]">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Heading + Text (6 cols) */}
          <div className="relative z-10 lg:col-span-6">
            {/* Heading indented 1 col */}
            <div className="lg:pl-[calc(100%/6)]">
              <p className="headline-label mb-4">a place where you can</p>
              <h1>
                <span className="stage-heading-1 block text-left">Connect</span>
                <span className="stage-heading-1 block text-right">with</span>
                <span className="relative block text-right">
                  {slides.map((slide, index) => (
                    <span
                      key={slide.word}
                      className="stage-heading-2 absolute right-0 top-0 transition-all duration-500"
                      style={{
                        opacity: currentIndex === index ? 1 : 0,
                        transform:
                          currentIndex === index
                            ? "translateY(0)"
                            : currentIndex > index
                            ? "translateY(-20px)"
                            : "translateY(20px)",
                      }}
                    >
                      {slide.word}
                    </span>
                  ))}
                  {/* Invisible placeholder for sizing */}
                  <span className="stage-heading-2 invisible">communities</span>
                </span>
              </h1>
            </div>

            {/* Menu + sub-text side by side */}
            <div className="mt-12 grid lg:grid-cols-6 gap-4">
              {/* Menu links */}
              <div className="hidden lg:col-span-1 lg:flex lg:flex-col lg:items-end">
                {[
                  "What",
                  "How does it work",
                  "offenbach.social",
                  "Blog",
                  "Contact",
                ].map((link) => (
                  <NavLink key={link} href="#">
                    {link}
                  </NavLink>
                ))}
              </div>

              {/* Sub-heading + body */}
              <div className="lg:col-span-5 lg:pl-[calc(100%/5)]">
                <h2 className="mb-3">
                  A social network that belongs to the people.
                </h2>
                <p className="section-copy lg:pl-[calc(100%/4)] text-right">
                  <strong>No algorithms</strong> shaping your reality.
                  Decentralized. Built and hosted in <strong>Europe</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Image (6 cols) — bleeds top + right, blob visible on left + bottom */}
          <div className="relative lg:col-span-6 lg:overflow-visible">
            {/* Full-size blob-masked photo */}
            <div
              className="relative w-[130%] -mr-[30%] lg:w-[170%] aspect-square lg:-mr-[70%] lg:[transform:translate(2%,-20%)] overflow-hidden"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                animation: "blob-breathe 12s ease-in-out infinite",
              }}
            >
              {slides.map((slide, index) => (
                <img
                  key={slide.word}
                  src={slide.image}
                  alt={`People ${slide.word}`}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: currentIndex === index ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative curved line */}
      <svg
        className="absolute bottom-0 left-0 h-32 w-full opacity-20"
        viewBox="0 0 1200 100"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80 C300 20, 600 90, 900 30 S1200 60, 1200 60"
          stroke="var(--tangerine-dream)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </section>
  );
}
