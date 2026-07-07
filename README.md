# Landingpage for eny.social — A social network that belongs to the people

No algorithms shaping your reality. Decentralized. Built and hosted in Europe. Starting in Offenbach.

## What is eny.social?

eny.social is a social platform where you own your feed, your data, and your voice. Built as an alternative to algorithm-driven social media, it connects people, media, communities, and services, without selling your data or letting Silicon Valley shareholders decide what you see.

**Core values:**

- Everything in one place: people, media, and services
- Secure by design: we don't sell your data
- Made in Europe: built, hosted, and governed in Europe

The platform launches first in Offenbach am Main, bringing together local neighborhoods, events, and city services in one place.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Blog

Markdown files in `content/blog/<slug>.md` are the source of truth. The site renders
them at `/blog` and `/blog/<slug>`; a separate sync step mirrors each post to our
atproto account (`eny.social`) as a metadata-only `site.standard.document` record so
posts are discoverable across the atmosphere. The sync is **not** part of the build.

Publishing a post:

1. Add `content/blog/<slug>.md` with frontmatter (`title`, `date`, `description`, `tags`).
   The filename is the URL segment and the atproto record key.
2. Commit and deploy (the page, head verification tag, and well-known route must be live).
3. Run the sync with env from `.env` (see `.env.example`): `pnpm sync:standard`
4. Verify:
   - `curl https://eny.social/.well-known/site.standard.publication` → publication AT-URI
   - `curl -s https://eny.social/blog/<slug> | grep site.standard.document` → head `<link>` tag
   - `https://pdsls.dev/at://<did>/site.standard.document/<slug>` → the record

Re-sync when a post is added/deleted or its frontmatter changes. Body-only edits don't
need a re-sync — the records carry metadata only, never the post body.

---

> "Social media should be public infrastructure. Like roads, libraries or public spaces. Open, transparent and built for the people who use it."
