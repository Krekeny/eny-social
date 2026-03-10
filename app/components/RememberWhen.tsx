export default function RememberWhen() {
  return (
    <section className="relative px-6 py-24">
      {/* Decorative blob */}
      <svg
        className="absolute -left-16 top-0 h-64 w-64 opacity-15"
        viewBox="0 0 300 300"
        fill="none"
      >
        <path
          d="M200 150C200 210 170 260 130 270C90 280 40 240 20 180C0 120 40 50 100 30C160 10 200 70 200 150Z"
          fill="var(--monte-carlo)"
        />
      </svg>

      <div className="relative mx-auto max-w-4xl text-center">
        <span className="section-intro-label">Remember when</span>

        <h2 className="mt-6">
          Social media used to be{" "}
          <span className="italic text-tangerine">fun?</span>
        </h2>

        {/* Three circular photos */}
        <div className="mt-12 flex items-center justify-center gap-6 md:gap-10">
          {[
            { bg: "from-monte-carlo to-pacific", size: "h-28 w-28 md:h-36 md:w-36" },
            { bg: "from-apricot to-tangerine", size: "h-32 w-32 md:h-40 md:w-40" },
            { bg: "from-cotton-candy to-tangerine", size: "h-28 w-28 md:h-36 md:w-36" },
          ].map((photo, i) => (
            <div
              key={i}
              className={`${photo.size} overflow-hidden rounded-full bg-gradient-to-br ${photo.bg}`}
            >
              <div className="flex h-full items-center justify-center text-white/40">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <p className="section-copy mx-auto mt-12 max-w-2xl">
          Finding new people. Discovering communities that get you. Tools that actually make your
          life easier. That magic didn&apos;t disappear — it just needs a better home.
        </p>
      </div>

      {/* Decorative curved line */}
      <svg
        className="absolute bottom-4 right-0 h-40 w-1/2 opacity-15"
        viewBox="0 0 600 120"
        fill="none"
      >
        <path
          d="M0 100 C150 20, 300 100, 450 40 S600 80, 600 80"
          stroke="var(--cotton-candy)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </section>
  );
}
