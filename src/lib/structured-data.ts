import { content, siteConfig, type Locale } from "./content";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function createWebSiteJsonLd(locale: Locale) {
  const t = content[locale].metadata;
  const language = content[locale].lang;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": siteConfig.url + "/#website",
        url: siteConfig.url,
        name: t.title,
        description: t.description,
        inLanguage: language,
      },
      {
        "@type": "Organization",
        "@id": siteConfig.url + "/#organization",
        name: t.title,
        url: siteConfig.url,
        logo: absoluteUrl(siteConfig.ogImage),
      },
    ],
  };
}

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": item.url,
        name: item.name,
      },
    })),
  };
}
