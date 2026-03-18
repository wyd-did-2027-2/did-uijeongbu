"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { Section, SectionTitle, BackDrop } from "../ui/common-layout";
import type { SiteItem } from "@/lib/notion";
import { content, type Locale } from "@/lib/content";

import "swiper/css";
import "swiper/css/navigation";

interface SiteCardProps {
  title: string;
  href: string;
  imageSrc: string;
}

function SiteCard({ title, href, imageSrc }: SiteCardProps) {
  return (
    <div className="relative bg-black hover:[className="relative bg-black hover:[&_span]:bg-black"_span]:bg-black size-full">
      <Link className="block size-full" href={href} target="_blank">
        {imageSrc && (
          <Image
            width={390}
            height={293}
            alt="이미지"
            src={imageSrc}
            className="w-full h-full object-center object-cover aspect-square"
          />
        )}
        <div className="flex justify-between absolute pb-3.5 px-4 w-full items-center bottom-0">
          <h3 className="heading03B text-white">{title}</h3>
          <span className="size-12 rounded-full flex items-center justify-center backdrop-blur-[5px] shadow-[inset_-1px_-1px_0px_rgba(255,255,255,0.5)] transition-colors">
            <Plus className="size-8 text-white" />
          </span>
        </div>
      </Link>
    </div>
  );
}

interface SiteSectionProps {
  items: SiteItem[];
  locale?: Locale;
}

export default function SiteSection({ items, locale = "kr" }: SiteSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [progress, setProgress] = useState(0);
  const t = content[locale];

  return (
    <Section
      id="site"
      className="bg-no-repeat bg-center bg-cover relative bg-fixed min-h-auto"
      style={{ backgroundImage: "url('https://r2-image-server.masterforce999.workers.dev/section-main03.jpeg')" }}
    >
      <div className="flex justify-between items-center mb-8 relative z-20">
        <SectionTitle className="text-white mb-0">{t.sections.site}</SectionTitle>

        {items.length > 1 && (
          <div className="items-center gap-4 max-[1080px]:flex hidden">
            <div className="w-40 h-0.5 bg-white/30 hidden sm:block relative">
              <div
                className="absolute left-0 top-0 h-full bg-white transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="size-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                aria-label={t.common.prev}
              >
                <ChevronLeft className="size-5 text-white" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="size-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                aria-label={t.common.next}
              >
                <ChevronRight className="size-5 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ul
        className="w-full gap-10 relative z-20 h-auto hidden min-[1081px]:grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(283px, 100%), 370px))",
        }}
      >
        {items.map((site) => (
          <li key={site.id}>
            <SiteCard
              title={site.title}
              href={site.href}
              imageSrc={site.imageSrc}
            />
          </li>
        ))}
      </ul>

      <div className="relative z-20 min-[1081px]:hidden">
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
          className="[&_.swiper-slide]:h-auto!"
        >
          {items.map((site) => (
            <SwiperSlide key={site.id}>
              <div>
                <SiteCard
                  title={site.title}
                  href={site.href}
                  imageSrc={site.imageSrc}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <BackDrop className="backdrop-brightness-100 blur-xs" />
    </Section>
  );
}
