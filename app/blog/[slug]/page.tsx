import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { getAllSlugs, getPost } from "@/lib/blog";
import { siteName } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — ${siteName}`,
    description: post.description,
    openGraph: {
      type: "article",
      siteName,
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      images: [{ url: "/opengraph.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // standard.site domain verification: React hoists this into <head>.
  const did = process.env.ATP_DID?.trim();

  return (
    <div className="overflow-x-hidden">
      {did && (
        <link
          rel="site.standard.document"
          href={`at://${did}/site.standard.document/${post.slug}`}
        />
      )}
      <Nav />
      <main className="px-6 pt-32 pb-24">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <h1 className="card-headline">{post.title}</h1>
            <time
              dateTime={post.publishedAt}
              className="mt-2 block text-sm text-charcoal/60"
            >
              {formatDate(post.publishedAt)}
            </time>
            {post.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-apricot/40 px-3 py-0.5 text-sm text-dusk"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <div
            className="prose max-w-none text-charcoal/90 prose-headings:font-sans prose-headings:text-charcoal prose-a:text-pacific prose-img:w-full prose-img:rounded-3xl prose-figure:my-10 prose-figcaption:mt-4 prose-figcaption:text-center prose-figcaption:font-serif prose-figcaption:italic prose-figcaption:text-base prose-figcaption:text-dusk"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
