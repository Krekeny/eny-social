export default function WeBelieve() {
  return (
    <section className="relative px-6 py-24">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <span className="section-intro-label">We believe</span>

            <h2 className="mt-6">
              Your feed.
              <br />
              Your data.
              <br />
              <span className="italic text-pacific">Your voice.</span>
            </h2>

            <p className="section-copy mt-8 max-w-lg">
              The algorithms shaping your reality shouldn't be controlled by
              shareholders in Silicon Valley. At eny.social, you own your feed,
              your data, and your voice.
            </p>
          </div>

          {/* Photos + blob */}
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
              <div className="h-48 w-48 overflow-hidden rounded-full bg-gradient-to-br from-monte-carlo to-pacific md:h-56 md:w-56">
                <div className="flex h-full items-center justify-center text-white/40">
                  <svg
                    className="h-16 w-16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                  </svg>
                </div>
              </div>
              {/* Rounded rectangle photo */}
              <div className="h-56 w-40 overflow-hidden rounded-3xl bg-gradient-to-br from-cotton-candy to-tangerine md:h-64 md:w-44">
                <div className="flex h-full items-center justify-center text-white/40">
                  <svg
                    className="h-16 w-16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
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
