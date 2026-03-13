import MainSlider from "../main-slider";
import type { Locale } from "@/lib/content";

export default function SliderSection({ locale = "kr" }: { locale?: Locale }) {
  return (
    <section id="home" className="w-full h-[calc(100vh-160px)]">
      <MainSlider locale={locale} />
    </section>
  );
}
