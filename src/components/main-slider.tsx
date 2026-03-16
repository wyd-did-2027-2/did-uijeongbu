"use client";

import {
  useState,
  useRef,
  useEffect,
  ComponentProps,
  useCallback,
} from "react";

import Flicking, { EVENTS } from "@egjs/flicking";

import { AutoPlay, Pagination } from "@egjs/flicking-plugins";

import { cn } from "@/lib/utils";
import { content, type Locale } from "@/lib/content";

import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";

import "@egjs/flicking/dist/flicking.css";
import "@egjs/flicking-plugins/dist/pagination.css";

import SliderItem00 from "./slider-item/slider-item00";
import SliderItem01 from "./slider-item/slider-item01";
import SliderItem04 from "./slider-item/slider-item04";

export default function MainSlider({ locale = "kr" }: { locale?: Locale }) {
  const t = content[locale].slider;
  const flickingRef = useRef<HTMLDivElement>(null);
  const flickingInstanceRef = useRef<Flicking | null>(null);
  const autoPlayInstanceRef = useRef<AutoPlay | null>(null);

  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [panelCount, setPanelCount] = useState(0);

  useEffect(() => {
    if (flickingRef.current) {
      const flickingInstance = new Flicking(flickingRef.current, {
        align: "center",
        circular: true,
        renderOnlyVisible: true,
        panelsPerView: 1,
        autoResize: true,
        useResizeObserver: true,
        preventDefaultOnDrag: true,
        useFractionalSize: true,
        moveType: ["strict", { count: 1 }],
        autoInit: true,
      });

      const autoplayInstance = new AutoPlay({
        duration: 20000,
      });

      flickingInstanceRef.current = flickingInstance;
      autoPlayInstanceRef.current = autoplayInstance;

      flickingInstance.on("moveStart", () => setIsAnimating(true));
      flickingInstance.on("moveEnd", () => setIsAnimating(false));
      flickingInstance.on("changed", (e) => setCurrentIndex(e.index));

      flickingInstance.once(EVENTS.READY, () => {
        flickingInstance.element.classList.remove("flicking-hidden");

        const count = flickingInstance.panelCount;
        setPanelCount(count);

        if (count > 1) {
          const paginationInstance = new Pagination({
            type: "fraction",
            renderFraction: (currentClass, totalClass) => {
              return `<span class="${currentClass} heading01B text-white"></span> <span class="heading03r text-gray-100"> / </span> <span class="${totalClass} heading03r text-gray-100"></span>`;
            },
            fractionCurrentFormat: (index) => {
              return `0${index.toString()}`;
            },
            fractionTotalFormat: (index) => {
              return `0${index.toString()}`;
            },
          });
          flickingInstance.addPlugins(autoplayInstance, paginationInstance);
        } else {
          flickingInstance.addPlugins(autoplayInstance);
        }
      });

      flickingInstance.resize();

      return () => {
        flickingInstance.destroy();
      };
    }
  }, []);

  const handleNextSlide = useCallback(() => {
    if (!isAnimating && flickingInstanceRef.current) {
      flickingInstanceRef.current.next();

      if (autoPlayInstanceRef.current) {
        autoPlayInstanceRef.current.stop();
      }
    }
  }, [isAnimating]);

  const handlePrevSlide = useCallback(() => {
    if (!isAnimating && flickingInstanceRef.current) {
      flickingInstanceRef.current.prev();
    }
  }, [isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;

      if (e.key === "ArrowLeft") {
        handlePrevSlide();
      } else if (e.key === "ArrowRight") {
        handleNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnimating, handleNextSlide, handlePrevSlide]);

  const handleAutoPlay = () => {
    setIsAutoPlay((prev) => {
      const newValue = !prev;
      if (autoPlayInstanceRef.current) {
        if (newValue) {
          autoPlayInstanceRef.current.play();
        } else {
          autoPlayInstanceRef.current.stop();
        }
      }
      return newValue;
    });
  };

  return (
    <div
      ref={flickingRef}
      className="flicking-viewport relative h-full w-screen flicking-hidden"
    >
      <div className="flicking-camera">
        <Panel>
          <SliderItem00 />
        </Panel>
        {/* <Panel>
          <SliderItem03 />
        </Panel>
        <Panel>
          <SliderItem02 />
        </Panel> */}
        <Panel>
          <SliderItem01 />
        </Panel>
        <Panel>
          <SliderItem04 />
        </Panel>
      </div>
      {panelCount > 1 && <div
        className={cn(
          "item-inside-viewport absolute z-20 flex w-68 justify-between right-auto left-8 translate-x-0",
          "max-[727px]:bottom-[2dvh] max-[727px]:left-1/2 max-[727px]:-translate-x-1/2 max-[1080px]:bottom-[13.5dvw] max-[1080px]:left-1/2 max-[1080px]:-translate-x-1/2 bottom-[8dvw]",
        )}
      >
        <button
          type="button"
          disabled={isAnimating}
          title={isAutoPlay ? t.pause : t.play}
          className="mr-4 max-[727px]:hidden max-[1080px]:hidden flex w-15 justify-center items-center cursor-pointer"
          onClick={handleAutoPlay}
        >
          {isAutoPlay ? (
            <Pause
              width={40}
              height={40}
              fill={[0, 2].includes(currentIndex) ? "#000" : "#fff"}
              stroke={[0, 2].includes(currentIndex) ? "#000" : "#fff"}
              strokeWidth={1}
            />
          ) : (
            <Play
              width={40}
              height={40}
              fill={[0, 2].includes(currentIndex) ? "#000" : "#fff"}
              stroke={[0, 2].includes(currentIndex) ? "#000" : "#fff"}
              strokeWidth={1}
            />
          )}
        </button>
        <button
          type="button"
          title={t.prev}
          disabled={isAnimating}
          className="cursor-pointer"
          onClick={handlePrevSlide}
        >
          <ChevronLeft
            width={48}
            height={48}
            stroke={[0, 2].includes(currentIndex) ? "#000" : "#fff"}
          />
        </button>
        <div
          className={cn(
            "flicking-pagination relative! bottom-0! w-30!",
            [0, 2].includes(currentIndex) && "[&_span]:text-black!",
          )}
        />
        <button
          type="button"
          title={t.next}
          disabled={isAnimating}
          className="cursor-pointer"
          onClick={handleNextSlide}
        >
          <ChevronRight
            width={48}
            height={48}
            stroke={[0, 2].includes(currentIndex) ? "#000" : "#fff"}
          />
        </button>
      </div>}
    </div>
  );
}

function Panel({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("panel", className)} {...props}>
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
