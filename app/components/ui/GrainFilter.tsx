/**
 * Shared SVG grain filter definitions.
 * Render once (e.g. in layout or page root) — all components reference by id.
 *
 * Toggle GRAIN_ENABLED to disable all grain effects site-wide.
 */

export const GRAIN_ENABLED = false;

export default function GrainFilter() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true">
      <defs>
        {/* Star clip-path — used by ValueCards (always needed) */}
        <clipPath id="star-clip" clipPathUnits="objectBoundingBox">
          <path
            transform="scale(0.003030, 0.002976)"
            d="M269.049 70.5681C302.25 60.8121 326.225 102.338 301.176 126.212C285.271 141.371 288.453 167.64 307.572 178.467L314.263 182.256C343.038 198.551 329.55 242.538 296.568 240.162C274.702 238.586 258.156 259.678 264.971 280.513C275.346 312.232 234.971 335.542 212.689 310.698C198.052 294.378 171.514 298.162 161.945 317.886C147.512 347.638 102.674 337.325 102.95 304.258L103.014 296.569C103.197 274.598 82.0388 258.707 60.9583 264.902C27.7579 274.658 3.78289 233.132 28.832 209.258C44.737 194.099 41.5545 167.83 22.4355 157.003L15.7443 153.214C-13.0301 136.919 0.457428 92.9322 33.44 95.3084C55.3054 96.8837 71.8515 75.7925 65.0365 54.9565C54.6619 23.238 95.0367 -0.0723286 117.318 24.7715C131.955 41.0915 158.494 37.3078 168.062 17.5841C182.496 -12.1677 227.333 -1.85504 227.058 31.2118L226.994 38.9011C226.811 60.8722 247.969 76.7627 269.049 70.5681Z"
          />
        </clipPath>

        {/* Generic dark grain — used by ValueCards shapes */}
        {GRAIN_ENABLED && (
          <filter
            id="grain"
            x="0"
            y="0"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.5"
              numOctaves="3"
              stitchTiles="stitch"
              seed="1581"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="luminanceToAlpha"
              result="alphaNoise"
            />
            <feComponentTransfer in="alphaNoise" result="coloredNoise">
              <feFuncA
                type="discrete"
                tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
              />
            </feComponentTransfer>
            <feComposite
              operator="in"
              in2="SourceGraphic"
              in="coloredNoise"
              result="noiseClipped"
            />
            <feFlood floodColor="rgba(0, 0, 0, 0.05)" result="colorFlood" />
            <feComposite
              operator="in"
              in2="noiseClipped"
              in="colorFlood"
              result="colorNoise"
            />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="colorNoise" />
            </feMerge>
          </filter>
        )}
      </defs>
    </svg>
  );
}
