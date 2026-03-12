"use client";

import ButtonCta from "./ui/ButtonCta";
import SectionIntroLabel from "./ui/SectionIntroLabel";

const avatars = [
  { top: "8%", left: "20%", size: 48, delay: 0, img: "https://stinkhorn.us-west.host.bsky.network/xrpc/com.atproto.sync.getBlob?did=did:plc:vmqt4a4pf5jxvtalzjz2zsqk&cid=bafkreifed32u3tuknqoywdqij24vm4jqn35pvkx3q6spmqqoxiv654wtva" },
  { top: "15%", right: "20%", size: 40, delay: 1.2, img: "https://calocybe.us-west.host.bsky.network/xrpc/com.atproto.sync.getBlob?did=did:plc:xrdmnk5t6y5l2n3zq5pok4ua&cid=bafkreibddkvunzwhhtloccrzia6ugllqq7bow435sjclvhbhhkmwqu2d4a" },
  { top: "60%", left: "15%", size: 36, delay: 0.8, img: "https://panus.us-west.host.bsky.network/xrpc/com.atproto.sync.getBlob?did=did:plc:35gbbt2mb36gsl62tduilory&cid=bafkreigfixmlz4ynckkwtzuvxmowbozwlokr2aapgm36ne5sse4tzhxf3u" },
  { top: "70%", right: "18%", size: 44, delay: 2, img: "https://agrocybe.us-west.host.bsky.network/xrpc/com.atproto.sync.getBlob?did=did:plc:ymdvhm76z46uamksi25rffeh&cid=bafkreifp66m5ihkxuthf4vwo6b5ao3evl52fbezsvfkfucxedox3a7joli" },
  { top: "35%", left: "75%", size: 32, delay: 1.5 },
  { top: "80%", left: "28%", size: 38, delay: 0.4 },
  { top: "25%", left: "12%", size: 42, delay: 1.8 },
  { top: "50%", right: "14%", size: 34, delay: 0.6 },
];

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

export default function Waitlist() {
  return (
    <section id="waitlist" className="relative overflow-hidden px-6 py-32">
      {/* Floating avatars */}
      {avatars.map((avatar, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${colors[i]} opacity-60`}
          style={{
            top: avatar.top,
            left: "left" in avatar ? avatar.left : undefined,
            right: "right" in avatar ? avatar.right : undefined,
            width: avatar.size,
            height: avatar.size,
            animation: `${i % 2 === 0 ? "float" : "float-slow"} ${
              6 + i
            }s ease-in-out infinite`,
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

      <div className="relative mx-auto max-w-2xl text-center">
        <SectionIntroLabel>Come on in</SectionIntroLabel>

        <h2 className="mt-6">
          Join the first <span className="italic text-tangerine">1,000</span>
        </h2>

        <p className="section-copy mx-auto mt-6 max-w-lg">
          The algorithms shaping your reality shouldn't be controlled by
          shareholders in Silicon Valley. At eny.social, you own your feed, your
          data, and your voice.
        </p>

        <ButtonCta href="#" variant="ghost" className="mt-10">join the waitlist</ButtonCta>
      </div>
    </section>
  );
}
