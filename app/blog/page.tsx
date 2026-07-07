import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import FadeIn from "../components/ui/FadeIn";
import SectionIntroLabel from "../components/ui/SectionIntroLabel";
import { getAllPostMeta } from "@/lib/blog";
import { siteName } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `blog — ${siteName}`,
  description: "Notes from building a social network that belongs to the people.",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default function BlogIndexPage() {
  const posts = getAllPostMeta();

  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative px-6 pt-32 pb-16">
          <div className="relative mx-auto max-w-4xl text-center">
            <FadeIn>
              <SectionIntroLabel>blog</SectionIntroLabel>
            </FadeIn>

            <FadeIn delay={100}>
              <h2 className="mt-6">
                Recent <span className="italic text-tangerine">blerps</span>.
              </h2>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="section-copy mx-auto mt-8 max-w-2xl">
                This is where we think out loud, share updates and decisions while building a social network that belongs to the people. This blog is shared across the atmosphere.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Posts */}
        <section className="px-6 pb-24 pt-8">
          <div className="mx-auto max-w-3xl">
            <ul className="space-y-12">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <FadeIn delay={i * 100}>
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <h3 className="card-headline text-3xl transition-colors group-hover:text-dusk">
                        {post.title}
                      </h3>
                      <time
                        dateTime={post.publishedAt}
                        className="mt-1 block text-sm text-charcoal/60"
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                      {post.description && (
                        <p className="mt-3 text-charcoal/80">{post.description}</p>
                      )}
                    </Link>
                  </FadeIn>
                </li>
              ))}
            </ul>

            {posts.length === 0 && (
              <p className="text-charcoal/60">
                Nothing here yet — first post coming soon.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
