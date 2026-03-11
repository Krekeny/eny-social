"use client";

import { ArrowCircleRightIcon } from "@phosphor-icons/react";

const avatars = [
  { top: "8%", left: "10%", size: 48, delay: 0 },
  { top: "15%", right: "12%", size: 40, delay: 1.2 },
  { top: "60%", left: "5%", size: 36, delay: 0.8 },
  { top: "70%", right: "8%", size: 44, delay: 2 },
  { top: "35%", left: "85%", size: 32, delay: 1.5 },
  { top: "80%", left: "20%", size: 38, delay: 0.4 },
  { top: "25%", left: "3%", size: 42, delay: 1.8 },
  { top: "50%", right: "3%", size: 34, delay: 0.6 },
];

const colors = [
  "bg-tangerine",
  "bg-monte-carlo",
  "bg-cotton-candy",
  "bg-pacific",
  "bg-apricot",
  "bg-monte-carlo",
  "bg-cotton-candy",
  "bg-pacific",
];

export default function Waitlist() {
  return (
    <section id="waitlist" className="relative overflow-hidden px-6 py-32">
      {/* Floating avatars */}
      {avatars.map((avatar, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${colors[i]} opacity-60`}
          style={{
            top: avatar.top,
            left: "left" in avatar ? avatar.left : undefined,
            right: "right" in avatar ? avatar.right : undefined,
            width: avatar.size,
            height: avatar.size,
            animation: `${i % 2 === 0 ? "float" : "float-slow"} ${
              6 + i
            }s ease-in-out infinite`,
            animationDelay: `${avatar.delay}s`,
          }}
        >
          <div className="flex h-full items-center justify-center text-white/50">
            <svg
              className="h-1/2 w-1/2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
        </div>
      ))}

      {/* Decorative connecting lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M120 60 C300 200, 500 100, 600 300 S900 400, 1080 150"
          stroke="var(--tangerine-dream)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M100 500 C250 350, 450 450, 600 300 S850 200, 1100 400"
          stroke="var(--monte-carlo)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Small blob accents */}
      <svg
        className="absolute left-1/4 top-1/4 h-24 w-24 opacity-10"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M70 50C70 70 60 85 50 90C40 95 20 80 15 60C10 40 25 15 45 10C65 5 70 25 70 50Z"
          fill="var(--pacific-blue)"
        />
      </svg>

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="section-intro-label">Come on in</span>

        <h2 className="mt-6">
          Join the first <span className="italic text-tangerine">1,000</span>
        </h2>

        <p className="section-copy mx-auto mt-6 max-w-lg">
          The algorithms shaping your reality shouldn't be controlled by
          shareholders in Silicon Valley. At eny.social, you own your feed, your
          data, and your voice.
        </p>

        <a
          href="#"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-charcoal py-0 pl-[14px] pr-[3px] font-['Instrument_Sans'] text-[20px] font-medium leading-[200%] tracking-[-0.6px] text-linen transition-colors hover:bg-tangerine"
        >
          join the waitlist
          <ArrowCircleRightIcon className="h-8 w-8 transition-transform group-hover:translate-x-1" weight="regular" />
        </a>
      </div>
    </section>
  );
}
