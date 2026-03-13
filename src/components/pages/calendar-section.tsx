"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Section, SectionTitle } from "../ui/common-layout";
import type { CalendarItem } from "@/lib/notion";
import { content, type Locale } from "@/lib/content";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

interface CalendarCardProps {
  date: string;
  title: string;
  description?: string;
}

function CalendarCard({ date, title, description }: CalendarCardProps) {
  return (
    <div className="group h-full border-l-2 border-gray-200 hover:border-gray-900 px-4 py-10 transition-all">
      <div className="group-hover:-translate-y-2 transition-transform">
        <span className="inline-block bg-primary text-white body03M px-3 py-1 rounded-full mb-4">
          {date}
        </span>
        <h3 className="heading04B text-gray-900 line-clamp-2">{title}</h3>
        {description && (
          <p className="body02M text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

interface CalendarSectionProps {
  items: CalendarItem[];
  locale?: Locale;
}

export default function CalendarSection({ items, locale = "kr" }: CalendarSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [progress, setProgress] = useState(0);
  const t = content[locale];

  return (
    <Section id="calendar" className="min-h-auto bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <SectionTitle className="mb-0">{t.sections.calendar}</SectionTitle>
        <div className="flex items-center gap-4">
          <div className="w-60 h-0.5 bg-gray-300 hidden sm:block relative">
            <div
              className="absolute left-0 top-0 h-full bg-gray-900 transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="size-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label={t.common.prev}
            >
              <ChevronLeft className="size-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="size-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label={t.common.next}
            >
              <ChevronRight className="size-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Scrollbar]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onProgress={(_, prog) => {
          setProgress(prog);
        }}
        spaceBetween={0}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="[&_.swiper-slide]:h-auto!"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <CalendarCard
              date={item.date}
              title={item.title}
              description={item.description}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
}
