// OrbitIntro.jsx — self-contained extract of the eny start-screen animation.
//
// Exact copy of the intro's orbital constellation: dotted spokes that fade in
// and flow inward, sonar pings + a breathing glow at the center, the eny mark
// popping in first, then seven content tiles popping in one-by-one and settling
// into a gentle float. The headline / CTA that sat below the animation are NOT
// included.
//
// Zero external dependencies. Design tokens are baked in as literals (TOKENS),
// keyframes are injected once under an `eny-`-namespaced <style> so they can't
// collide with the host app. Just:  import OrbitIntro from "./OrbitIntro";
//
// The animation needs a tall container to breathe (~560px). By default the root
// fills its parent (height:100%) and enforces minHeight:560. Pass `logoSrc` to
// point the center mark at your asset (defaults to "b&w-logo.svg").

import React from "react";

// ─────────────────────────── Design tokens (inlined) ───────────────────────────
const TOKENS = {
  bg: "#F5F0E8",
  ink: "#1F1A16",
  muted: "#7A7268",
  accent: "#F25A28", // === rgba(242,90,40,*)
  card: "#E8E2D6",
  card2: "#D8D2C4",
  dark: "#1F1A16",
  serif: "'Bricolage Grotesque', 'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace",
};

// ─────────────────────────── Helpers (inlined) ───────────────────────────
// Consistent per-user avatar — pravatar keyed by a stable identifier.
function avatarUrl(seed, size = 128) {
  return `https://i.pravatar.cc/${Math.round(size)}?u=${encodeURIComponent(
    String(seed)
  )}`;
}

// Only the two glyphs the orbit tiles use (heart, play), trimmed from the
// prototype's Icon set.
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

// Keyframes — injected once, namespaced so they never clash with the host app.
const KEYFRAMES = `
@keyframes eny-fadein { from { opacity: 0 } to { opacity: 1 } }
@keyframes eny-dashflow { to { stroke-dashoffset: -20 } }
@keyframes eny-popin {
  from { opacity: 0; transform: scale(0.3) }
  to   { opacity: 1; transform: scale(1) }
}
@keyframes eny-floaty {
  from { transform: translateY(7px)  rotate(-1deg) }
  to   { transform: translateY(-7px) rotate(1deg) }
}
@keyframes eny-glowpulse {
  from { opacity: 0.55; transform: translate(-50%,-50%) scale(0.85) }
  to   { opacity: 1;    transform: translate(-50%,-50%) scale(1.12) }
}
@keyframes eny-sonar {
  0%   { opacity: 0.5; transform: translate(-50%,-50%) scale(0.35) }
  70%  { opacity: 0 }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(2) }
}
`;

function KeyframeStyles() {
  // dangerouslySetInnerHTML is the standard way to ship raw @keyframes with a
  // component; the string is a static literal, so no injection surface.
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}

// ─────────────────────────── Orbit tile ───────────────────────────
// One orbit tile, rendered by content type. Each fills its rounded frame and
// carries a single strong signal so it reads at ~60–90px: a face, a photo, a
// reel, an event, an audio wave, a news card, a community.
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

