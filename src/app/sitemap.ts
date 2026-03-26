import type { MetadataRoute } from "next";
import { locales, siteConfig } from "@/lib/content";
import { getAllNoticeIds } from "@/lib/notion";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 기본 페이지들
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ]);

  // 공지사항 페이지들
  const noticePages = await Promise.all(
    locales.map(async (locale) => {
      try {
        const noticeIds = await getAllNoticeIds(locale);
        return noticeIds.map((id) => ({
          url: `${baseUrl}/${locale}/notice/${id}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      } catch {
        return [];
      }
    })
  );

  return [...staticPages, ...noticePages.flat()];
}
