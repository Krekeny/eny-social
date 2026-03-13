import FadeIn from "./ui/FadeIn";
import { GRAIN_ENABLED } from "./ui/GrainFilter";

export default function ValueCards() {
  const cards = [
    {
      label: "",
      body: "",
      bg: "var(--tangerine-dream)",
      shape: "pill-right" as const,
    },
    {
      label: "Everything in one place",
      body: "People, media, and services. One home.",
      bg: "var(--cotton-candy)",
    },
    {
      label: "Secure by design",
      body: "We don't sell your data. Period.",
      bg: "var(--apricot-dream)",
      shape: "star" as const,
    },
    {
      label: "Made in Europe",
      body: "Built, hosted, and governed in Europe.",
      bg: "var(--monte-carlo)",
      shape: "pill-left" as const,
    },
    {
      label: "",
      body: "",
      bg: "var(--pacific-blue)",
      shape: "circle" as const,
    },
  ];

  return (
    <section id="values" className="relative py-24">
      <div className="relative">
        <div className="hide-scrollbar flex gap-6 overflow-x-auto pb-4 -ml-[140px] -mr-[140px] lg:-ml-[80px] lg:-mr-[80px] pl-0 pr-0 lg:justify-center items-center">
          {cards.map((card, i) => (
            <FadeIn key={i} delay={i * 120}>
            <div
              className={`relative shrink-0 overflow-hidden ${
                card.shape === "star"
                  ? "min-w-[320px] max-w-[320px] aspect-square flex items-center justify-center p-8"
                  : card.shape === "pill-left"
                  ? "min-w-[280px] max-w-[320px] rounded-tl-[50%] rounded-bl-[50%] rounded-tr-3xl rounded-br-3xl pl-24 pr-4 py-8"
                  : card.shape === "pill-right"
                  ? "min-w-[180px] max-w-[200px] h-[180px] rounded-tr-[50%] rounded-br-[50%] rounded-tl-3xl rounded-bl-3xl p-8"
                  : card.shape === "circle"
                  ? "w-[180px] h-[180px] rounded-full"
                  : "min-w-[280px] max-w-[320px] rounded-3xl p-8"
              }`}
              style={{
                backgroundColor: card.bg,
                ...(card.shape === "star"
                  ? { clipPath: "url(#star-clip)" }
                  : {}),
              }}
            >
              {/* Grain overlay */}
              {GRAIN_ENABLED && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ filter: "url(#grain)" }}
                >
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: card.bg }}
                  />
                </div>
              )}
              {(card.label || card.body) && (
                <div
                  className={`relative flex flex-col ${
                    card.shape === "star"
                      ? "items-center text-center justify-center"
                      : "h-full"
                  }`}
                >
                  <span
                    className={`headline-label mb-6 ${
                      card.shape === "star" ? "" : "self-start"
                    }`}
                  >
                    {card.label}
                  </span>
                  <p className="card-headline">{card.body}</p>
                </div>
              )}
            </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
