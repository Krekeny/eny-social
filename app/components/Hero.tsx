"use client";

import { useState, useEffect } from "react";
import NavLink from "./ui/NavLink";

const words = ["people", "media", "communities"];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen px-6 pt-28 pb-20">
      {/* Tangerine blob */}
      <svg
        className="absolute -right-20 top-20 h-[500px] w-[500px] opacity-30"
        viewBox="0 0 500 500"
        fill="none"
      >
        <path
          d="M400 250C400 340 340 420 250 440C160 460 80 400 60 300C40 200 100 100 200 60C300 20 400 100 420 200C430 230 400 250 400 250Z"
          fill="var(--tangerine-dream)"
        />
      </svg>

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
                  {words.map((word, index) => (
                    <span
                      key={word}
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
                      {word}
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
          <div className="relative lg:col-span-6 lg:-mr-6 lg:-mt-28 lg:overflow-visible">
            {/* Blob clip path definition */}
            <svg className="absolute h-0 w-0" aria-hidden="true">
              <defs>
                <clipPath id="hero-blob" clipPathUnits="objectBoundingBox">
                  <path d="M0.25,-0.1 C0.45,-0.12,0.7,-0.1,1.1,-0.1 L1.1,0.75 C1.1,0.82,1.05,0.88,0.92,0.92 C0.75,0.98,0.55,1.05,0.38,0.98 C0.22,0.92,0.1,0.85,0.05,0.72 C-0.02,0.55,-0.04,0.38,0.02,0.22 C0.08,0.08,0.12,-0.04,0.25,-0.1" />
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
              className="relative w-[120%] aspect-[3/4] -mr-[20%]"
              style={{ clipPath: "url(#hero-blob)" }}
            >
              <img
                src="/images/pexels-kindelmedia-7148409 1.png"
                alt="People connecting"
                className="h-full w-full object-cover"
              />
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
