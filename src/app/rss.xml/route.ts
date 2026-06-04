import { content, locales, siteConfig, type Locale } from "@/lib/content";
import { getNoticeById, getNoticeData } from "@/lib/notion";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRssDate(date: string) {
  const match = date.match(/^(\d{2})\.(\d{2})\.(\d{2})/);
  if (!match) return new Date().toUTCString();

  const [, yy, mm, dd] = match;
  return new Date(
    Date.UTC(2000 + Number(yy), Number(mm) - 1, Number(dd))
  ).toUTCString();
}

function fallbackDescription(locale: Locale, title: string) {
  return locale === "kr"
    ? content[locale].metadata.title + " 공지사항: " + title
    : content[locale].metadata.title + " notice: " + title;
}

export async function GET() {
  const noticeGroups = await Promise.all(
    locales.map(async (locale) => {
      const notices = await getNoticeData(locale);
      const details = await Promise.all(
        notices.slice(0, 30).map(async (notice) => ({
          notice,
          detail: await getNoticeById(notice.id),
        }))
      );

      return details.map(({ notice, detail }) => {
        const url = siteConfig.url + "/" + locale + "/notice/" + notice.id;
        const title = notice.title || detail?.title || content[locale].metadata.title;
        const description =
          detail?.content?.trim() || fallbackDescription(locale, title);

        return [
          '    <item>',
          '      <title>' + escapeXml(title) + '</title>',
          '      <link>' + escapeXml(url) + '</link>',
          '      <guid isPermaLink="true">' + escapeXml(url) + '</guid>',
          '      <description>' + escapeXml(description) + '</description>',
          '      <category>' + escapeXml(notice.category || "Notice") + '</category>',
          '      <pubDate>' + toRssDate(notice.date) + '</pubDate>',
          '    </item>',
        ].join("\n");
      });
    })
  );

  const items = noticeGroups.flat().join("\n");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>' + escapeXml(siteConfig.name) + '</title>',
    '    <link>' + escapeXml(siteConfig.url) + '</link>',
    '    <description>' + escapeXml(content.kr.metadata.description) + '</description>',
    '    <language>ko</language>',
    '    <lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>',
    items,
    '  </channel>',
    '</rss>',
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
