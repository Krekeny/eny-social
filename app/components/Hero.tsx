"use client";

import { useState, useEffect } from "react";
import NavLink from "./ui/NavLink";

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
      <img
        src="/shapes/star-grained.svg"
        alt=""
        className="pointer-events-none absolute -left-[30%] -top-[10%] h-[120vh] w-[120vh]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Heading + Text (6 cols) */}
          <div className="lg:col-span-6">
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
              <div className="hidden lg:col-span-2 lg:flex lg:flex-col lg:items-end">
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
              <div className="lg:col-span-4">
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
            {/* Blob clip path definition */}
            <svg className="absolute h-0 w-0" aria-hidden="true">
              <defs>
                <clipPath id="hero-blob" clipPathUnits="objectBoundingBox">
                  <path d="M0.9502,0.5487 C1.0731,0.7445,0.9515,1.0075,0.7345,0.9473 C0.6670,0.9286,0.4922,0.9118,0.4336,0.9537 C0.2466,1.0875,0.0064,0.9066,0.0696,0.6794 C0.0894,0.6084,0.0786,0.5322,0.0403,0.4712 C-0.0826,0.2754,0.0950,0.0193,0.3119,0.0794 C0.3795,0.0982,0.4523,0.0850,0.5108,0.0431 C0.6977,-0.0907,0.9993,0.1093,0.9361,0.3364 C0.9163,0.4074,0.9119,0.4876,0.9502,0.5487Z" />
                </clipPath>
              </defs>
            </svg>
            {/* Monte Carlo accent blob behind photo */}
            <svg
              className="absolute -bottom-8 -left-8 h-48 w-48 opacity-40"
              viewBox="0 0 200 200"
              fill="none"
            >
              <path
                d="M150 100C150 140 130 170 100 180C70 190 30 160 20 120C10 80 40 30 80 20C120 10 150 50 150 100Z"
                fill="var(--monte-carlo)"
              />
            </svg>
            {/* Full-size blob-masked photo */}
            <div
              className="relative w-[160%] aspect-square -mr-[50%]"
              style={{
                clipPath: "url(#hero-blob)",
                transform: "translate(20%, -14%)",
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
