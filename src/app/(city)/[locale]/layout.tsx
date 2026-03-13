import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SmoothScrolling from "@/components/smooth-scroll";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import BackToTop from "@/components/ui/back-to-top";
import { content, locales, isLocale } from "@/lib/content";

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
    openGraph: {
      title: t.title,
      description: t.description,
      locale: t.ogLocale,
      type: "website",
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
