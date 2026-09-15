import { Client, isNotionClientError } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Do not reuse the shared Notion client: it caches responses for an hour,
// which is also the lifetime of a Notion download URL.
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  fetch: (url, init) => fetch(url, { ...init, cache: "no-store" }),
});
const headers = { "Cache-Control": "private, no-store, max-age=0" };
const normalizeId = (id: string) => id.replaceAll("-", "").toLowerCase();

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get("pageId");
  const name = req.nextUrl.searchParams.get("name");
  if (!pageId || !/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(pageId) || !name) {
    return new NextResponse("Invalid attachment request", { status: 400, headers });
  }

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const databaseIds = [process.env.NOTION_NOTICE_DATABASE_ID, process.env.NOTION_NOTICE_DATABASE_ID_EN]
      .filter((id): id is string => !!id).map(normalizeId);
    if (!("properties" in page) || page.archived || page.in_trash ||
        page.parent.type !== "database_id" ||
        !databaseIds.includes(normalizeId(page.parent.database_id))) {
      return new NextResponse("Attachment not found", { status: 404, headers });
    }
    const property = page.properties["파일과 미디어"];
    const file = property?.type === "files" ? property.files.find((file) => file.name === name) : undefined;
    const url = file?.type === "file" ? file.file.url : file?.type === "external" ? file.external.url : undefined;
    if (!url || !/^https?:\/\//i.test(url)) {
      return new NextResponse("Attachment not found", { status: 404, headers });
    }
    // Only the stable app URL appears in cached pages. Resolve a fresh signed
    // URL on every click, and never cache the redirect itself.
    return new NextResponse(null, { status: 307, headers: { ...headers, Location: url } });
  } catch (error) {
    const status = isNotionClientError(error) && error.code === "object_not_found" ? 404 : 502;
    return new NextResponse(status === 404 ? "Attachment not found" : "Unable to open attachment. Please try again.", { status, headers });
  }
}
