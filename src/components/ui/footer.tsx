import Link from "next/link";
import Image from "next/image";
import { content, type Locale } from "@/lib/content";

export default function Footer({ locale = "kr" }: { locale?: Locale }) {
  const t = content[locale].footer;

  return (
    <footer className="w-dvw flex h-74 justify-between bg-white px-16 py-7.5 text-black max-[1079px]:flex-wrap max-[1079px]:h-auto max-[1079px]:gap-y-1 max-[1079px]:px-8 max-[1079px]:py-12 max-sm:px-4">
      <div className="flex flex-col">
        <h3 className="mb-6">
          <Link href={`/${locale}`} className="flex items-center gap-x-1">
            <Image
              src="/logo.svg"
              width={200}
              height={90}
              alt={t.logoAlt}
              className="h-full"
              priority
            />
          </Link>
        </h3>
        <address className="not-italic">
          <h4 className="heading04B mb-1">Contact</h4>
          <ul className="flex flex-col gap-y-2 body02R">
            <li>{t.address}</li>
            <li>{t.email}</li>
          </ul>
        </address>
      </div>
      <div>
        <h3 className="heading03B max-[1079px]:mb-1">{t.phone}</h3>
        <p className="body02R">{t.hours}</p>
        <p className="body02R">{t.copyright}</p>
      </div>
    </footer>
  );
}
