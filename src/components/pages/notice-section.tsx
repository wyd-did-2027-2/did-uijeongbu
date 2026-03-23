"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section, SectionTitle } from "../ui/common-layout";
import { Tag } from "../ui/tag";
import type { NoticeItem } from "@/lib/notion";
import { content, type Locale } from "@/lib/content";

const ITEMS_PER_PAGE = 5;

function HoverCard({
  notice,
  isVisible,
}: {
  notice: NoticeItem | null;
  isVisible: boolean;
}) {
  return (
    <div
      className={`hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 z-50 ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8 pointer-events-none"
      }`}
    >
      {notice && (
        <>
          {notice.image && (
            <div className="relative w-full aspect-4/3">
              <Image
                src={notice.image}
                alt={notice.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Tag shape="capsule">{notice.category}</Tag>
              <span className="body03R text-muted-foreground">
                {notice.date}
              </span>
            </div>
            <h3 className="text-foreground body01B">{notice.title}</h3>
          </div>
        </>
      )}
    </div>
  );
}

interface NoticeSectionProps {
  items: NoticeItem[];
  locale?: Locale;
}

export default function NoticeSection({ items, locale = "kr" }: NoticeSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const t = content[locale];

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hoveredNotice =
    hoveredIndex !== null ? currentItems[hoveredIndex] : null;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setHoveredIndex(null);
  };

  return (
    <Section id="notice" className="bg-white min-h-auto">
      <SectionTitle>{t.sections.notice}</SectionTitle>

      <div className="h-px bg-border" />

      <div className="relative">
        <div className="divide-y divide-border">
          {currentItems.map((notice, index) => (
            <Link
              key={notice.id}
              href={`/${locale}/notice/${notice.id}`}
              scroll={false}
              className="flex items-center justify-between py-8 text-black group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="heading04B hover:underline underline-offset-4 max-w-3/4">
                {notice.title}
              </span>
              <span className="body02R text-gray-600 max-md:body03R">
                {notice.date}
              </span>
            </Link>
          ))}
        </div>

        <HoverCard notice={hoveredNotice} isVisible={hoveredIndex !== null} />
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="size-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label={t.common.prevPage}
          >
            <ChevronLeft className="size-5 text-gray-600" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={`size-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-black text-white"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="size-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label={t.common.nextPage}
          >
            <ChevronRight className="size-5 text-gray-600" />
          </button>
        </div>
      )}
    </Section>
  );
}
