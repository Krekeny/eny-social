"use client";

import { useState, useEffect } from "react";
import GrainedBlob from "./GrainedBlob";
import FadeIn from "./ui/FadeIn";
import NavMenu from "./ui/NavMenu";

const slides = [
  { word: "people", image: "/images/pexels-kindelmedia-7148409 1.png" },
  { word: "media", image: "/images/pexels-ezkol-arnak-221099453-12569692.jpg" },
  { word: "communities", image: "/images/pexels-gabby-k-5384621.jpg" },
  { word: "services", image: "/images/pexels-guilhermealmeida-1858175.png" },
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
              <FadeIn>
                <p className="headline-label mb-4">a place where you can</p>
              </FadeIn>
              <h1>
                <FadeIn delay={100}>
                  <span className="stage-heading-1 block text-left">
                    Connect
                  </span>
                </FadeIn>
                <FadeIn delay={200}>
                  <span className="stage-heading-1 block text-right">with</span>
                </FadeIn>
                <FadeIn delay={300}>
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
                    <span className="stage-heading-2 invisible">
                      communities
                    </span>
                  </span>
                </FadeIn>
              </h1>
            </div>

            {/* Menu + sub-text side by side */}
            <div className="mt-12 grid lg:grid-cols-6 gap-4">
              {/* Menu links */}
              <NavMenu
                items={[
                  { label: "What", href: "#what" },
                  { label: "Values", href: "#values" },
                  { label: "Offenbach", href: "/offenbach" },
                  { label: "Waitlist", href: "#waitlist" },
                ]}
                className="hidden lg:col-span-1 lg:flex lg:flex-col lg:items-end"
                itemClassName="self-end text-right"
                baseDelay={400}
                stagger={80}
              />

              {/* Sub-heading + body */}
              <div className="lg:col-span-5 lg:pl-[calc(100%/5)]">
                <FadeIn delay={500}>
                  <h2 className="mb-3">
                    A social network that belongs to the people.
                  </h2>
                </FadeIn>
                <FadeIn delay={600}>
                  <p className="section-copy lg:pl-[calc(100%/4)] text-right">
                    <strong>
                      <s>No algorithms</s>
                    </strong>{" "}
                    shaping your reality.
                    <br />
                    Decentralized. Built and hosted in <strong>Europe</strong>.
                  </p>
                </FadeIn>
              </div>
            </div>
          </div>

          {/* Image (6 cols) — bleeds top + right, blob visible on left + bottom */}
          <div className="relative lg:col-span-6 lg:overflow-visible">
            {/* SVG clip-path with SMIL morph animation */}
            <svg className="absolute h-0 w-0" aria-hidden="true">
              <defs>
                <clipPath id="hero-blob" clipPathUnits="objectBoundingBox">
                  <path d="M0.9502,0.5487 C1.0731,0.7445,0.9515,1.0075,0.7345,0.9473 C0.6670,0.9286,0.4922,0.9118,0.4336,0.9537 C0.2466,1.0875,0.0064,0.9066,0.0696,0.6794 C0.0894,0.6084,0.0786,0.5322,0.0403,0.4712 C-0.0826,0.2754,0.0950,0.0193,0.3119,0.0794 C0.3795,0.0982,0.4523,0.0850,0.5108,0.0431 C0.6977,-0.0907,0.9993,0.1093,0.9361,0.3364 C0.9163,0.4074,0.9119,0.4876,0.9502,0.5487Z">
                    <animate
                      attributeName="d"
                      dur="12s"
                      repeatCount="indefinite"
                      values="
                        M0.9502,0.5487 C1.0731,0.7445,0.9515,1.0075,0.7345,0.9473 C0.6670,0.9286,0.4922,0.9118,0.4336,0.9537 C0.2466,1.0875,0.0064,0.9066,0.0696,0.6794 C0.0894,0.6084,0.0786,0.5322,0.0403,0.4712 C-0.0826,0.2754,0.0950,0.0193,0.3119,0.0794 C0.3795,0.0982,0.4523,0.0850,0.5108,0.0431 C0.6977,-0.0907,0.9993,0.1093,0.9361,0.3364 C0.9163,0.4074,0.9119,0.4876,0.9502,0.5487Z;
                        M0.9402,0.5587 C1.0631,0.7545,0.9615,1.0175,0.7445,0.9373 C0.6570,0.9186,0.5022,0.9218,0.4436,0.9437 C0.2566,1.0775,0.0164,0.9166,0.0596,0.6894 C0.0794,0.5984,0.0886,0.5422,0.0503,0.4612 C-0.0726,0.2854,0.1050,0.0293,0.3219,0.0694 C0.3895,0.0882,0.4423,0.0950,0.5208,0.0531 C0.7077,-0.0807,0.9893,0.1193,0.9261,0.3464 C0.9063,0.4174,0.9219,0.4776,0.9402,0.5587Z;
                        M0.9602,0.5387 C1.0831,0.7345,0.9415,0.9975,0.7245,0.9573 C0.6770,0.9386,0.4822,0.9018,0.4236,0.9637 C0.2366,1.0975,-0.0036,0.8966,0.0796,0.6694 C0.0994,0.6184,0.0686,0.5222,0.0303,0.4812 C-0.0926,0.2654,0.0850,0.0093,0.3019,0.0894 C0.3695,0.1082,0.4623,0.0750,0.5008,0.0331 C0.6877,-0.1007,1.0093,0.0993,0.9461,0.3264 C0.9263,0.3974,0.9019,0.4976,0.9602,0.5387Z;
                        M0.9502,0.5487 C1.0731,0.7445,0.9515,1.0075,0.7345,0.9473 C0.6670,0.9286,0.4922,0.9118,0.4336,0.9537 C0.2466,1.0875,0.0064,0.9066,0.0696,0.6794 C0.0894,0.6084,0.0786,0.5322,0.0403,0.4712 C-0.0826,0.2754,0.0950,0.0193,0.3119,0.0794 C0.3795,0.0982,0.4523,0.0850,0.5108,0.0431 C0.6977,-0.0907,0.9993,0.1093,0.9361,0.3364 C0.9163,0.4074,0.9119,0.4876,0.9502,0.5487Z
                      "
                    />
                  </path>
                </clipPath>
              </defs>
            </svg>

            {/* Full-size blob-masked photo */}
            <div
              className="relative w-[130%] -mr-[30%] lg:w-[170%] aspect-square lg:-mr-[70%] lg:[transform:translate(2%,-20%)] overflow-hidden"
              style={{ clipPath: "url(#hero-blob)" }}
            >
              {slides.map((slide, index) => (
                <img
                  key={slide.word}
                  src={slide.image}
                  alt={`People ${slide.word}`}
                  className="absolute inset-[-12%] h-[124%] w-[124%] object-cover"
                  style={{
                    transition:
                      "opacity 500ms ease-out, transform 3000ms ease-out",
                    opacity: currentIndex === index ? 1 : 0,
                    transform:
                      currentIndex === index ? "scale(1)" : "scale(1.06)",
                  }}
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
