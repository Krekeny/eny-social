import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
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
      <main className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="card-headline mb-12">blog</h1>

          <ul className="space-y-12">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h2 className="card-headline text-3xl transition-colors group-hover:text-dusk">
                    {post.title}
                  </h2>
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
              </li>
            ))}
          </ul>

          {posts.length === 0 && (
            <p className="text-charcoal/60">Nothing here yet — first post coming soon.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
