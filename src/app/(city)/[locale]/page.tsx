import { notFound } from "next/navigation";

import JsonLd from "@/components/json-ld";

import SliderSection from "@/components/pages/slide-section";
import CalendarSection from "@/components/pages/calendar-section";
import NoticeSection from "@/components/pages/notice-section";
import YoutubeSection from "@/components/pages/youtube-section";
import SiteSection from "@/components/pages/site-section";
import FaqSection from "@/components/pages/faq-section";
import { locales, isLocale } from "@/lib/content";
import { createWebSiteJsonLd } from "@/lib/structured-data";
import {
  getCalendarData,
  getNoticeData,
  getYoutubeData,
  getFaqData,
  getSiteData,
} from "@/lib/notion";

export const revalidate = 3600;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const [calendarItems, noticeItems, youtubeItems, faqItems, siteItems] =
    await Promise.all([
      getCalendarData(locale),
      getNoticeData(locale),
      getYoutubeData(locale),
      getFaqData(locale),
      getSiteData(locale),
    ]);

  return (
    <>
      <JsonLd data={createWebSiteJsonLd(locale)} />
      <SliderSection locale={locale} />
      <CalendarSection items={calendarItems} locale={locale} />
      <NoticeSection items={noticeItems} locale={locale} />
      <YoutubeSection items={youtubeItems} locale={locale} />
      <SiteSection items={siteItems} locale={locale} />
      <FaqSection items={faqItems} locale={locale} />
    </>
  );
}