// ─────────────────────────── Orbit intro animation ───────────────────────────
// The orbit previews eny's own content vocabulary — Menschen · Medien ·
// Communities. Seven content tiles in angular order from the top, laid on a
// vertical ELLIPSE (RY > RX → "egg-shaped") so the ring uses the tall screen
// instead of a cramped 1:1 circle.
export default function OrbitIntro({
  logoSrc = "b&w-logo.svg",
  background = TOKENS.bg,
  style,
}) {
  const STAGE_W = 360;
  const CENTER_X = STAGE_W / 2;
  const CENTER_Y = 320;
  const RX = 140; // horizontal radius
  const RY = 188; // vertical radius — larger, for the egg shape
  const TILES = [
    { type: "person", seed: "onb-face", s: 92, rot: -3, radius: 9999 },
    { type: "photo", seed: "onb-photo", s: 74, rot: 6 },
    { type: "video", seed: "onb-reel", s: 78, rot: -3 },
    { type: "event", seed: "onb-event", s: 68, rot: 5, date: ["Fr", "24"] },
    { type: "audio", seed: "onb-audio", s: 68, rot: -5 },
    { type: "news", seed: "onb-news", s: 78, rot: 5, kicker: "Stadt" },
    { type: "community", seed: "onb-crew", s: 74, rot: -6, count: "+59" },
  ];
  const ORBIT = TILES.map((t, i) => {
    const a = ((-90 + i * (360 / TILES.length)) * Math.PI) / 180;
    return {
      ...t,
      cx: CENTER_X + RX * Math.cos(a),
      cy: CENTER_Y + RY * Math.sin(a),
    };
  });

  // Fixed entrance order that scatters around the ring so the pop-in reads as
  // "random" without being random. popOrder[i] = entrance rank of position i.
  // Appearance sequence: video, audio, person, community, event, photo, news.
  const popOrder = [2, 5, 0, 4, 1, 6, 3];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 560,
        overflow: "hidden",
        background,
        ...style,
      }}
    >
      <KeyframeStyles />

      {/* Fixed-width stage, centered — gives every element a single symmetric
          coordinate system (180/320 center) so the constellation stays aligned
          regardless of container width. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: STAGE_W,
        }}
      >
        {/* Dotted spokes — behind everything; fade in once. The dashes are
            static: animating stroke-dashoffset repaints the SVG on the main
            thread every frame, which stutters against the scroll during the
            phone slide-up. The constellation reads fine without the flow. */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            animation: "eny-fadein 0.9s ease 0.45s both",
          }}
          fill="none"
        >
          {ORBIT.map((p) => (
            <line
              key={p.seed}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={p.cx}
              y2={p.cy}
              stroke="rgba(31,26,22,0.14)"
              strokeWidth="1"
              strokeDasharray="3 7"
            />
          ))}
        </svg>

        {/* Sonar pings radiating from the center mark */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: CENTER_Y,
              left: "50%",
              width: 120,
              height: 120,
              borderRadius: 9999,
              border: "1px solid rgba(242,90,40,0.45)",
              pointerEvents: "none",
              // hidden until its ping starts; the keyframe drives opacity from there
              opacity: 0,
              transform: "translate(-50%, -50%)",
              animation: `eny-sonar 3.2s ease-out ${(0.5 + i * 1.6).toFixed(
                1
              )}s infinite`,
            }}
          />
        ))}

        {/* Soft glow — gently breathing */}
        <div
          style={{
            position: "absolute",
            top: CENTER_Y,
            left: "50%",
            width: 220,
            height: 220,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(242,90,40,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
            animation: "eny-glowpulse 4s ease-in-out infinite alternate",
          }}
        />

        {/* Center logo — pops in first. Outer holds the centering transform so
            the inner pop (which animates transform:scale) can't clobber it. */}
        <div
          style={{
            position: "absolute",
            top: CENTER_Y,
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 84,
            height: 84,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
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

        {/* Orbiting content tiles — pop in one-by-one, then settle into a float */}
        {ORBIT.map((p, i) => (
          <div
            key={p.seed}
            style={{
              position: "absolute",
              top: p.cy - p.s / 2,
              left: p.cx - p.s / 2,
              width: p.s,
              height: p.s,
              animation: `eny-popin 0.6s cubic-bezier(0.34,1.56,0.64,1) ${(
                0.55 +
                popOrder[i] * 0.08
              ).toFixed(2)}s both`,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                animation: `eny-floaty ${(3.2 + (i % 4) * 0.6).toFixed(
                  1
                )}s ease-in-out -${(i * 0.7).toFixed(1)}s infinite alternate`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: p.radius || 20,
                  overflow: "hidden",
                  transform: `rotate(${p.rot}deg)`,
                  boxShadow: "0 6px 18px rgba(31,26,22,0.16)",
                }}
              >
                <OrbitTile t={p} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
