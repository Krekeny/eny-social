import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Nodes, Root } from "mdast";

function textOf(node: Nodes): string {
  if ("value" in node && typeof node.value === "string") return node.value;
  if ("children" in node) return node.children.map(textOf).join("");
  return "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Turns a paragraph containing only an image into a <figure>. An immediately
 * following paragraph that is only emphasis (`*like this*`) becomes its
 * <figcaption> — the natural way to caption an image in markdown.
 */
function remarkFigures() {
  return (tree: Root) => {
    const children = tree.children;
    for (let i = 0; i < children.length; i++) {
      const para = children[i];
      if (para.type !== "paragraph" || para.children.length !== 1) continue;
      const img = para.children[0];
      if (img.type !== "image") continue;

      const next = children[i + 1];
      let captionNode: Nodes | undefined;
      if (
        next?.type === "paragraph" &&
        next.children.length === 1 &&
        next.children[0].type === "emphasis"
      ) {
        captionNode = next.children[0];
      }

      const imgTag = `<img src="${escapeHtml(img.url)}" alt="${escapeHtml(
        img.alt ?? "",
      )}" loading="lazy">`;
      const caption = captionNode
        ? `<figcaption>${escapeHtml(textOf(captionNode))}</figcaption>`
        : "";
      children.splice(i, captionNode ? 2 : 1, {
        type: "html",
        value: `<figure>${imgTag}${caption}</figure>`,
      });
    }
  };
}

export async function markdownToHtml(md: string): Promise<string> {
  return String(
    await remark()
      .use(remarkGfm)
      .use(remarkFigures)
      .use(remarkHtml, { sanitize: false })
      .process(md),
  );
}
