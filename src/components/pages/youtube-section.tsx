"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Section, SectionTitle } from "../ui/common-layout";
import VideoCard from "@/components/ui/video-card";
import type { YoutubeItem } from "@/lib/notion";
import { content, type Locale } from "@/lib/content";

import "swiper/css";
import "swiper/css/navigation";

interface YoutubeSectionProps {
  items: YoutubeItem[];
  locale?: Locale;
}

export default function YoutubeSection({ items, locale = "kr" }: YoutubeSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [progress, setProgress] = useState(0);
  const t = content[locale];

  return (
    <Section
      id="youtube"
      className="bg-no-repeat bg-fixed bg-cover min-h-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <SectionTitle className="mb-0">{t.sections.youtube}</SectionTitle>
        <div className="flex items-center gap-4">
          <div className="w-60 h-0.5 bg-gray-300 hidden sm:block relative">
            <div
              className="absolute left-0 top-0 h-full bg-black transition-all duration-300"
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
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="size-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label={t.common.next}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onProgress={(_, prog) => {
          setProgress(prog);
        }}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          1280: { slidesPerView: 3 },
        }}
        className="[&_.swiper-slide]:h-auto!"
      >
        {items.map((video) => (
          <SwiperSlide key={video.id}>
            <VideoCard
              videoId={video.videoId}
              title={video.title}
              date={video.date}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
}
