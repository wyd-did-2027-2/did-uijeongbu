"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { content, type Locale } from "@/lib/content";

export default function BackToTop({ locale = "kr" }: { locale?: Locale }) {
  const [isVisible, setIsVisible] = useState(false);
  const t = content[locale].common;

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 size-14 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-100 cursor-pointer ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label={t.backToTop}
    >
      <ArrowUp className="size-6 text-gray-900" />
    </button>
  );
}
