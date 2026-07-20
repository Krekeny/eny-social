"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  HouseIcon,
  CompassIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ChatCircleDotsIcon,
  PaperPlaneTiltIcon,
  BookmarkSimpleIcon,
  PlayIcon,
} from "@phosphor-icons/react";

/**
 * Scroll choreography
 * -------------------
 * The section pins (sticky) while the user scrolls through N "segments",
 * each worth SEGMENT_VH of scroll distance:
 *
 *   segment 0          → the phone frame slides up from below the viewport
 *                        and covers the first (free-standing) card
 *   segments 1..L-1    → crossfades between the layers shown inside the
 *                        phone screen, one per scroll segment. Each use case
 *                        expands into its card followed by its animation
 *                        frames, so the layer order is:
 *                          frame 0a → frame 0b → … → card 1 →
 *                          frame 1a → frame 1b → … → card 2 → …
 *                        i.e. you scroll through every frame of a use case
 *                        before the next card is revealed.
 *
 * Every in-phone layer has an opaque background, so a fade-in of the top
 * layer reads as a crossfade and never exposes content underneath.
 */
const SEGMENT_VH = 100;
const TAIL_VH = 40; // hold on the last screen before the section unpins
const FADE_START = 0.25; // fade window inside a segment (rest is hold time)
const FADE_END = 0.75;

// Shared sizing for the card/phone footprint — identical in both the
// animated and reduced-motion layouts so the elements look the same.
const FOOTPRINT = "relative h-[70vh] max-h-[720px] aspect-[9/19]";
const CARD_IN_FOOTPRINT =
  "absolute left-1/2 top-1/2 h-[75%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-[32px]";

/* ------------------------------------------------------------------ */
/* Translatable copy                                                   */
/* ------------------------------------------------------------------ */
/* All user-facing strings live here so they can be swapped out for    */
/* translations later (e.g. wired up to an i18n layer). Keep values    */
/* as plain strings where possible; the emphasised card heading is the */
/* only entry that carries presentational markup.                      */

const copy = {
  /** Use-case question shown on each free-standing card */
  cards: {
    feed: (
      <>
        Everyone and everything you <em>love</em>. In one place.
      </>
    ),
    unbubble: "Step outside your bubble.",
    search: "A flat. A concert. A plumber. One search.",
  },
  /** Alt text for the real screenshot screens */
  screenAlt: {
    feed: "Morgen Post space mixing photo, video and news posts",
    unbubble: "Discover view with the Perspektivwechsel toggle switched on",
    search: "Universal search showing flat listings in Offenbach",
  },
  /** "Morgen Post" mock space-feed screen */
  spaceFeed: {
    badge: "12 neu · seit gestern",
    title: "Morgen Post",
    videoCaption: "4 Minuten am Mainufer für einen guten Morgen",
    photoUser: "sarah.k",
    photoLikes: "234 Likes",
    photoCaption: "Erster Kaffee am Marktplatz, bevor die S-Bahn voll wird.",
    newsSource: "Offenbach-Post",
    newsHeadline: "Das Wichtigste zum Start in den Tag",
    newsBody: "Sperrung am Kaiserlei – neue Linienführung ab Montag.",
    nav: "Spaces",
  },
  /** "Ungefiltert" mock unbubble / discover screen */
  unbubble: {
    eyebrow: "Entdecken",
    title: "Ungefiltert",
    subtitle: "Stimmen und Themen, die du sonst nicht siehst.",
    toggleTitle: "Perspektivwechsel",
    toggleState: "An – Stimmen außerhalb deines Graphen",
    chips: [
      "Andere Stadtteile",
      "Lokal & klein",
      "Gegenrede",
      "Nischen-Kunst",
      "Unerwartetes",
    ],
    likesSuffix: "Likes",
    tileEyebrow: "Hafen 2",
    tileTitle: "Was die Stadtteil-Initiative am Hafen plant",
    nav: "Entdecken",
  },
  /** Universal search mock screen */
  search: {
    query: "Wohnungen",
    chips: ["Alle", "Inserate", "News"],
    activeChip: "Inserate",
    resultCount: "3 Wohnungen · Offenbach",
    price: "740 €",
    priceUnit: "/ Mt.",
    listingTitle: "Helle 2-Zimmer-Altbau",
    listingLocation: "Offenbach · Nordend",
    size: "58",
    sizeUnit: "m²",
    floor: "2.",
    floorUnit: "OG",
    availabilityLabel: "frei ab",
    availabilityDate: "1. Juli",
    tags: ["Balkon", "EBK", "Altbau"],
    contact: "Kontakt",
    nav: "Suche",
  },
} as const;

