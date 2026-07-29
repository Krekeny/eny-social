// OutroReveal.jsx — self-contained extract of the eny "press E" outro animation.
//
// Exact copy of the demo-closer's motion: two drifting accent auroras behind
// everything, a breathing glow, a slowly rotating dashed ring, five content
// tiles that fade in on the ring and gather inward — dissolving into the eny
// mark, which pops in. The headline / slogan / sign-off that sat below the mark
// are NOT included.
//
// Zero external dependencies. Design tokens are baked in as literals (TOKENS),
// keyframes are injected once under an `eny-`-namespaced <style> so they can't
// collide with the host app. color-mix() from the original is resolved to plain
// rgba so nothing relies on external CSS vars. Just:
//   import OutroReveal from "./OutroReveal";
//
// Fills its parent (height:100%); pass `logoSrc` to point the center mark at
// your asset (defaults to "b&w-logo.svg").

import React from "react";

// ─────────────────────────── Design tokens (inlined) ───────────────────────────
const TOKENS = {
  bg: "#F5F0E8",
  ink: "#1F1A16",
  muted: "#7A7268",
  accent: "#F25A28", // === rgb(242,90,40)
  accent2: "#F77A4E",
  card: "#E8E2D6",
  card2: "#D8D2C4",
  dark: "#1F1A16",
  serif: "'Bricolage Grotesque', 'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace",
};

// ─────────────────────────── Helpers (inlined) ───────────────────────────
function avatarUrl(seed, size = 128) {
  return `https://i.pravatar.cc/${Math.round(size)}?u=${encodeURIComponent(
    String(seed)
  )}`;
}

// Only the two glyphs the gather tiles use (heart, play).
function Icon({ name, size = 18, color = "currentColor", stroke = 1.6 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (name === "play") {
    return (
      <svg {...p}>
        <path d="M7 5l12 7-12 7z" fill={color} stroke="none" />
      </svg>
    );
  }
  if (name === "heart") {
    return (
      <svg {...p}>
        <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.7A4 4 0 0119 10c0 5.5-7 10-7 10z" />
      </svg>
    );
  }
  return null;
}

// Keyframes — injected once, namespaced. --dx/--dy are per-tile start offsets
// set inline on each gather tile (custom props, not tokens — left as-is).
const KEYFRAMES = `
@keyframes eny-popin {
  from { opacity: 0; transform: scale(0.3) }
  to   { opacity: 1; transform: scale(1) }
}
@keyframes eny-glowpulse {
  from { opacity: 0.55; transform: translate(-50%,-50%) scale(0.85) }
  to   { opacity: 1;    transform: translate(-50%,-50%) scale(1.12) }
}
@keyframes eny-ringspin {
  from { transform: translate(-50%, -50%) rotate(0deg) }
  to   { transform: translate(-50%, -50%) rotate(360deg) }
}
@keyframes eny-gather {
  0%   { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.78) }
  16%  { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1) }
  55%  { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1) }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.18) }
}
@keyframes eny-auroraA {
  0%   { transform: translate(-8%, -6%) scale(1) }
  50%  { transform: translate(10%, 9%)  scale(1.25) }
  100% { transform: translate(-8%, -6%) scale(1) }
}
@keyframes eny-auroraB {
  0%   { transform: translate(9%, 10%)  scale(1.1) }
  50%  { transform: translate(-11%, -8%) scale(0.9) }
  100% { transform: translate(9%, 10%)  scale(1.1) }
}
@media (prefers-reduced-motion: reduce) {
  .eny-outro-reveal * { animation: none !important; opacity: 1 !important; }
}
`;

function KeyframeStyles() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}

