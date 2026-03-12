import SectionIntroLabel from "./ui/SectionIntroLabel";

export default function RememberWhen() {
  return (
    <section className="relative px-6 py-24">
      {/* SVG clip path definitions — all shapes are 350x400 */}
      <svg className="clip-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Original shape (image 1) */}
          <clipPath id="mask-1" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.002857, 0.0025)"
              d="M1.20005e-05 150L9.81496e-06 200L0 250C-3.62117e-06 332.843 67.1573 400 150 400H250C305.228 400 350 355.228 350 300C350 244.772 305.228 200 250 200C305.228 200 350 155.228 350 100C350 44.7715 305.229 6.78525e-06 250 4.37114e-06L150 0C67.1573 -3.62117e-06 1.56217e-05 67.1573 1.20005e-05 150Z"
            />
          </clipPath>
          {/* A-shape (image 2) */}
          <clipPath id="mask-2" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.002857, 0.0025)"
              d="M200 2.18557e-06L175 0L150 1.30732e-05C67.1573 5.83088e-06 2.14485e-05 67.1573 1.42062e-05 150L0 312.5C-4.2247e-06 360.825 39.1751 400 87.5 400C135.825 400 175 360.825 175 312.5C175 360.825 214.175 400 262.5 400C310.825 400 350 360.825 350 312.5V150C350 67.1573 282.843 9.42791e-06 200 2.18557e-06Z"
            />
          </clipPath>
          {/* U-shape (image 3) */}
          <clipPath id="mask-3" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.002857, 0.0025)"
              d="M150 400H175H200C282.843 400 350 332.843 350 250V87.5C350 39.1751 310.825 0 262.5 0C214.175 0 175 39.1751 175 87.5C175 39.1751 135.825 0 87.5 0C39.1751 0 0 39.1751 0 87.5V250C0 332.843 67.1573 400 150 400Z"
            />
          </clipPath>
        </defs>
      </svg>

      <div className="relative mx-auto max-w-4xl text-center">
        <SectionIntroLabel>Remember when</SectionIntroLabel>

        <h2 className="mt-6">
          Social media used to be{" "}
          <span className="italic text-tangerine">fun?</span>
        </h2>

        {/* Three masked photos */}
        <div className="mt-12 flex items-center justify-center gap-6 md:gap-10">
          {[
            {
              src: "/images/pexels-shvets-production-7194971.jpg",
              mask: "mask-1",
              position: "bottom" as const,
            },
            {
              src: "/images/pexels-didsss-7664407.jpg",
              mask: "mask-2",
              position: "center" as const,
            },
            {
              src: "/images/pexels-shvets-production-7533377 1.png",
              mask: "mask-3",
              position: "top" as const,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative w-[197px] h-[225px] md:w-[263px] md:h-[300px] overflow-hidden"
              style={{ clipPath: `url(#${item.mask})` }}
            >
              <img
                src={item.src}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: item.position }}
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
