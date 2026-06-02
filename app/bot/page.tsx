import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "EnyBot — eny.social",
  description:
    "Learn about EnyBot, the web crawler used by eny.social to discover and index content across the decentralized web.",
};

export default function BotPage() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4">EnyBot</h1>
          <p className="section-copy mb-12 text-charcoal/60">
            About the eny.social web crawler
          </p>

          <div className="prose space-y-8 text-charcoal/80">
            {/* --- Overview --- */}
            <section>
              <h2 className="headline-label">Overview</h2>
              <p className="section-copy">
                EnyBot is the web crawler (&quot;robot&quot;) operated by{" "}
                <a href="https://eny.social" className="text-pacific underline">
                  eny.social
                </a>{" "}
                to discover, fetch and index publicly available web content. The
                crawled content is used to power search and discovery features
                across the eny.social network.
              </p>
            </section>

            {/* --- User agent --- */}
            <section>
              <h2 className="headline-label mt-10">User agent</h2>
              <p className="section-copy">
                EnyBot identifies itself with the following full user agent
                string:
              </p>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-charcoal/5 p-5 text-sm leading-relaxed font-mono text-charcoal whitespace-pre-wrap break-all">
                <code>
                  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
                  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0
                  Safari/537.36; compatible; EnyBot/1.0; +https://eny.social/bot
                </code>
              </pre>

              <p className="section-copy mt-4">
                The{" "}
                <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                  robots.txt
                </code>{" "}
                token to match against is{" "}
                <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                  EnyBot
                </code>
                .
              </p>
            </section>

            {/* --- Robots.txt --- */}
            <section>
              <h2 className="headline-label mt-10">
                Controlling access via robots.txt
              </h2>
              <p className="section-copy">
                EnyBot respects the{" "}
                <a
                  href="https://www.robotstxt.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pacific underline"
                >
                  Robots Exclusion Protocol
                </a>
                . To control how EnyBot crawls your site, use the{" "}
                <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                  EnyBot
                </code>{" "}
                token in your{" "}
                <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                  robots.txt
                </code>{" "}
                file.
              </p>

              <h3 className="headline-label mt-6 text-base">
                Allow EnyBot to crawl your entire site
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-charcoal/5 p-5 text-sm leading-relaxed font-mono text-charcoal">
                <code>{`User-agent: EnyBot\nAllow: /`}</code>
              </pre>

              <h3 className="headline-label mt-6 text-base">
                Disallow EnyBot entirely
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-charcoal/5 p-5 text-sm leading-relaxed font-mono text-charcoal">
                <code>{`User-agent: EnyBot\nDisallow: /`}</code>
              </pre>

              <h3 className="headline-label mt-6 text-base">
                Disallow specific paths
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-charcoal/5 p-5 text-sm leading-relaxed font-mono text-charcoal">
                <code>
                  {`User-agent: EnyBot\nDisallow: /private/\nDisallow: /api/`}
                </code>
              </pre>

              <p className="section-copy mt-4">
                If no{" "}
                <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                  EnyBot
                </code>{" "}
                directive is present, EnyBot will fall back to the rules defined
                under{" "}
                <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                  User-agent: *
                </code>
                .
              </p>
            </section>

            {/* --- Crawl behavior --- */}
            <section>
              <h2 className="headline-label mt-10">Crawl behavior</h2>
              <ul className="list-disc space-y-2 pl-6 text-charcoal/80">
                <li>
                  EnyBot respects{" "}
                  <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                    Crawl-delay
                  </code>{" "}
                  directives.
                </li>
                <li>
                  EnyBot honors{" "}
                  <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                    noindex
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-sm font-mono">
                    nofollow
                  </code>{" "}
                  meta tags and HTTP response headers.
                </li>
                <li>
                  Crawl rate is adaptive and designed to avoid placing excessive
                  load on any single host.
                </li>
                <li>
                  EnyBot will retry on temporary errors (5xx) with exponential
                  back-off.
                </li>
              </ul>
            </section>

            {/* --- Contact --- */}
            <section>
              <h2 className="headline-label mt-10">Contact</h2>
              <p className="section-copy">
                If you have questions or concerns about EnyBot, please contact
                us at{" "}
                <a
                  href="mailto:hello+eny@krekeny.com"
                  className="text-pacific underline"
                >
                  hello+eny@krekeny.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