// ─────────────────────────── Orbit tile ───────────────────────────
// One tile, rendered by content type — same vocabulary as the intro.
function OrbitTile({ t }) {
  const img = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };
  const photo = `https://picsum.photos/seed/${t.seed}/${t.s * 2}/${t.s * 2}`;

  if (t.type === "person") {
    return <img src={avatarUrl(t.seed, t.s * 2)} alt="" style={img} />;
  }

  if (t.type === "photo") {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img src={photo} loading="lazy" alt="" style={img} />
        <div style={{ position: "absolute", bottom: 7, left: 8 }}>
          <Icon name="heart" size={13} color="#fff" />
        </div>
      </div>
    );
  }

  if (t.type === "video") {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img src={photo} loading="lazy" alt="" style={img} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.34))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 26,
            height: 26,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="play" size={12} color={TOKENS.ink} />
        </div>
      </div>
    );
  }

  if (t.type === "event") {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img src={photo} loading="lazy" alt="" style={img} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.4))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 7,
            left: 7,
            background: "#fff",
            borderRadius: 8,
            padding: "3px 7px",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          <div
            style={{
              fontFamily: TOKENS.mono,
              fontSize: 7,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: TOKENS.muted,
            }}
          >
            {t.date[0]}
          </div>
          <div
            style={{
              fontFamily: TOKENS.serif,
              fontSize: 14,
              color: TOKENS.ink,
              marginTop: 1,
            }}
          >
            {t.date[1]}
          </div>
        </div>
      </div>
    );
  }

  if (t.type === "news") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: TOKENS.card,
          padding: 11,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <div
          style={{
            fontFamily: TOKENS.mono,
            fontSize: 7,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: TOKENS.accent,
            marginBottom: 1,
          }}
        >
          {t.kicker}
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "rgba(31,26,22,0.18)",
            width: "92%",
          }}
        />
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "rgba(31,26,22,0.18)",
            width: "68%",
          }}
        />
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "rgba(31,26,22,0.10)",
            width: "82%",
          }}
        />
      </div>
    );
  }

  if (t.type === "audio") {
    const bars = [8, 14, 6, 17, 11, 15, 7, 13, 9];
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: TOKENS.dark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2.5,
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 2.5,
              height: h,
              borderRadius: 9999,
              background:
                i % 3 === 0 ? TOKENS.accent : "rgba(255,255,255,0.55)",
            }}
          />
        ))}
      </div>
    );
  }

  if (t.type === "community") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: TOKENS.card2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <div style={{ display: "flex" }}>
          {["a", "b", "c"].map((s, i) => (
            <img
              key={s}
              src={avatarUrl(t.seed + s, 48)}
              alt=""
              style={{
                width: 18,
                height: 18,
                borderRadius: 9999,
                border: `1.5px solid ${TOKENS.bg}`,
                marginLeft: i ? -6 : 0,
                objectFit: "cover",
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontFamily: TOKENS.mono,
            fontSize: 8,
            color: TOKENS.muted,
            letterSpacing: "0.04em",
          }}
        >
          {t.count}
        </div>
      </div>
    );
  }

  return null;
}

// ─────────────────────────── Outro reveal animation ───────────────────────────
// Reverse-orbit bookend: a few of the intro's content tiles start out on the
// ring and gather inward, dissolving into the mark — "everything, one place".
export default function OutroReveal({
  logoSrc = "b&w-logo.svg",
  background = TOKENS.bg,
  style,
}) {
  const GR = 116; // gather start radius
  const GATHER = [
    { type: "person", seed: "onb-face", s: 46, a: -90, radius: 9999 },
    { type: "photo", seed: "onb-photo", s: 42, a: -18 },
    { type: "news", seed: "onb-news", s: 44, a: 54, kicker: "Stadt" },
    { type: "event", seed: "onb-event", s: 42, a: 126, date: ["Fr", "24"] },
    { type: "audio", seed: "onb-audio", s: 40, a: 198 },
  ];

  return (
    <div
      className="eny-outro-reveal"
      style={{
        position: "relative",
        height: "100%",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background,
        overflow: "hidden",
        ...style,
      }}
    >
      <KeyframeStyles />

      {/* subtle theme-coloured aurora drifting behind everything */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "6%",
            left: "10%",
            width: "72%",
            height: "56%",
            borderRadius: 9999,
            background:
              "radial-gradient(circle, #F25A28 0%, transparent 65%)",
            opacity: 0.14,
            filter: "blur(24px)",
            animation: "eny-auroraA 16s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "4%",
            right: "6%",
            width: "64%",
            height: "50%",
            borderRadius: 9999,
            background:
              "radial-gradient(circle, #F77A4E 0%, transparent 65%)",
            opacity: 0.12,
            filter: "blur(26px)",
            animation: "eny-auroraB 20s ease-in-out infinite",
          }}
        />
      </div>

      {/* mark + breathing glow + rotating dashed ring + gathering tiles */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* breathing glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 220,
            height: 220,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(242,90,40,0.16) 0%, transparent 70%)",
            pointerEvents: "none",
            animation: "eny-glowpulse 4s ease-in-out infinite alternate",
          }}
        />
        {/* faint rotating dashed ring — echoes the intro's dotted connectors */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 134,
            height: 134,
            borderRadius: 9999,
            border: "1.5px dashed rgba(242,90,40,0.32)",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            animation: "eny-ringspin 34s linear infinite",
          }}
        />
        {/* tiles gather inward from the ring and dissolve into the mark */}
        {GATHER.map((t, i) => {
          const rad = (t.a * Math.PI) / 180;
          return (
            <div
              key={t.seed}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: t.s,
                height: t.s,
                "--dx": `${Math.round(GR * Math.cos(rad))}px`,
                "--dy": `${Math.round(GR * Math.sin(rad))}px`,
                borderRadius: t.radius || 14,
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(31,26,22,0.16)",
                opacity: 0,
                pointerEvents: "none",
                animation: `eny-gather 2.1s cubic-bezier(0.5,0,0.2,1) ${(
                  0.1 +
                  i * 0.12
                ).toFixed(2)}s both`,
              }}
            >
              <OrbitTile t={t} />
            </div>
          );
        })}
        {/* the mark — pops in */}
        <div
          style={{
            position: "relative",
            width: 84,
            height: 84,
            borderRadius: 9999,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(31,26,22,0.12)",
            animation: "eny-popin 0.7s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <img
            src={logoSrc}
            alt="eny"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
