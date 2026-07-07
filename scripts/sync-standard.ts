// Syndicates blog posts to the PDS as site.standard.* records (POSSE).
// Metadata only — post bodies live on the website, never in the records.
//
// NOT part of the build. Run manually AFTER deploying new/changed posts:
//   pnpm sync:standard
//
// Requires (e.g. in .env, see .env.example):
//   ATP_SERVICE, ATP_IDENTIFIER, ATP_APP_PASSWORD, ATP_PUB_RKEY?, SITE_URL?
import "dotenv/config";
import { AtpAgent } from "@atproto/api";
import { getAllPostMeta } from "../lib/blog";
import { siteDescription, siteName } from "../lib/site";

const DOC_COLLECTION = "site.standard.document";
const PUB_COLLECTION = "site.standard.publication";

const service = (process.env.ATP_SERVICE || "https://bsky.social").trim();
const identifier = process.env.ATP_IDENTIFIER?.trim();
const password = process.env.ATP_APP_PASSWORD?.trim();
const pubRkey = (process.env.ATP_PUB_RKEY || "eny-social").trim();
const siteUrl = (process.env.SITE_URL || "https://eny.social").trim().replace(/\/$/, "");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!identifier || !password) {
    throw new Error("Set ATP_IDENTIFIER and ATP_APP_PASSWORD (app password, not the real one)");
  }

  const agent = new AtpAgent({ service });
  await agent.login({ identifier, password });
  const did = agent.session!.did;
  console.log(`Logged in as ${identifier} (${did})`);

  // Publication (upsert; fixed rkey). Canonical post URL = publication.url +
  // document.path, so url carries /blog and paths are /<slug> — never both.
  const pubUri = `at://${did}/${PUB_COLLECTION}/${pubRkey}`;
  await agent.com.atproto.repo.putRecord({
    repo: did,
    collection: PUB_COLLECTION,
    rkey: pubRkey,
    validate: false, // PDS doesn't carry the site.standard.* lexicon
    record: {
      $type: PUB_COLLECTION,
      url: `${siteUrl}/blog`,
      name: siteName,
      description: siteDescription,
      preferences: { showInDiscover: true },
      // icon: needs a square >=256px image/* blob via agent.uploadBlob() — add
      // one here when we have a square PNG of the logo.
    },
  });
  console.log(`Publication: ${pubUri}`);

  // Documents (upsert; rkey = slug → idempotent re-runs)
  const posts = getAllPostMeta();
  for (const post of posts) {
    await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: DOC_COLLECTION,
      rkey: post.slug,
      validate: false,
      record: {
        $type: DOC_COLLECTION,
        site: pubUri,
        title: post.title,
        path: `/${post.slug}`,
        description: post.description,
        publishedAt: post.publishedAt,
        tags: post.tags,
      },
    });
    console.log(`Document:    at://${did}/${DOC_COLLECTION}/${post.slug}`);
    await sleep(200);
  }

  // Reconcile deletions: drop records whose slug no longer has a file
  const slugs = new Set(posts.map((p) => p.slug));
  let cursor: string | undefined;
  do {
    const res = await agent.com.atproto.repo.listRecords({
      repo: did,
      collection: DOC_COLLECTION,
      limit: 100,
      cursor,
    });
    for (const record of res.data.records) {
      const rkey = record.uri.split("/").pop()!;
      if (!slugs.has(rkey)) {
        await agent.com.atproto.repo.deleteRecord({
          repo: did,
          collection: DOC_COLLECTION,
          rkey,
        });
        console.log(`Deleted:     ${record.uri} (no matching file)`);
        await sleep(200);
      }
    }
    cursor = res.data.cursor;
  } while (cursor);

  console.log(`Synced ${posts.length} post(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
