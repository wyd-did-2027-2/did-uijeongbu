import MainSlider from "../main-slider";
import type { Locale } from "@/lib/content";

export default function SliderSection({ locale = "kr" }: { locale?: Locale }) {
  return (
    <section
      id="home"
      className="w-full aspect-video max-[1080px]:aspect-square max-h-[calc(100vh-100px)]"
    >
      <MainSlider locale={locale} />
    </section>
  );
}
