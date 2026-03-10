export default function StartingInOffenbach() {
  return (
    <section className="relative px-6 py-24">
      {/* Decorative blob */}
      <svg
        className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 opacity-15"
        viewBox="0 0 300 300"
        fill="none"
      >
        <path
          d="M220 150C220 210 190 260 150 270C110 280 50 240 30 180C10 120 50 50 110 30C170 10 220 70 220 150Z"
          fill="var(--tangerine-dream)"
        />
      </svg>

      <div className="relative mx-auto max-w-4xl text-center">
        <span className="stage-label">Starting in Offenbach</span>

        <h2 className="mt-6">
          Your city. Your community.{" "}
          <span className="italic text-tangerine">One app.</span>
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-charcoal/80 md:text-xl">
          Find your neighbors, discover local events, navigate city services — from finding an
          apartment to figuring out trash collection day. Everything Offenbach, in one place.
        </p>
      </div>
    </section>
  );
}
