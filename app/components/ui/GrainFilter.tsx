/**
 * Shared SVG definitions + CSS grain overlay.
 *
 * Uses a tiny tiled SVG noise pattern as a CSS background — rendered once
 * by the browser, then composited as a static raster layer. This is
 * dramatically cheaper than live feTurbulence filters, especially on mobile.
 *
 * Toggle GRAIN_ENABLED to disable all grain effects site-wide.
 */

export const GRAIN_ENABLED = false;

/**
 * Inline SVG data-URI that produces a 200×200 fractalNoise tile.
 * The browser rasterises it once; repeating it via background-image is free.
 */
const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="200" height="200" filter="url(#n)" opacity="1"/></svg>`;

export const noiseDataUri = `url("data:image/svg+xml,${encodeURIComponent(
  NOISE_SVG
)}")`;

/**
 * CSS properties you can spread onto any element to add a grain overlay.
 * Apply via a pseudo-element or an overlay div with pointer-events-none.
 */
export const grainStyle: React.CSSProperties = {
  backgroundImage: noiseDataUri,
  backgroundRepeat: "repeat",
  backgroundSize: "200px 200px",
  opacity: 0.4,
  mixBlendMode: "multiply",
};

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
      </defs>
    </svg>
  );
}
