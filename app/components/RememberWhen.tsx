export default function RememberWhen() {
  return (
    <section className="relative px-6 py-24">
      {/* SVG clip path definition */}
      <svg className="clip-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="custom-mask" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.002857, 0.0025)"
              d="M1.20005e-05 150L9.81496e-06 200L0 250C-3.62117e-06 332.843 67.1573 400 150 400H250C305.228 400 350 355.228 350 300C350 244.772 305.228 200 250 200C305.228 200 350 155.228 350 100C350 44.7715 305.229 6.78525e-06 250 4.37114e-06L150 0C67.1573 -3.62117e-06 1.56217e-05 67.1573 1.20005e-05 150Z"
            />
          </clipPath>
        </defs>
      </svg>

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

        {/* Three masked photos */}
        <div className="mt-12 flex items-center justify-center gap-6 md:gap-10">
          {[
            "from-monte-carlo to-pacific",
            "from-apricot to-tangerine",
            "from-cotton-candy to-tangerine",
          ].map((bg, i) => (
            <div
              key={i}
              className="masked-container w-[197px] h-[225px] md:w-[263px] md:h-[300px]"
            >
              {/* Gradient placeholder until real images are added */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${bg}`}
                style={{ width: "140%", height: "140%", top: "-20%", left: "-20%" }}
              />
            </div>
          ))}
        </div>

        <p className="section-copy mx-auto mt-12 max-w-2xl">
          Finding new people. Discovering communities that get you. Tools that
          actually help. Somewhere along the way, that got buried under ads,
          algorithms, and engagement traps.{" "}
          <strong>We&apos;re building it back.</strong>
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
