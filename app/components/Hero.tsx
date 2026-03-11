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
    <section className="relative min-h-screen overflow-hidden px-6 pt-28 pb-20">
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
          {/* Left sidebar links */}
          <div className="hidden lg:col-span-2 lg:flex lg:flex-col lg:items-end lg:justify-end">
            {["What", "How does it work", "offenbach.social", "Blog", "Contact"].map((link) => (
              <NavLink key={link} href="#">{link}</NavLink>
            ))}
          </div>

          {/* Main content */}
          <div className="lg:col-span-6">
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

            <div className="mt-12 max-w-md">
              <h2 className="mb-3">
                A social network that belongs to the people.
              </h2>
              <p className="section-copy text-right">
                <strong>No algorithms</strong> shaping your
                reality. Decentralized. Built and hosted in{" "}
                <strong>Europe</strong>.
              </p>
            </div>
          </div>

          {/* Right photo + blob */}
          <div className="relative lg:col-span-4">
            <div className="relative mx-auto h-72 w-72 lg:h-96 lg:w-96">
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
              {/* Circular photo placeholder */}
              <div className="relative h-72 w-72 overflow-hidden rounded-full bg-gradient-to-br from-apricot to-tangerine lg:h-96 lg:w-96">
                <div className="flex h-full items-center justify-center text-linen/60">
                  <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                  </svg>
                </div>
              </div>
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
