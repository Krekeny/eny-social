"use client";

import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import OrbitIntro from "./OrbitIntro";
import OutroReveal from "./OutroReveal";

// The two reveal animations are heavy trees (dozens of inline-styled nodes with
// their own CSS keyframes). They're mounted while the parent re-renders every
// scroll frame, so memoise them — with stable props they skip re-render
// entirely and just keep animating on the compositor.
const OrbitIntroMemo = memo(OrbitIntro);
const OutroRevealMemo = memo(OutroReveal);
// Stable prop objects so the memo boundaries above actually hold.
// Intro needs overflow:visible (its widest orbit tile spills past the box);
// the outro must NOT — its aurora blur layers would then paint unclipped and
// tank the frame while it's held on screen through the tail.
const COVER_INNER_STYLE = { overflow: "visible", minHeight: 0 } as const;
const OUTRO_INNER_STYLE = { minHeight: 0 } as const;
const COVER_SCALE_STYLE = {
  width: 360,
  height: 560,
  transform: "scale(0.66)",
} as const;
import {
  HouseIcon,
  CompassIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ChatCircleDotsIcon,
  PaperPlaneTiltIcon,
  BookmarkSimpleIcon,
  PlayIcon,
  UsersThreeIcon,
  HandshakeIcon,
  ArrowsClockwiseIcon,
  CalendarBlankIcon,
  NewspaperIcon,
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
// Pinned dwell after the choreography completes. This is where the outro
// reveal plays: it arms as progress reaches the end (still pinned) and holds
// for this whole tail, so you watch the animation instead of scrolling it away.
const TAIL_VH = 42;
// How far before the end (in segments) the outro linen cover begins fading in.
// Bigger than the fade duration so the cover is fully opaque by the time the
// pinned tail begins — that's when the reveal animation is allowed to start.
const OUTRO_LEAD = 0.4;

// Intro-card choreography, expressed as fractions of a card's own scroll
// segment. Each later section is introduced by a card that rises up from
// below, briefly covers the phone screen, then fades away to reveal that
// section's app video underneath.
// Scroll length (in segments) of one card's rise+fade, and how long to hold
// on the revealed video before the next card rises. HOLD_LEN is applied
// uniformly — including once on the first video after the phone locks — so the
// spacing between videos stays consistent and the dead scroll stays short.
const CARD_LEN = 1;
const HOLD_LEN = 0.35;

// How far below its resting spot the card starts, as a % of its own height.
// >100% keeps it fully below the phone (off-screen) at the start so it slides
// up into frame instead of popping in at the bottom edge.
const CARD_START_Y = 125;
const CARD_RISE_END = 0.6; // card finishes rising / fully covers the screen
const CARD_SWAP = 0.62; // swap the in-phone video while the card covers it

// The card→video reveal is deliberately NOT scrubbed by scroll. The card rises
// (scroll-driven) into its covering spot, holds while the user scrolls a short
// REVEAL_HOLD further, and only then does crossing that threshold arm a
// self-running, time-based fade (REVEAL_FADE_MS) that dissolves the cover and
// starts the video underneath — regardless of how the user scrolls after.
const REVEAL_HOLD = 0.18; // extra scroll past "fully covered" before the fade arms
const REVEAL_FADE_MS = 650; // duration of the on-its-own fade-out

// Shared sizing for the card/phone footprint — identical in both the
// animated and reduced-motion layouts so the elements look the same.
const FOOTPRINT = "relative h-[70vh] max-h-[720px] aspect-[9/19]";
// A card sized to cover the phone's *visible screen*. Nominally the screen sits
// past the 10px bezel (inner radius 44 − 10 = 34), but FOOTPRINT's width is
// fractional (height × 9/19), so a card clipped exactly to that edge leaves an
// intermittent 1px sub-pixel gap where the light screen peeks past the card.
// Bias the card 1px OUTWARD (inset 9, concentric radius 44 − 9 = 35) so its
// edge always laps onto the dark bezel instead — no gap, and the 1px overlap is
// swallowed by the frame.
const SCREEN_POS = "absolute inset-[9px]";
const SCREEN_CLIP = { clipPath: "inset(0 round 35px)" } as const;

// Decorative detail cards that flank the phone on large screens only. Each
// section ("round") gets its own layout so the cards land in different spots
// as you scroll from one section to the next. A section's `details` fill its
// layout's slots in order. Positioning uses top/left/right (never transform)
// so the per-slot float animation and tilt on the inner layers don't fight it.
const SATELLITE_LAYOUTS = [
  // Round 1 — one left, two right
  [
    {
      pos: "top-[38%] -left-[252px]",
      tilt: "-rotate-2",
      float: "float 9s ease-in-out 0s infinite",
    },
    {
      pos: "top-[11%] -right-[258px]",
      tilt: "rotate-3",
      float: "float-slow 11s ease-in-out 0.3s infinite",
    },
    {
      pos: "bottom-[12%] -right-[238px]",
      tilt: "-rotate-1",
      float: "float 10s ease-in-out 0.6s infinite",
    },
  ],
  // Round 2 — two left, one right
  [
    {
      pos: "top-[10%] -left-[248px]",
      tilt: "rotate-2",
      float: "float-slow 10s ease-in-out 0s infinite",
    },
    {
      pos: "bottom-[15%] -left-[264px]",
      tilt: "-rotate-3",
      float: "float 11s ease-in-out 0.4s infinite",
    },
    {
      pos: "top-[40%] -right-[252px]",
      tilt: "rotate-1",
      float: "float-slow 9s ease-in-out 0.2s infinite",
    },
  ],
  // Round 3 — two right, one left
  [
    {
      pos: "top-[13%] -right-[256px]",
      tilt: "-rotate-2",
      float: "float 10s ease-in-out 0s infinite",
    },
    {
      pos: "bottom-[10%] -right-[240px]",
      tilt: "rotate-2",
      float: "float-slow 12s ease-in-out 0.5s infinite",
    },
    {
      pos: "top-[43%] -left-[250px]",
      tilt: "-rotate-1",
      float: "float 9s ease-in-out 0.3s infinite",
    },
  ],
] as const;

/**
 * Scroll offset (in segments) at which section `i`'s intro card begins its
 * rise. Layout: slide-up (1) → hold → card 1 → hold → card 2 → … Each card is
 * preceded by a uniform HOLD_LEN on the currently shown video, so the spacing
 * between videos is consistent. Only meaningful for i >= 1.
 */
function cardStart(i: number) {
  return 1 + i * HOLD_LEN + (i - 1) * CARD_LEN;
}

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

/** A small detail card shown beside the phone on large screens. */
export interface SatelliteDetail {
  icon: ReactNode;
  label: string;
  /** Background color (CSS color value / token) */
  color: string;
}

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
  /**
   * Optional detail cards flanking the phone on large screens — the specifics
   * the short headline card can't carry. Filled into SATELLITE_SLOTS in order;
   * hidden below xl and in the reduced-motion layout.
   */
  details?: SatelliteDetail[];
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

// Memoised: `section` and `className` are stable references, so a scroll-frame
// re-render of the parent card wrapper won't re-render the card's contents.
const UseCaseCard = memo(function UseCaseCard({
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
});

/**
 * A use-case card sized and rounded to cover the phone's inner screen
 * exactly. Used three ways: the first section's card behind the phone, the
 * later sections' cards that rise up over the phone, and the reduced-motion
 * layout. Positional/animation styling is passed in via `style`.
 */
function PhoneScreenCard({
  section,
  style,
}: {
  section: ShowcaseSection;
  style?: CSSProperties;
}) {
  return (
    <div className={SCREEN_POS} style={{ ...SCREEN_CLIP, ...style }}>
      <UseCaseCard section={section} className="h-full w-full" />
    </div>
  );
}

/**
 * The stack of app screens inside the phone. Every screen stays mounted; only
 * the current one is shown and only a revealed one plays. Memoised on discrete
 * props (indices + a bool) so it doesn't re-render on every scroll frame — only
 * when the visible screen, the reveal frontier, or the pin state actually flips.
 * `revealedThrough` is the highest section whose reveal has armed; because the
 * per-section thresholds increase with index, `i <= revealedThrough` is exactly
 * the old `progress >= revealThreshold(i)` test.
 */
const PhoneScreens = memo(function PhoneScreens({
  sections,
  currentSection,
  revealedThrough,
  pinned,
}: {
  sections: ShowcaseSection[];
  currentSection: number;
  revealedThrough: number;
  pinned: boolean;
}) {
  return (
    <>
      {sections.map((section, i) => {
        const show = currentSection === i;
        const play = show && pinned && i <= revealedThrough;
        return (
          <div
            key={i}
            className="absolute inset-0 bg-linen"
            style={{ opacity: show ? 1 : 0 }}
          >
            <LayerPlaybackContext.Provider value={play}>
              {section.frames}
            </LayerPlaybackContext.Provider>
          </div>
        );
      })}
    </>
  );
});

/**
 * Detail cards flanking the phone (large screens only). Memoised on the two
 * discrete inputs that change their state — which section is active and whether
 * the phone has risen — so their entrance/float transitions aren't recomputed
 * every scroll frame.
 */
const Satellites = memo(function Satellites({
  sections,
  activeSection,
  shown,
}: {
  sections: ShowcaseSection[];
  activeSection: number;
  shown: boolean;
}) {
  return (
    <div className="pointer-events-none hidden md:block">
      {sections.map((section, i) => {
        const layout = SATELLITE_LAYOUTS[i % SATELLITE_LAYOUTS.length];
        return section.details?.map((detail, k) => {
          const slot = layout[k];
          if (!slot) return null;
          // Keep satellites out during the slide-up, then keep them shown once
          // the phone has risen — including after unsticking past the section,
          // so they hold rather than retracting.
          const visible = shown && activeSection === i;
          // Enter from inside the phone: start shifted toward the phone centre
          // (behind it, z-10) and scaled down, then settle out to the slot.
          // Left-hand slots come from the right, and vice versa.
          const enterX = slot.pos.includes("-right-") ? -200 : 200;
          return (
            <div
              key={`${i}-${k}`}
              className={`absolute z-10 ${slot.pos}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translate(0, 0) scale(1)"
                  : `translate(${enterX}px, 0) scale(0.4)`,
                transition:
                  "opacity 450ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: visible ? `${k * 90}ms` : "0ms",
              }}
            >
              <div style={{ animation: slot.float }}>
                <div
                  className={`w-[196px] rounded-[24px] py-4 pl-4 pr-5 shadow-xl ${slot.tilt}`}
                  style={{ backgroundColor: detail.color }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linen text-charcoal">
                      {detail.icon}
                    </span>
                    <span
                      lang="de"
                      className="min-w-0 font-serif text-[18px] leading-tight text-charcoal hyphens-auto"
                    >
                      {detail.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
});

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
  // Scroll length: 1 segment for the phone slide-up, then for each later
  // section a short hold on the current video followed by that section's
  // card rise+fade, and a final hold on the last video. See cardStart() for
  // the per-card offsets this must stay in sync with.
  const lastCard = sections.length - 1;
  const segments =
    lastCard >= 1 ? 1 + (lastCard + 1) * HOLD_LEN + lastCard * CARD_LEN : 1;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  // Whether the sticky container is actually pinned to the viewport. Progress
  // clamps to `segments`, so it can't tell "finished sliding up" from "scrolled
  // past the section" — this can. Videos and satellites gate on it so they stop
  // once the element has unstuck at either end.
  const [pinned, setPinned] = useState(false);
  // One-way latches: once the intro/outro reveal has been reached, keep it
  // MOUNTED even as the user scrubs back across the boundary. Without this the
  // heavy orbit trees mount/unmount on every crossing, which is what stutters.
  const [introSeen, setIntroSeen] = useState(false);
  const [outroSeen, setOutroSeen] = useState(false);
  const reducedMotion = useReducedMotion();

  const updateProgress = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const segmentPx = (window.innerHeight * SEGMENT_VH) / 100;
    setProgress(Math.min(segments, Math.max(0, -rect.top / segmentPx)));
    setPinned(rect.top <= 0 && rect.bottom >= window.innerHeight);
  }, [segments]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    // Drive updates from a continuous rAF loop *while the section is in view*,
    // not from `scroll` events. On mobile, scroll is off-main-thread and its
    // events arrive late/coalesced, so a scroll-driven transform trails the
    // compositor-positioned sticky element and visibly shakes. Reading layout
    // every animation frame keeps our transform in lock-step with the scroll.
    // An IntersectionObserver gates the loop so it isn't running off-screen.
    let raf = 0;
    let running = false;
    const tick = () => {
      updateProgress();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!running) {
        running = true;
        tick();
      }
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "100px" },
    );
    io.observe(el);
    updateProgress();
    window.addEventListener("resize", updateProgress);
    return () => {
      io.disconnect();
      stop();
      window.removeEventListener("resize", updateProgress);
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
                <PhoneScreenCard section={section} />
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

  // Phone slides up during segment 0. Expressed as a % of the phone's OWN
  // height (like the rising cards), not vh: a vh-based translate jumps on
  // mobile when the URL bar shows/hides and rewrites the viewport mid-scroll.
  // 135% of the 70vh footprint ≈ the old 95vh, i.e. fully below the frame.
  const phoneShiftPct = (1 - clamp01(progress)) * 135;

  // Which section's screen is shown inside the phone right now. Each later
  // section's video swaps in while its intro card is covering the screen, so
  // the swap itself is never visible — the card fades to reveal the new video.
  let currentSection = 0;
  for (let c = 1; c < sections.length; c++) {
    if (progress >= cardStart(c) + CARD_SWAP) currentSection = c;
  }
  const last = sections.length - 1;

  // The outro's linen cover fades in over the last video as the choreography
  // approaches its end (still pinned). It stays on once reached — progress
  // clamps at `segments` — so it also holds as the section scrolls away.
  const outroArmed = currentSection === last && progress >= segments - OUTRO_LEAD;
  // The reveal ANIMATION, though, only starts once the cover is fully opaque
  // and the pinned tail has begun (progress has hit the clamp). That way the
  // gather/pop-in plays on a settled full-screen cover, in the dwell — not
  // behind the fade at a scroll point you'd blow straight past.
  const outroPlaying = currentSection === last && progress >= segments;

  // Arm the mount latches the first time each reveal is genuinely reached.
  // Guarded so these fire at most once (no render loop).
  if (pinned && currentSection === 0 && !introSeen) setIntroSeen(true);
  if (outroPlaying && !outroSeen) setOutroSeen(true);

  // Scroll position (in segments) at which section i's cover has fully landed
  // and the user has scrolled the small REVEAL_HOLD further — the point that
  // arms the cover's self-running fade and starts its video. Section 0's cover
  // (the orbit intro) lands when the phone locks at progress 1; every later
  // section's card lands at CARD_RISE_END within its own segment.
  const revealThreshold = (i: number) =>
    i === 0
      ? 1 + REVEAL_HOLD
      : cardStart(i) + CARD_RISE_END + REVEAL_HOLD;
  const isRevealed = (i: number) => progress >= revealThreshold(i);

  // Highest section whose reveal has armed. Thresholds increase with index, so
  // this single number encodes every isRevealed(i) for the memoised screens.
  let revealedThrough = -1;
  for (let i = 0; i < sections.length; i++) {
    if (isRevealed(i)) revealedThrough = i;
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
          {/* First section's intro card — sits behind the phone and gets
              covered as the phone slides up. Sized to the phone screen. */}
          <PhoneScreenCard section={sections[0]} style={{ zIndex: 0 }} />

          {/* Phone frame sliding in from the bottom */}
          <div
            className="absolute inset-0 z-20"
            style={{
              transform: `translate3d(0, ${phoneShiftPct}%, 0)`,
              willChange: "transform",
            }}
          >
            <PhoneFrame>
              <PhoneScreens
                sections={sections}
                currentSection={currentSection}
                revealedThrough={revealedThrough}
                pinned={pinned}
              />

              {/* Orbit intro covers the first screen's opening frame while the
                  phone rises into place, then crossfades away to reveal the
                  first video once the phone is stuck (and it starts playing).
                  Latched on first arrival (introSeen) rather than gated on
                  `pinned`, so scrubbing across the pin boundary doesn't
                  mount/unmount the heavy orbit tree every crossing.
                  translateZ(0)+contain isolate it onto its own compositor layer
                  so its per-frame line animation repaints only itself, not the
                  whole sliding-phone layer. */}
              {introSeen && currentSection === 0 && (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background: "var(--linen)",
                    opacity: isRevealed(0) ? 0 : 1,
                    transition: `opacity ${REVEAL_FADE_MS}ms ease`,
                    transform: "translateZ(0)",
                    willChange: "transform",
                    contain: "paint",
                  }}
                >
                  {/* Fixed coordinate box scaled down so the constellation sits
                      inside the screen instead of spilling over the bezel. The
                      linen cover lives on the parent, so only the orbit shrinks.
                      Width is padded past the 360px stage and the root's own
                      overflow:hidden is lifted so the widest tiles aren't clipped
                      at the sides. */}
                  <div style={COVER_SCALE_STYLE}>
                    <OrbitIntroMemo
                      logoSrc="/logos/bw-logo.svg"
                      background="transparent"
                      style={COVER_INNER_STYLE}
                    />
                  </div>
                </div>
              )}

              {/* Outro reveal — mirrors the intro at the other end. Arms as the
                  choreography reaches its end while the phone is still pinned,
                  crossfading in over the last video and then holding through the
                  pinned tail so its gather/pop-in is actually watched rather
                  than scrolled away. The inner reveal is latched (outroSeen) so
                  it plays on arm and survives scrubbing across the boundary. */}
              {progress >= 1 && currentSection === last && (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background: "var(--linen)",
                    opacity: outroArmed ? 1 : 0,
                    transition: "opacity 700ms ease",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    contain: "paint",
                  }}
                >
                  {outroSeen && (
                    <div style={COVER_SCALE_STYLE}>
                      <OutroRevealMemo
                        logoSrc="/logos/bw-logo.svg"
                        background="transparent"
                        style={OUTRO_INNER_STYLE}
                      />
                    </div>
                  )}
                </div>
              )}
            </PhoneFrame>
          </div>

          {/* Later sections' intro cards — each rises up from below the phone,
              covers the screen, then fades away to reveal its app video. */}
          {sections.map((section, i) => {
            if (i === 0) return null;
            const local = progress - cardStart(i);
            // Only live during this card's own rise-and-fade segment.
            if (local < 0 || local >= CARD_LEN) return null;
            // Rise stays scroll-driven — the card tracks the scroll up into its
            // covering spot. The fade does NOT: once the reveal threshold is
            // crossed, opacity flips to 0 and the CSS transition runs it out on
            // its own clock (REVEAL_FADE_MS), so scroll speed can't scrub it.
            const riseP = clamp01(local / CARD_RISE_END);
            const translateY = (1 - smoothstep(riseP)) * CARD_START_Y; // % of own height
            return (
              <PhoneScreenCard
                key={i}
                section={section}
                style={{
                  zIndex: 40,
                  opacity: isRevealed(i) ? 0 : 1,
                  transform: `translate3d(0, ${translateY}%, 0)`,
                  transition: `opacity ${REVEAL_FADE_MS}ms ease`,
                  willChange: "transform, opacity",
                }}
              />
            );
          })}

          {/* Detail cards flanking the phone — large screens only. They fade
              in with their section and carry the specifics the short headline
              card can't. */}
          <Satellites
            sections={sections}
            activeSection={currentSection}
            shown={progress >= 1}
          />
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
      {/* Dynamic-island style notch — sized/positioned to line up with the
          island baked into the app videos (higher, a touch wider, taller). */}
      <div className="absolute left-1/2 top-[13px] z-50 h-[26px] w-[93px] -translate-x-1/2 rounded-full bg-charcoal" />
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
      // Every reveal starts the clip from the top, so the card always fades
      // out onto the video's opening frame rather than mid-playback.
      video.currentTime = 0;
      void video.play().catch(() => {});
    } else {
      // Hold on the current frame (don't rewind, don't hide) when the phone
      // isn't stuck — e.g. after scrolling past the pinned section.
      video.pause();
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
    details: [
      {
        icon: <ChatCircleDotsIcon size={22} />,
        label: "Feeds & Groups",
        color: "var(--tangerine-dream)",
      },
      {
        icon: <UsersThreeIcon size={22} />,
        label: "Friends & Creators",
        color: "var(--cotton-candy)",
      },
      {
        icon: <NewspaperIcon size={22} />,
        label: "News & Events",
        color: "var(--monte-carlo)",
      },
    ],
  },
  {
    icon: <CompassIcon size={40} />,
    text: copy.cards.unbubble,
    cardColor: "var(--cotton-candy)",
    frames: buildFrames({
      images: [],
      video: "/videos/app/discover.webm",
      alt: copy.screenAlt.unbubble,
      mock: <UnbubbleScreen key="mock" />,
    }),
    details: [
      {
        icon: <ArrowsClockwiseIcon size={22} />,
        label: "Perspective shift",
        color: "var(--apricot-dream)",
      },
      {
        icon: <CalendarBlankIcon size={22} />,
        label: "Events near you",
        color: "var(--monte-carlo)",
      },
      {
        icon: <HandshakeIcon size={22} />,
        label: "Connect with people",
        color: "var(--tangerine-dream)",
      },
    ],
  },
  {
    icon: <MagnifyingGlassIcon size={40} />,
    text: copy.cards.search,
    cardColor: "var(--monte-carlo)",
    frames: buildFrames({
      images: [],
      video: "/videos/app/search.webm",
      alt: copy.screenAlt.search,
      mock: <SearchScreen key="mock" />,
    }),
    details: [
      {
        icon: <HouseIcon size={22} />,
        label: "Homes & Flats",
        color: "var(--cotton-candy)",
      },
      {
        icon: <NewspaperIcon size={22} />,
        label: "Local news",
        color: "var(--tangerine-dream)",
      },
      {
        icon: <UsersThreeIcon size={22} />,
        label: "People & Services",
        color: "var(--apricot-dream)",
      },
    ],
  },
];
