// standard.site domain verification: serves the publication AT-URI as plain
// text from the host root. force-dynamic so ATP_DID is read per-request and
// changing the env var doesn't require a rebuild.
export const dynamic = "force-dynamic";

export function GET() {
  const rkey = (process.env.ATP_PUB_RKEY || "eny-social").trim();
  const did = process.env.ATP_DID?.trim();
  if (!did) return new Response("ATP_DID not configured", { status: 503 });
  return new Response(`at://${did}/site.standard.publication/${rkey}`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
