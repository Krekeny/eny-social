export default function ValueCards() {
  const cards = [
    {
      type: "text" as const,
      label: "Everything in one place",
      body: "People, media, and services. One home.",
      bg: "var(--cotton-candy)",
    },
    { type: "image" as const, gradient: "from-monte-carlo to-pacific" },
    {
      type: "text" as const,
      label: "Secure by design",
      body: "We don't sell your data. Period.",
      bg: "var(--apricot-dream)",
    },
    { type: "image" as const, gradient: "from-cotton-candy to-tangerine" },
    {
      type: "text" as const,
      label: "Made in Europe",
      body: "Built, hosted, and governed in Europe.",
      bg: "var(--monte-carlo)",
    },
  ];

  return (
    <section className="relative py-24">
      {/* Grain filter definition */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="grain" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" stitchTiles="stitch" seed="1581" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
            <feComponentTransfer in="alphaNoise" result="coloredNoise">
              <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" />
            </feComponentTransfer>
            <feComposite operator="in" in2="SourceGraphic" in="coloredNoise" result="noiseClipped" />
            <feFlood floodColor="rgba(0, 0, 0, 0.05)" result="colorFlood" />
            <feComposite operator="in" in2="noiseClipped" in="colorFlood" result="colorNoise" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="colorNoise" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="relative">
        <div className="hide-scrollbar flex gap-6 overflow-x-auto px-6 pb-4 md:px-12">
          {cards.map((card, i) =>
            card.type === "text" ? (
              <div
                key={i}
                className="relative min-w-[280px] max-w-[320px] shrink-0 overflow-hidden rounded-3xl p-8"
                style={{ backgroundColor: card.bg }}
              >
                {/* Grain overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ filter: "url(#grain)" }}
                >
                  <div className="h-full w-full" style={{ backgroundColor: card.bg }} />
                </div>
                <div className="relative flex h-full flex-col justify-between">
                  <span className="headline-label mb-6 self-start">
                    {card.label}
                  </span>
                  <p className="card-headline">
                    {card.body}
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={i}
                className={`min-w-[220px] max-w-[260px] shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient}`}
              >
                {/* Mood image placeholder with blob overlay */}
                <div className="relative h-64">
                  <svg
                    className="absolute inset-0 h-full w-full opacity-30"
                    viewBox="0 0 260 260"
                    fill="none"
                  >
                    <path
                      d="M180 130C180 170 160 210 130 220C100 230 60 200 40 160C20 120 50 60 90 40C130 20 180 70 180 130Z"
                      fill="white"
                    />
                  </svg>
                  <div className="flex h-full items-center justify-center text-white/30">
                    <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
