import { GRAIN_ENABLED } from "./ui/GrainFilter";

const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="150" height="150" filter="url(#n)" opacity="1"/></svg>`;
const noiseHref = `data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}`;

const INITIAL_D =
  "M994.079 254.763C1273.76 285.396 1370.84 647.705 1143.95 814.073C1074.74 864.815 1030.37 943.802 1023.8 1029.36C1002.5 1306.34 644.568 1402.24 487.638 1173.02C439.161 1102.22 361.242 1056 275.94 1046.65C-3.73878 1016.02 -100.819 653.713 126.073 487.345C195.276 436.603 239.646 357.615 246.224 272.056C267.52 -4.91779 625.452 -100.825 782.381 128.393C830.858 199.2 908.777 245.42 994.079 254.763Z";

interface GrainedBlobProps {
  className?: string;
}

export default function GrainedBlob({ className }: GrainedBlobProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1271 1302"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {GRAIN_ENABLED && (
        <defs>
          <pattern
            id="blob-grain"
            patternUnits="userSpaceOnUse"
            width="50"
            height="50"
          >
            <image href={noiseHref} width="150" height="150" />
          </pattern>
        </defs>
      )}
      <path d={INITIAL_D} fill="var(--cotton-candy)"></path>
      {GRAIN_ENABLED && (
        <path
          d={INITIAL_D}
          fill="url(#blob-grain)"
          opacity="0.45"
          style={{ mixBlendMode: "multiply" }}
        ></path>
      )}
    </svg>
  );
}
