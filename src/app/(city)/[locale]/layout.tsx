import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SmoothScrolling from "@/components/smooth-scroll";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import BackToTop from "@/components/ui/back-to-top";
import { content, locales, isLocale, siteConfig } from "@/lib/content";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = content[locale].metadata;

  return {
    title: t.title,
    description: t.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "ko-KR": "/kr",
        "en-US": "/en",
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      locale: t.ogLocale,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: t.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <SmoothScrolling>
        <Header locale={locale} />
        <main className="pt-20">{children}</main>
        <Footer locale={locale} />
        <BackToTop locale={locale} />
      </SmoothScrolling>
      {modal}
      <div id="modal-root" />
    </>
  );
}
