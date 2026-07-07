import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export async function markdownToHtml(md: string): Promise<string> {
  return String(await remark().use(remarkGfm).use(remarkHtml).process(md));
}
