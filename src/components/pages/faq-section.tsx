import { Section, SectionTitle } from "../ui/common-layout";
import Faq from "../faq";
import type { FaqItem } from "@/lib/notion";
import { content, type Locale } from "@/lib/content";

interface FaqSectionProps {
  items: FaqItem[];
  locale?: Locale;
}

export default function FaqSection({ items, locale = "kr" }: FaqSectionProps) {
  const t = content[locale];

  return (
    <Section id="faq" className="bg-gray-100 min-h-auto">
      <SectionTitle>{t.sections.faq}</SectionTitle>
      <Faq items={items} />
    </Section>
  );
}
