import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  RichTextItemResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Locale } from "./content";

interface DateResponse {
  start: string;
  end: string | null;
  time_zone: string | null;
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  fetch: (url, init) =>
    fetch(url, {
      ...init,
      next: { revalidate: 60 },
    }),
});

export interface CalendarItem {
  id: string;
  date: string;
  title: string;
  description?: string;
}

// 페이지네이션 헬퍼 함수
async function queryDatabaseWithPagination(
  databaseId: string,
  sorts?: Array<{ property: string; direction: "ascending" | "descending" }>
): Promise<PageObjectResponse[]> {
  let allResults: PageObjectResponse[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts,
      start_cursor: startCursor,
    });

    const pages = response.results.filter(
      (page): page is PageObjectResponse => "properties" in page
    );
    allResults = [...allResults, ...pages];

    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return allResults;
}

function getPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((text) => text.plain_text).join("");
}

function formatDate(dateObj: DateResponse | null): string {
  if (!dateObj) return "";

  const formatSingle = (d: string) => {
    const date = new Date(d);
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}.${mm}.${dd}`;
  };

  if (dateObj.end) {
    return `${formatSingle(dateObj.start)} ~ ${formatSingle(dateObj.end)}`;
  }
  return formatSingle(dateObj.start);
}

function getDatabaseId(key: string, locale: Locale = "kr"): string | undefined {
  if (locale === "en") {
    return process.env[`${key}_EN`] || process.env[key];
  }
  return process.env[key];
}

export async function getCalendarData(locale: Locale = "kr"): Promise<CalendarItem[]> {
  try {
    const databaseId = getDatabaseId("NOTION_CALENDAR_DATABASE_ID", locale);

    if (!databaseId) {
      console.error("NOTION_CALENDAR_DATABASE_ID is not set");
      return [];
    }

    const pages = await queryDatabaseWithPagination(databaseId, [
      { property: "날짜", direction: "descending" },
    ]);

    return pages.map((page) => {
      const properties = page.properties;

      const date =
        properties["날짜"]?.type === "date"
          ? formatDate(properties["날짜"].date)
          : "";

      const title =
        properties["제목"]?.type === "title"
          ? getPlainText(properties["제목"].title)
          : "";

      const description =
        properties["소제목"]?.type === "rich_text"
          ? getPlainText(properties["소제목"].rich_text)
          : undefined;

      return {
        id: page.id,
        date,
        title,
        description: description || undefined,
      };
    });
  } catch (error) {
    console.error("Failed to fetch calendar data:", error);
    return [];
  }
}

export async function getCalendarDataRaw(locale: Locale = "kr") {
  const databaseId = getDatabaseId("NOTION_CALENDAR_DATABASE_ID", locale);

  if (!databaseId) {
    throw new Error("NOTION_CALENDAR_DATABASE_ID is not set");
  }

  return notion.databases.query({
    database_id: databaseId,
  });
}

// Notice 관련
export interface NoticeItem {
  id: string;
  category: string;
  title: string;
  image: string;
  date: string;
}

export interface NoticeDetail extends NoticeItem {
  content: string;
  blocks: BlockObjectResponse[];
}

function getFileUrl(
  files: Array<{
    type: string;
    file?: { url: string };
    external?: { url: string };
  }>
): string {
  if (files.length === 0) return ""; // 기본 이미지
  const file = files[0];
  if (file.type === "file" && file.file) {
    return file.file.url;
  }
  if (file.type === "external" && file.external) {
    return file.external.url;
  }
  return "";
}

export async function getNoticeData(locale: Locale = "kr"): Promise<NoticeItem[]> {
  try {
    const databaseId = getDatabaseId("NOTION_NOTICE_DATABASE_ID", locale);

    if (!databaseId) {
      console.error("NOTION_NOTICE_DATABASE_ID is not set");
      return [];
    }

    const pages = await queryDatabaseWithPagination(databaseId, [
      { property: "날짜", direction: "descending" },
    ]);

    return pages.map((page) => {
      const properties = page.properties;

      const title =
        properties["타이틀"]?.type === "title"
          ? getPlainText(properties["타이틀"].title)
          : "";

      const date =
        properties["날짜"]?.type === "date"
          ? formatDate(properties["날짜"].date)
          : "";

      const category =
        properties["태그"]?.type === "rich_text"
          ? getPlainText(properties["태그"].rich_text)
          : "";

      const image =
        properties["파일과 미디어"]?.type === "files"
          ? getFileUrl(properties["파일과 미디어"].files as Array<{
              type: string;
              file?: { url: string };
              external?: { url: string };
            }>)
          : "";

      return {
        id: page.id,
        title,
        date,
        category,
        image,
      };
    });
  } catch (error) {
    console.error("Failed to fetch notice data:", error);
    return [];
  }
}

export async function getNoticeById(id: string): Promise<NoticeDetail | null> {
  try {
    const page = (await notion.pages.retrieve({
      page_id: id,
    })) as PageObjectResponse;

    const properties = page.properties;

    const title =
      properties["타이틀"]?.type === "title"
        ? getPlainText(properties["타이틀"].title)
        : "";

    const date =
      properties["날짜"]?.type === "date"
        ? formatDate(properties["날짜"].date)
        : "";

    const category =
      properties["태그"]?.type === "rich_text"
        ? getPlainText(properties["태그"].rich_text)
        : "";

    const image =
      properties["파일과 미디어"]?.type === "files"
        ? getFileUrl(
            properties["파일과 미디어"].files as Array<{
              type: string;
              file?: { url: string };
              external?: { url: string };
            }>
          )
        : "";

    // 페이지 블록 내용 가져오기
    const blocksResponse = await notion.blocks.children.list({
      block_id: id,
    });

    const blocks = blocksResponse.results.filter(
      (block): block is BlockObjectResponse => "type" in block
    );

    const content = blocks
      .map((block) => {
        const blockType = block.type;
        const blockData = block[blockType as keyof typeof block];
        if (
          blockData &&
          typeof blockData === "object" &&
          "rich_text" in blockData
        ) {
          return getPlainText(
            blockData.rich_text as RichTextItemResponse[]
          );
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");

    return {
      id: page.id,
      title,
      date,
      category,
      image,
      content,
      blocks,
    };
  } catch {
    return null;
  }
}

export async function getAllNoticeIds(locale: Locale = "kr"): Promise<string[]> {
  const databaseId = getDatabaseId("NOTION_NOTICE_DATABASE_ID", locale);

  if (!databaseId) {
    throw new Error("NOTION_NOTICE_DATABASE_ID is not set");
  }

  const pages = await queryDatabaseWithPagination(databaseId);

  return pages.map((page) => page.id);
}

// YouTube 관련
export interface YoutubeItem {
  id: string;
  videoId: string;
  title: string;
  date: string;
}

export async function getYoutubeData(locale: Locale = "kr"): Promise<YoutubeItem[]> {
  try {
    const databaseId = getDatabaseId("NOTION_YOUTUBE_DATABASE_ID", locale);

    if (!databaseId) {
      console.error("NOTION_YOUTUBE_DATABASE_ID is not set");
      return [];
    }

    const pages = await queryDatabaseWithPagination(databaseId, [
      { property: "날짜", direction: "descending" },
    ]);

    return pages.map((page) => {
      const properties = page.properties;

      const title =
        properties["제목"]?.type === "title"
          ? getPlainText(properties["제목"].title)
          : "";

      const date =
        properties["날짜"]?.type === "date"
          ? formatDate(properties["날짜"].date)
          : "";

      const videoId =
        properties["유튜브 동영상 고유 id"]?.type === "rich_text"
          ? getPlainText(properties["유튜브 동영상 고유 id"].rich_text)
          : "";

      return {
        id: page.id,
        videoId,
        title,
        date,
      };
    });
  } catch (error) {
    console.error("Failed to fetch youtube data:", error);
    return [];
  }
}

// FAQ 관련
export interface FaqItem {
  id: string;
  title: string;
  content: string;
}

export async function getFaqData(locale: Locale = "kr"): Promise<FaqItem[]> {
  try {
    const databaseId = getDatabaseId("NOTION_FAQ_DATABASE_ID", locale);

    if (!databaseId) {
      console.error("NOTION_FAQ_DATABASE_ID is not set");
      return [];
    }

    const pages = await queryDatabaseWithPagination(databaseId);

    return pages.map((page) => {
      const properties = page.properties;

      const id =
        properties["아이디(아무거나 쓰세요)"]?.type === "title"
          ? getPlainText(properties["아이디(아무거나 쓰세요)"].title)
          : page.id;

      const title =
        properties["제목"]?.type === "rich_text"
          ? getPlainText(properties["제목"].rich_text)
          : "";

      const content =
        properties["내용"]?.type === "rich_text"
          ? getPlainText(properties["내용"].rich_text)
          : "";

      return {
        id,
        title,
        content,
      };
    });
  } catch (error) {
    console.error("Failed to fetch faq data:", error);
    return [];
  }
}

// Site 관련
export interface SiteItem {
  id: string;
  title: string;
  href: string;
  imageSrc: string;
}

export async function getSiteData(locale: Locale = "kr"): Promise<SiteItem[]> {
  try {
    const databaseId = getDatabaseId("NOTION_SITE_DATABASE_ID", locale);

    if (!databaseId) {
      console.error("NOTION_SITE_DATABASE_ID is not set");
      return [];
    }

    const pages = await queryDatabaseWithPagination(databaseId);

    return pages.map((page) => {
      const properties = page.properties;

      const title =
        properties["사이트명"]?.type === "title"
          ? getPlainText(properties["사이트명"].title)
          : "";

      const href =
        properties["URL"]?.type === "url"
          ? properties["URL"].url || "/"
          : "/";

      const imageSrc =
        properties["파일과 미디어"]?.type === "files"
          ? getFileUrl(
              properties["파일과 미디어"].files as Array<{
                type: string;
                file?: { url: string };
                external?: { url: string };
              }>
            )
          : "";

      return {
        id: page.id,
        title,
        href,
        imageSrc,
      };
    });
  } catch (error) {
    console.error("Failed to fetch site data:", error);
    return [];
  }
}
