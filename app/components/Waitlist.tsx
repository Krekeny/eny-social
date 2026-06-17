"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";
import SectionIntroLabel from "./ui/SectionIntroLabel";

const ENY_DID = "did:plc:xtwtxzpedjpey4xjnvs56muh";

const followerPositions = [
  { top: "8%", left: "20%", size: 48, delay: 0 },
  { top: "15%", right: "20%", size: 40, delay: 1.2 },
  { top: "60%", left: "15%", size: 36, delay: 0.8 },
  { top: "70%", right: "18%", size: 44, delay: 2 },
];

const placeholders = [
  { top: "35%", left: "75%", size: 32, delay: 1.5 },
  { top: "80%", left: "28%", size: 38, delay: 0.4 },
  { top: "25%", left: "12%", size: 42, delay: 1.8 },
  { top: "50%", right: "14%", size: 34, delay: 0.6 },
];

async function getFollowerAvatars(actor: string) {
  const avatars: string[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ actor, limit: "100" });
    if (cursor) params.set("cursor", cursor);

    const res = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.graph.getFollowers?${params}`,
    );
    const data = await res.json();

    for (const f of data.followers) {
      if (f.avatar) avatars.push(f.avatar);
    }
    cursor = data.cursor;
  } while (cursor);

  return avatars;
}

const colors = [
  "bg-tangerine",
  "bg-monte-carlo",
  "bg-cotton-candy",
  "bg-pacific",
  "bg-apricot",
  "bg-monte-carlo",
  "bg-cotton-candy",
  "bg-pacific",
];

const STATUS_MESSAGES: Record<string, string> = {
  confirmationSent: "Thank you! Check your inbox to confirm.",
  confirmationAlreadySent:
    "A confirmation email was already sent — check your inbox.",
  alreadySubscribed: "You're already subscribed!",
  subscribed: "You're in!",
};

async function subscribeToNewsletter(email: string) {
  const url = process.env.NEXT_PUBLIC_NEWSLETTER_URL;
  if (!url) throw new Error("Newsletter URL not configured");

  const res = await fetch(`${url}subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email }),
  });

  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const title = doc.querySelector("title")?.textContent ?? "";

  const match = Object.entries(STATUS_MESSAGES).find(
    ([, msg]) => msg === title,
  );
  return match?.[0] ?? "confirmationSent";
}

export default function Waitlist() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [followerAvatars, setFollowerAvatars] = useState<string[]>([]);

  const avatars = [
    ...followerPositions.map((pos, i) => ({ ...pos, img: followerAvatars[i] })),
    ...placeholders,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setStatus(null);

    try {
      const code = await subscribeToNewsletter(email);
      setStatus(code);
      setEmail("");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFollowerAvatars(ENY_DID)
      .then((all) => {
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        setFollowerAvatars(shuffled.slice(0, followerPositions.length));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="waitlist"
      className="relative overflow-hidden px-6 py-32"
    >
      {/* Floating avatars */}
      {avatars.map((avatar, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${
            colors[i]
          } transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-40 lg:opacity-90 scale-100"
              : "opacity-0 scale-0"
          }`}
          style={{
            top: avatar.top,
            left: "left" in avatar ? avatar.left : undefined,
            right: "right" in avatar ? avatar.right : undefined,
            width: avatar.size,
            height: avatar.size,
            transitionDelay: isVisible ? `${i * 120}ms` : "0ms",
            animationName: isVisible
              ? i % 2 === 0
                ? "float"
                : "float-slow"
              : "none",
            animationDuration: `${6 + i}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${avatar.delay}s`,
          }}
        >
          {"img" in avatar && avatar.img ? (
            <img
              src={avatar.img}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/50">
              <svg
                className="h-1/2 w-1/2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
              </svg>
            </div>
          )}
        </div>
      ))}

      {/* Decorative connecting lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M120 60 C300 200, 500 100, 600 300 S900 400, 1080 150"
          stroke="var(--tangerine-dream)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M100 500 C250 350, 450 450, 600 300 S850 200, 1100 400"
          stroke="var(--monte-carlo)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      <div
        className={`relative mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
      >
        <SectionIntroLabel>Come on in</SectionIntroLabel>

        <h2 className="mt-6">
          Stay in the <span className="italic text-tangerine">loop</span>
        </h2>

        <p className="section-copy mx-auto mt-6 max-w-lg">
          We&apos;re not ready yet, but we&apos;re getting close. Drop your
          email and we&apos;ll let you know when eny.social launches.
        </p>

        {status ? (
          <p className="section-copy mt-10">
            {STATUS_MESSAGES[status] ?? "Thanks for signing up!"}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`mx-auto mt-10 flex max-w-md items-center gap-0 rounded-full border-2 border-charcoal bg-transparent pl-5 pr-1 py-1 transition-opacity ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent font-['Instrument_Sans'] text-[18px] font-medium tracking-[-0.6px] text-charcoal placeholder:text-charcoal/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-charcoal py-0 pl-[14px] pr-[3px] font-['Instrument_Sans'] text-[18px] font-medium leading-[200%] tracking-[-0.6px] text-linen transition-all hover:bg-transparent hover:text-charcoal"
            >
              join
              <ArrowCircleRightIcon
                className="h-8 w-8 transition-transform group-hover:translate-x-0.5"
                weight="regular"
              />
            </button>
          </form>
        )}
        {error && (
          <p className="section-copy mt-4 text-cotton-candy">
            Something went wrong, please try again later :(
          </p>
        )}
      </div>
    </section>
  );
}
