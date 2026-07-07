---
title: "Hello, atmosphere"
date: "2026-07-07"
description: "eny.social now has a blog — markdown on the website, syndicated to the atmosphere as standard.site records."
tags: ["eny", "atproto", "standard.site"]
---

This is the first post on the eny.social blog.

Posts here are plain markdown files in the repository. The website renders them,
and each post is mirrored to our atproto account as a `site.standard.document`
record — metadata only, the words live here.

- Written once, in markdown
- Published on [eny.social](https://eny.social/blog)
- Discoverable across the atmosphere

You can see the atproto side of this very post in
[pdsls](https://pdsls.dev/at://did:plc:xtwtxzpedjpey4xjnvs56muh/site.standard.document/hello-atmosphere) —
and [browse the whole repo](https://pdsls.dev/at://did:plc:xtwtxzpedjpey4xjnvs56muh)
to see every record our account holds.

## How a post gets to the atmosphere

The sync is deliberately not part of the build — it's one command, run after
deploying. This is the whole workflow:

1. **Write.** Drop a markdown file in `content/blog/<slug>.md` with frontmatter:

   ```markdown
   ---
   title: "Hello, atmosphere"
   date: "2026-07-07"
   description: "One-liner for cards and records."
   tags: ["eny", "atproto"]
   ---

   Body in markdown…
   ```

   The filename becomes the URL segment *and* the atproto record key.

2. **Deploy.** Commit and ship — the post page, its `<link rel="site.standard.document">`
   verification tag, and the `/.well-known/site.standard.publication` route go live.

3. **Sync.** With the account credentials in `.env` (an app password, never the real one):

   ```bash
   pnpm sync:standard
   ```

   The script logs into the PDS and upserts one `site.standard.document` record per
   post — title, path, date, tags. No body: the record points at the canonical URL,
   it doesn't duplicate the content. Re-running is idempotent, and deleting a
   markdown file removes its record on the next sync.

4. **Verify.** The record shows up at
   `pdsls.dev/at://<did>/site.standard.document/<slug>`, and indexers across the
   atmosphere can pick it up once the domain verifies.

When do you need to re-sync? Only when metadata changes:

| Change | Re-sync? |
| --- | --- |
| New post, or edited title/description/date/tags | Yes |
| Deleted post | Yes |
| Edited the post body only | No |

More soon.