export interface ShowcaseSection {
  /** Icon / illustration shown on the card */
  icon: ReactNode;
  /** Use-case question or statement on the card */
  text: ReactNode;
  /** Card background color (CSS color value) */
  cardColor: string;
  /**
   * Ordered frames of the scroll-driven animation shown inside the phone.
   * Scrolling advances through them one by one (frame 0 → 1 → 2 …); only
   * after the last frame is reached does the next card slide in. Provide as
   * many frames as you like — a single-element array is a static screen.
   */
  frames: ReactNode[];
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** True when the user asked for reduced motion. Drives ONLY whether the
    section pins and animates on scroll — never the styling of the card or
    phone, which stay identical in both modes. */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

function smoothstep(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/**
 * Whether the video on the current layer should be playing. A `VideoScreen`
 * only plays once its layer is the visible one AND the phone has finished
 * sliding into place (is "stuck"); otherwise it sits paused on its first
 * frame. Provided per layer by AppShowcase. Defaults to false so videos
 * outside the scroll choreography (e.g. reduced-motion layout) stay still.
 */
const LayerPlaybackContext = createContext(false);

function UseCaseCard({
  section,
  className,
}: {
  section: ShowcaseSection;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 px-8 text-center ${className ?? ""}`}
      style={{ backgroundColor: section.cardColor }}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linen text-charcoal">
        {section.icon}
      </div>
      <p className="font-serif text-[26px] leading-snug text-charcoal">
        {section.text}
      </p>
    </div>
  );
}

interface AppShowcaseProps {
  sections?: ShowcaseSection[];
}

export default function AppShowcase({
  sections = defaultSections,
}: AppShowcaseProps) {
  // Layers shown inside the phone, in scroll order. Each layer is one
  // crossfade segment of scroll, so a use case expands to:
  //   [card] → frame 0 → frame 1 → … → frame N
  // The first section's card is the free-standing one behind the phone, so
  // it isn't repeated here; every later section is introduced by its card.
  const layers: ReactNode[] = [];
  sections.forEach((section, i) => {
    if (i > 0) {
      layers.push(<UseCaseCard section={section} className="h-full w-full" />);
    }
    section.frames.forEach((frame) => layers.push(frame));
  });

  const segments = layers.length; // slide-up + (layers - 1) crossfades
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  const updateProgress = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const segmentPx = (window.innerHeight * SEGMENT_VH) / 100;
    setProgress(Math.min(segments, Math.max(0, -rect.top / segmentPx)));
  }, [segments]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          updateProgress();
        });
      }
    };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [updateProgress]);

  // Reduced motion: drop only the scroll choreography (pinning, slide-up,
  // crossfade). The card and phone keep their exact styling — each use case
  // is shown as its free-standing card followed by the phone with its screen.
  if (reducedMotion) {
    return (
      <section className="px-6 py-24">
        <div className="mx-auto flex max-w-[420px] flex-col items-center gap-20">
          {sections.map((section, i) => (
            <div key={i} className="flex w-full flex-col items-center gap-10">
              <div className={FOOTPRINT}>
                <UseCaseCard section={section} className={CARD_IN_FOOTPRINT} />
              </div>
              {section.frames.map((frame, f) => (
                <div key={f} className={FOOTPRINT}>
                  <PhoneFrame>{frame}</PhoneFrame>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Phone slides up during segment 0
  const phoneShiftVh = (1 - clamp01(progress)) * 95;

  // The phone is "stuck" once it has finished sliding up (segment 0 done).
  // Videos only play while stuck, so the first one holds on its opening frame
  // during the slide-up instead of playing behind the moving frame.
  const stuck = progress >= 1;
  // Highest layer that has fully faded in and therefore hides everything
  // beneath it — the video on a covered layer is paused to save work.
  let coverIndex = 0;
  for (let k = 1; k < layers.length; k++) {
    if (progress >= k + FADE_END) coverIndex = k;
  }

  return (
    <section
      ref={wrapperRef}
      className="relative"
      style={{ height: `calc(${segments * SEGMENT_VH + TAIL_VH}vh + 100vh)` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        {/* Shared footprint for card and phone so they stay aligned */}
        <div className={FOOTPRINT}>
          {/* Free-standing card — 75% of the phone height, covered by the phone */}
          <UseCaseCard section={sections[0]} className={CARD_IN_FOOTPRINT} />

          {/* Phone frame sliding in from the bottom */}
          <div
            className="absolute inset-0"
            style={{
              transform: `translate3d(0, ${phoneShiftVh}vh, 0)`,
              willChange: "transform",
            }}
          >
            <PhoneFrame>
              {layers.map((layer, k) => {
                // Layer k fades in during segment k (layer 0 is the base)
                const local = clamp01(progress - k);
                const opacity =
                  k === 0
                    ? 1
                    : smoothstep(
                        (local - FADE_START) / (FADE_END - FADE_START),
                      );
                if (k > 0 && opacity === 0) return null;
                // Play this layer's video only once the phone is stuck, the
                // layer is showing, and it isn't hidden under a higher one.
                const play = stuck && opacity > 0 && coverIndex <= k;
                return (
                  <div
                    key={k}
                    className="absolute inset-0 bg-linen"
                    style={{ opacity, zIndex: k }}
                  >
                    <LayerPlaybackContext.Provider value={play}>
                      {layer}
                    </LayerPlaybackContext.Provider>
                  </div>
                );
              })}
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full rounded-[44px] bg-charcoal shadow-2xl">
      {/* Screen content sits a touch oversized and a touch less round than the
          opening, tucked ~4px under the bezel. Rounded with clip-path (smoother
          AA than overflow + border-radius under the animated wrapper), on a
          charcoal backing so nothing light hides behind it. */}
      <div
        className="absolute inset-[6px] overflow-hidden bg-charcoal"
        style={{ clipPath: "inset(0 round 30px)" }}
      >
        <div className="absolute -inset-px">{children}</div>
      </div>
      {/* Bezel drawn ON TOP of the content edge: a charcoal ring whose rounded
          inner cut-out (44px outer − 10px = 34px) overlaps the content by a few
          px, hiding the junction so the corners read flat with no hairline —
          the frame sits over the screen rather than butting up against it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[44px] border-[10px] border-solid"
        style={{ borderColor: "var(--charcoal)" }}
      />
      {/* Dynamic-island style notch */}
      <div className="absolute left-1/2 top-5 z-50 h-5 w-20 -translate-x-1/2 rounded-full bg-charcoal" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Real app screens — extracted from the demo screenshots.             */
/* Flip USE_REAL_SCREENS to false to compare with the coded mocks.     */
/* ------------------------------------------------------------------ */

const USE_REAL_SCREENS = true;

/**
 * How the in-phone app content is shown for each use case:
 *   "frames" → scroll through a sequence of screenshot frames (flip-book)
 *   "video"  → play a single looping video; a bit of scrolling holds on it
 *              before the next card slides in
 * Flip this one constant to switch the whole showcase between the variants.
 */
const SHOWCASE_VARIANT: "frames" | "video" = "video";

function ScreenshotScreen({
  src,
  alt,
  notchGap = false,
}: {
  src: string;
  alt: string;
  /** Inset the capture below the frame's notch (for screens whose
      content starts at the very top, e.g. a search bar) */
  notchGap?: boolean;
}) {
  return (
    <div className="relative h-full w-full bg-linen">
      <div
        className={`absolute inset-x-0 bottom-0 ${notchGap ? "top-10" : "top-0"}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="340px"
          loading="lazy"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/**
 * A single looping video that fills the phone screen — the "video" variant's
 * counterpart to a frame sequence. It stays paused on its first frame until
 * its layer is the visible one and the phone is stuck (see
 * LayerPlaybackContext); then it plays muted and loops on its own timeline
 * while a bit of scrolling holds on it before the next card crossfades in.
 * Honours reduced motion by never playing and showing the poster still.
 */
function VideoScreen({
  src,
  poster,
  label,
  notchGap = false,
}: {
  src: string;
  /** Still frame shown before play / when motion is reduced */
  poster?: string;
  /** Accessible label (videos have no alt attribute) */
  label?: string;
  notchGap?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const shouldPlay = useContext(LayerPlaybackContext) && !reducedMotion;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      void video.play().catch(() => {});
    } else {
      // Park on the first frame until the phone is stuck and this is the
      // visible layer.
      video.pause();
      video.currentTime = 0;
    }
  }, [shouldPlay]);

  return (
    <div className="relative h-full w-full bg-linen">
      <div
        className={`absolute inset-x-0 bottom-0 ${notchGap ? "top-10" : "top-0"}`}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          preload="auto"
          aria-label={label}
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mock app screens — recreated from the real app's demo screenshots   */
/* ------------------------------------------------------------------ */

function MockBottomNav({ active }: { active: string }) {
  return (
    <div className="absolute bottom-3 left-1/2 z-20 flex w-[88%] -translate-x-1/2 items-center gap-2 rounded-full bg-charcoal px-2 py-2">
      <span className="rounded-full bg-linen px-4 py-1.5 text-xs font-semibold text-charcoal">
        {active}
      </span>
      <div className="flex flex-1 items-center justify-evenly">
        <span className="h-1.5 w-1.5 rounded-full bg-linen/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-linen/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-linen/40" />
      </div>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linen/15 text-linen">
        <MagnifyingGlassIcon size={15} />
      </span>
    </div>
  );
}

/** "Morgen Post" space — one feed mixing video, photo and news content */
function SpaceFeedScreen() {
  return (
    <div className="relative flex h-full w-full flex-col bg-linen">
      <div className="bg-tangerine px-5 pb-4 pt-14 text-linen">
        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
          {copy.spaceFeed.badge}
        </p>
        <p className="font-serif text-2xl">{copy.spaceFeed.title}</p>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden p-3 pb-20">
        {/* Video post */}
        <div className="flex items-center gap-3 rounded-2xl bg-charcoal p-3 text-linen">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linen/15">
            <PlayIcon size={13} weight="fill" />
          </span>
          <p className="text-[11px] leading-snug">
            {copy.spaceFeed.videoCaption}
          </p>
        </div>
        {/* Photo post */}
        <div className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
          <div className="flex items-center gap-2 p-2.5">
            <span className="h-7 w-7 rounded-full bg-cotton-candy" />
            <span className="text-xs font-semibold text-charcoal">
              {copy.spaceFeed.photoUser}
            </span>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/images/pexels-mertcoskunraw-28257515.jpg"
              alt=""
              fill
              sizes="340px"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-3 px-3 pt-2.5 text-charcoal">
            <HeartIcon size={18} />
            <ChatCircleDotsIcon size={18} />
            <PaperPlaneTiltIcon size={18} />
            <BookmarkSimpleIcon size={18} className="ml-auto" />
          </div>
          <p className="px-3 pb-3 pt-1.5 text-[11px] leading-snug text-charcoal/70">
            <strong className="font-semibold text-charcoal">
              {copy.spaceFeed.photoLikes}
            </strong>{" "}
            · {copy.spaceFeed.photoCaption}
          </p>
        </div>
        {/* News post */}
        <div className="rounded-2xl border border-charcoal/10 bg-white p-3">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-tangerine">
            {copy.spaceFeed.newsSource}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-charcoal">
            {copy.spaceFeed.newsHeadline}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-charcoal/60">
            {copy.spaceFeed.newsBody}
          </p>
        </div>
      </div>
      <MockBottomNav active={copy.spaceFeed.nav} />
    </div>
  );
}

/** Discover view with the "Perspektivwechsel" (unbubble) toggle switched on */
function UnbubbleScreen() {
  const tiles = [
    { src: "/images/pexels-davner-ribeiro-2711547-4574405.jpg", likes: "1,2k" },
    { src: "/images/pexels-shvets-production-7194971.jpg", likes: "847" },
    { src: "/images/pexels-didsss-7664407.jpg", likes: "312" },
  ];
  return (
    <div className="relative flex h-full w-full flex-col bg-linen">
      <div className="px-5 pb-3 pt-14">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-tangerine">
          {copy.unbubble.eyebrow}
        </p>
        <p className="font-serif text-2xl text-charcoal">
          {copy.unbubble.title}
        </p>
        <p className="mt-0.5 text-[11px] text-charcoal/60">
          {copy.unbubble.subtitle}
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden px-3 pb-20">
        {/* Unbubble toggle — on */}
        <div className="flex items-center gap-3 rounded-2xl bg-tangerine p-3 text-linen">
          <div className="flex-1">
            <p className="text-xs font-semibold">{copy.unbubble.toggleTitle}</p>
            <p className="text-[10px] leading-snug opacity-90">
              {copy.unbubble.toggleState}
            </p>
          </div>
          <span className="flex h-5 w-9 shrink-0 items-center rounded-full bg-linen/30 px-0.5">
            <span className="ml-auto h-4 w-4 rounded-full bg-linen" />
          </span>
        </div>
        {/* Topic chips */}
        <div className="flex flex-wrap gap-1.5">
          {copy.unbubble.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-charcoal/15 bg-white px-2.5 py-1 text-[10px] text-charcoal"
            >
              {chip}
            </span>
          ))}
        </div>
        {/* Content tiles */}
        <div className="grid grid-cols-2 gap-2">
          {tiles.slice(0, 2).map((tile) => (
            <div
              key={tile.src}
              className="relative aspect-[3/4] overflow-hidden rounded-xl"
            >
              <Image
                src={tile.src}
                alt=""
                fill
                sizes="170px"
                className="object-cover"
              />
              <span className="absolute bottom-1.5 left-2 z-10 text-[10px] font-semibold text-linen drop-shadow">
                {tile.likes} {copy.unbubble.likesSuffix}
              </span>
              <span className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-charcoal/60 to-transparent" />
            </div>
          ))}
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
            <Image
              src={tiles[2].src}
              alt=""
              fill
              sizes="170px"
              className="object-cover"
            />
            <span className="absolute bottom-1.5 left-2 z-10 text-[10px] font-semibold text-linen drop-shadow">
              {tiles[2].likes} {copy.unbubble.likesSuffix}
            </span>
            <span className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-charcoal/60 to-transparent" />
          </div>
          <div className="flex aspect-[3/4] flex-col justify-end rounded-xl bg-dusk p-3 text-linen">
            <p className="text-[9px] font-semibold uppercase tracking-widest opacity-70">
              {copy.unbubble.tileEyebrow}
            </p>
            <p className="mt-1 text-xs font-semibold leading-snug">
              {copy.unbubble.tileTitle}
            </p>
          </div>
        </div>
      </div>
      <MockBottomNav active={copy.unbubble.nav} />
    </div>
  );
}

/** Universal search — everything in one search, localized results */
function SearchScreen() {
  return (
    <div className="relative flex h-full w-full flex-col bg-linen">
      <div className="px-4 pb-2 pt-14">
        <div className="flex items-center gap-2 rounded-full border border-charcoal/15 bg-white px-3.5 py-2.5">
          <MagnifyingGlassIcon size={14} className="text-charcoal/50" />
          <span className="text-xs text-charcoal">{copy.search.query}</span>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {copy.search.chips.map((chip) => (
            <span
              key={chip}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                chip === copy.search.activeChip
                  ? "bg-charcoal text-linen"
                  : "border border-charcoal/15 bg-white text-charcoal"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden px-4 pb-20">
        <p className="text-[10px] text-charcoal/50">
          {copy.search.resultCount}
        </p>
        {/* Flat listing */}
        <div className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
          <div className="relative aspect-[5/2] w-full">
            <Image
              src="/images/app/flat-listing.png"
              alt=""
              fill
              sizes="340px"
              className="object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-full bg-linen px-2.5 py-1 text-[10px] font-semibold text-charcoal">
              {copy.search.price}{" "}
              <span className="font-normal text-charcoal/60">
                {copy.search.priceUnit}
              </span>
            </span>
          </div>
          <div className="p-3">
            <p className="text-sm font-semibold text-charcoal">
              {copy.search.listingTitle}
            </p>
            <p className="text-[10px] text-charcoal/50">
              {copy.search.listingLocation}
            </p>
            <div className="mt-2 flex gap-4 text-[11px] text-charcoal">
              <span>
                <strong className="font-semibold">{copy.search.size}</strong>{" "}
                {copy.search.sizeUnit}
              </span>
              <span>
                <strong className="font-semibold">{copy.search.floor}</strong>{" "}
                {copy.search.floorUnit}
              </span>
              <span>
                {copy.search.availabilityLabel}{" "}
                <strong className="font-semibold">
                  {copy.search.availabilityDate}
                </strong>
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              {copy.search.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-charcoal/5 px-2 py-0.5 text-[9px] text-charcoal/70"
                >
                  {tag}
                </span>
              ))}
              <span className="ml-auto rounded-full bg-charcoal px-3 py-1 text-[10px] font-semibold text-linen">
                {copy.search.contact}
              </span>
            </div>
          </div>
        </div>
        {/* Next result peeking in */}
        <div className="space-y-2 rounded-2xl border border-charcoal/10 bg-white p-3">
          <div className="h-16 rounded-xl bg-charcoal/10" />
          <div className="h-3 w-2/3 rounded-full bg-charcoal/10" />
          <div className="h-3 w-1/3 rounded-full bg-charcoal/10" />
        </div>
      </div>
      <MockBottomNav active={copy.search.nav} />
    </div>
  );
}

/** Turn a list of screenshot sources into scroll-animation frames. */
function screenshotFrames(
  srcs: string[],
  alt: string,
  notchGap = false,
): ReactNode[] {
  return srcs.map((src) => (
    <ScreenshotScreen key={src} src={src} alt={alt} notchGap={notchGap} />
  ));
}

/**
 * Resolve the in-phone layers for one use case, honouring both the mock /
 * real-screens toggle and the frames / video variant:
 *   - mocks off            → the coded mock screen
 *   - real + "video"       → a single looping video layer
 *   - real + "frames"      → the screenshot frame sequence
 */
function buildFrames({
  images,
  video,
  poster,
  alt,
  mock,
  notchGap = false,
}: {
  images: string[];
  video: string;
  /** Still shown before the video plays / under reduced motion */
  poster?: string;
  alt: string;
  mock: ReactNode;
  notchGap?: boolean;
}): ReactNode[] {
  if (!USE_REAL_SCREENS) return [mock];
  if (SHOWCASE_VARIANT === "video") {
    return [
      <VideoScreen
        key="video"
        src={video}
        poster={poster ?? images[0]}
        label={alt}
        notchGap={notchGap}
      />,
    ];
  }
  return screenshotFrames(images, alt, notchGap);
}

const defaultSections: ShowcaseSection[] = [
  {
    icon: <HouseIcon size={40} />,
    text: copy.cards.feed,
    cardColor: "var(--apricot-dream)",
    frames: buildFrames({
      images: [],
      video: "/videos/app/space-feed.webm",
      alt: copy.screenAlt.feed,
      mock: <SpaceFeedScreen key="mock" />,
    }),
  },
  {
    icon: <CompassIcon size={40} />,
    text: copy.cards.unbubble,
    cardColor: "var(--cotton-candy)",
    frames: buildFrames({
      images: ["/images/app/unbubble1.png", "/images/app/unbubble2.png"],
      video: "/videos/app/unbubble.mp4",
      alt: copy.screenAlt.unbubble,
      mock: <UnbubbleScreen key="mock" />,
    }),
  },
  {
    icon: <MagnifyingGlassIcon size={40} />,
    text: copy.cards.search,
    cardColor: "var(--monte-carlo)",
    frames: buildFrames({
      images: ["/images/app/search1.png", "/images/app/search2.png"],
      video: "/videos/app/search.mp4",
      alt: copy.screenAlt.search,
      notchGap: true,
      mock: <SearchScreen key="mock" />,
    }),
  },
];
