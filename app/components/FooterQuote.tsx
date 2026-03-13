"use client";

import FadeIn from "./ui/FadeIn";

export default function FooterQuote() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <FadeIn>
          <blockquote className="quote">
            &ldquo;Social media should be public infrastructure. Like roads, libraries or public
            spaces. Open, transparent and built for the people who use it.&rdquo;
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
}
