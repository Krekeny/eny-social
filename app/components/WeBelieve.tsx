"use client";

import SectionIntroLabel from "./ui/SectionIntroLabel";
import FadeIn from "./ui/FadeIn";

export default function WeBelieve() {
  return (
    <section className="relative px-6 py-24">
      <div className="relative mx-auto max-w-4xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <FadeIn>
              <SectionIntroLabel>We believe</SectionIntroLabel>
            </FadeIn>

            <FadeIn delay={100}>
              <h2 className="mt-6">
                Your feed.
                <br />
                Your data.
                <br />
                <span className="italic text-pacific">Your voice.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="section-copy mt-8 max-w-lg">
                The algorithms shaping your reality shouldn&apos;t be controlled by
                shareholders in Silicon Valley. At eny.social, you own your feed,
                your data, and your voice.
              </p>
            </FadeIn>
          </div>

          {/* Photos + blob */}
          <FadeIn delay={300} direction="right">
            <div className="relative">
              {/* Monte Carlo blob */}
              <svg
                className="absolute -right-12 -top-12 h-80 w-80 opacity-20"
                viewBox="0 0 400 400"
                fill="none"
              >
                <path
                  d="M300 200C300 280 260 340 200 360C140 380 60 320 40 240C20 160 80 60 160 40C240 20 300 100 300 200Z"
                  fill="var(--monte-carlo)"
                />
              </svg>

              <div className="relative flex items-center justify-center gap-4">
                {/* Circular photo */}
                <div className="h-[25vw] w-[25vw] max-h-56 max-w-56 overflow-hidden rounded-full">
                  <img
                    src="/images/pexels-davner-ribeiro-2711547-4574405.jpg"
                    alt="Community"
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Rounded rectangle photo */}
                <div className="h-[30vw] w-[22vw] max-h-64 max-w-44 overflow-hidden rounded-3xl">
                  <img
                    src="/images/pexels-guilhermealmeida-1858175.png"
                    alt="Connection"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Decorative line */}
      <svg
        className="absolute -bottom-4 left-1/4 h-24 w-1/2 opacity-15"
        viewBox="0 0 600 80"
        fill="none"
      >
        <path
          d="M0 60 C100 10, 250 70, 400 30 S600 50, 600 50"
          stroke="var(--monte-carlo)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </section>
  );
}
