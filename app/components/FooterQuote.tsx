"use client";

import { useRef, useState, useEffect } from "react";

const QUOTE =
  "\u201CSocial media should be public infrastructure. Like roads, libraries or public spaces. Open, transparent and built for the people who use it.\u201D";

export default function FooterQuote() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          const words = QUOTE.split(" ");
          const totalDuration = 1200;
          const stepDuration = totalDuration / words.length;

          words.forEach((_, i) => {
            setTimeout(() => {
              setProgress(i + 1);
            }, i * stepDuration);
          });
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = QUOTE.split(" ");

  return (
    <section ref={ref} className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <blockquote className="quote">
          {words.map((word, i) => (
            <span
              key={i}
              className="transition-colors duration-300"
              style={{
                color:
                  i < progress
                    ? "var(--dusk-blue)"
                    : "color-mix(in srgb, var(--dusk-blue) 15%, transparent)",
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </blockquote>
      </div>
    </section>
  );
}
