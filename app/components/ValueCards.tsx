export default function ValueCards() {
  const cards = [
    {
      type: "text" as const,
      label: "Everything in one place",
      body: "People, media, and services. One home.",
    },
    { type: "image" as const, gradient: "from-monte-carlo to-pacific" },
    {
      type: "text" as const,
      label: "Secure by design",
      body: "We don't sell your data. Period.",
    },
    { type: "image" as const, gradient: "from-cotton-candy to-tangerine" },
    {
      type: "text" as const,
      label: "Made in Europe",
      body: "Built, hosted, and governed in Europe.",
    },
  ];

  return (
    <section className="relative py-24">
      {/* Tangerine background band */}
      <div className="absolute inset-0 bg-tangerine/8" />

      <div className="relative">
        <div className="hide-scrollbar flex gap-6 overflow-x-auto px-6 pb-4 md:px-12">
          {cards.map((card, i) =>
            card.type === "text" ? (
              <div
                key={i}
                className="flex min-w-[280px] max-w-[320px] shrink-0 flex-col justify-between rounded-3xl bg-linen p-8 shadow-sm"
              >
                <span className="headline-label mb-6 self-start">
                  {card.label}
                </span>
                <p className="font-serif text-2xl leading-snug text-charcoal">
                  {card.body}
                </p>
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
