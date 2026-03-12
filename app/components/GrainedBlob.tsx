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
      <g filter="url(#grain-filter)">
        <path
          d="M994.079 254.763C1273.76 285.396 1370.84 647.705 1143.95 814.073C1074.74 864.815 1030.37 943.802 1023.8 1029.36C1002.5 1306.34 644.568 1402.24 487.638 1173.02C439.161 1102.22 361.242 1056 275.94 1046.65C-3.73878 1016.02 -100.819 653.713 126.073 487.345C195.276 436.603 239.646 357.615 246.224 272.056C267.52 -4.91779 625.452 -100.825 782.381 128.393C830.858 199.2 908.777 245.42 994.079 254.763Z"
          fill="#F89F9F"
        />
      </g>
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
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2 2"
            stitchTiles="stitch"
            numOctaves={3}
            result="noise"
            seed={939}
          />
          <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
            />
          </feComponentTransfer>
          <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
          <feFlood floodColor="#DF6666" result="color1Flood" />
          <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
          <feMerge result="effect1_noise">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
