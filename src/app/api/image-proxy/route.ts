import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { notion } from "@/lib/notion";

const UUID_REGEX =
  /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

function isValidNotionId(id: string): boolean {
  return UUID_REGEX.test(id);
}

const resolveNotionFileUrl = unstable_cache(
  async (pageId: string, prop: string): Promise<string | null> => {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (!("properties" in page)) return null;
    const property = page.properties[prop];
    if (!property || property.type !== "files" || property.files.length === 0) {
      return null;
    }
    const f = property.files[0] as {
      type: string;
      file?: { url: string };
      external?: { url: string };
      file_upload?: { url?: string };
    };
    if (f.type === "external") return f.external?.url ?? null;
    if (f.type === "file") return f.file?.url ?? null;
    if (f.type === "file_upload") return f.file_upload?.url ?? null;
    return null;
  },
  ["notion-file-url"],
  { revalidate: 3600 },
);

const resolveNotionBlockImageUrl = unstable_cache(
  async (blockId: string): Promise<string | null> => {
    const block = await notion.blocks.retrieve({ block_id: blockId });
    if (!("type" in block) || block.type !== "image") return null;
    const img = block.image as {
      type: string;
      file?: { url: string };
      external?: { url: string };
      file_upload?: { url?: string };
    };
    if (img.type === "external") return img.external?.url ?? null;
    if (img.type === "file") return img.file?.url ?? null;
    if (img.type === "file_upload") return img.file_upload?.url ?? null;
    return null;
  },
  ["notion-block-image-url"],
  { revalidate: 3600 },
);

async function streamUpstream(url: string) {
  let upstream: Response;
  try {
    upstream = await fetch(url, { cache: "no-store" });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status });
  }
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/*",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const blockId = sp.get("blockId");
  if (blockId) {
    if (!isValidNotionId(blockId)) {
      return new NextResponse("Bad request", { status: 400 });
    }
    const fresh = await resolveNotionBlockImageUrl(blockId);
    if (!fresh) return new NextResponse(null, { status: 404 });
    return streamUpstream(fresh);
  }

  const pageId = sp.get("pageId");
  const prop = sp.get("prop");
  if (pageId && prop) {
    if (!isValidNotionId(pageId)) {
      return new NextResponse("Bad request", { status: 400 });
    }
    try {
      const fresh = await resolveNotionFileUrl(pageId, prop);
      if (!fresh) {
        console.warn("[image-proxy] no file resolved", { pageId, prop });
        return new NextResponse(null, { status: 404 });
      }
      return streamUpstream(fresh);
    } catch (e) {
      console.error("[image-proxy] notion error", { pageId, prop, error: e });
      return new NextResponse(null, { status: 500 });
    }
  }

  return new NextResponse("Bad request", { status: 400 });
}

