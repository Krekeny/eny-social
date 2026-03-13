import { GRAIN_ENABLED } from "./ui/GrainFilter";

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
      <g filter={GRAIN_ENABLED ? "url(#grain-filter)" : undefined}>
        <path
          d="M994.079 254.763C1273.76 285.396 1370.84 647.705 1143.95 814.073C1074.74 864.815 1030.37 943.802 1023.8 1029.36C1002.5 1306.34 644.568 1402.24 487.638 1173.02C439.161 1102.22 361.242 1056 275.94 1046.65C-3.73878 1016.02 -100.819 653.713 126.073 487.345C195.276 436.603 239.646 357.615 246.224 272.056C267.52 -4.91779 625.452 -100.825 782.381 128.393C830.858 199.2 908.777 245.42 994.079 254.763Z"
          fill="var(--cotton-candy)"
        >
          <animate
            attributeName="d"
            dur="14s"
            repeatCount="indefinite"
            values="
              M994.079 254.763C1273.76 285.396 1370.84 647.705 1143.95 814.073C1074.74 864.815 1030.37 943.802 1023.8 1029.36C1002.5 1306.34 644.568 1402.24 487.638 1173.02C439.161 1102.22 361.242 1056 275.94 1046.65C-3.73878 1016.02 -100.819 653.713 126.073 487.345C195.276 436.603 239.646 357.615 246.224 272.056C267.52 -4.91779 625.452 -100.825 782.381 128.393C830.858 199.2 908.777 245.42 994.079 254.763Z;
              M1014.08 244.76C1293.76 275.39 1360.84 657.71 1133.95 824.07C1064.74 874.82 1040.37 933.80 1033.80 1019.36C1012.50 1296.34 654.57 1412.24 497.64 1183.02C449.16 1112.22 351.24 1066.00 265.94 1056.65C-13.74 1026.02 -90.82 643.71 136.07 477.35C205.28 426.60 249.65 347.62 256.22 262.06C277.52 -14.92 635.45 -110.83 792.38 118.39C840.86 189.20 918.78 235.42 1014.08 244.76Z;
              M984.08 264.76C1263.76 295.40 1380.84 637.71 1153.95 804.07C1084.74 854.82 1020.37 953.80 1013.80 1039.36C992.50 1316.34 634.57 1392.24 477.64 1163.02C429.16 1092.22 371.24 1046.00 285.94 1036.65C6.26 1006.02 -110.82 663.71 116.07 497.35C185.28 446.60 229.65 367.62 236.22 282.06C257.52 5.08 615.45 -90.83 772.38 138.39C820.86 209.20 898.78 255.42 984.08 264.76Z;
              M994.079 254.763C1273.76 285.396 1370.84 647.705 1143.95 814.073C1074.74 864.815 1030.37 943.802 1023.8 1029.36C1002.5 1306.34 644.568 1402.24 487.638 1173.02C439.161 1102.22 361.242 1056 275.94 1046.65C-3.73878 1016.02 -100.819 653.713 126.073 487.345C195.276 436.603 239.646 357.615 246.224 272.056C267.52 -4.91779 625.452 -100.825 782.381 128.393C830.858 199.2 908.777 245.42 994.079 254.763Z
            "
          />
        </path>
      </g>
      {GRAIN_ENABLED && (
        <defs>
          <filter
            id="grain-filter"
            x="0"
            y="0"
            width="1270.02"
            height="1301.42"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75 0.75"
              stitchTiles="stitch"
              numOctaves={1}
              result="noise"
              seed={939}
            />
            <feColorMatrix
              in="noise"
              type="luminanceToAlpha"
              result="alphaNoise"
            />
            <feComponentTransfer in="alphaNoise" result="coloredNoise1">
              <feFuncA
                type="discrete"
                tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
              />
            </feComponentTransfer>
            <feComposite
              operator="in"
              in2="shape"
              in="coloredNoise1"
              result="noise1Clipped"
            />
            <feFlood
              floodColor="color-mix(in srgb, var(--cotton-candy) 75%, #DF6666)"
              result="color1Flood"
            />
            <feComposite
              operator="in"
              in2="noise1Clipped"
              in="color1Flood"
              result="color1"
            />
            <feMerge result="effect1_noise">
              <feMergeNode in="shape" />
              <feMergeNode in="color1" />
            </feMerge>
          </filter>
        </defs>
      )}
    </svg>
  );
}
