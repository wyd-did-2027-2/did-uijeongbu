"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { content, type Locale } from "@/lib/content";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Header({ locale = "kr" }: { locale?: Locale }) {
  const { push } = useRouter();
  const t = content[locale].header;
  const [value, setValue] = useState<string>(locale);

  const handleLanguageChange = (lang: string) => {
    setValue(lang);
    push(`/${lang}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white flex items-center justify-between z-50 px-16 max-md:px-8 mx-sm:px-4 shadow-sm gap-x-4">
      <h1>
        <Link href={`/${locale}`} className="flex items-center gap-x-1">
          <Image
            src="/logo.svg"
            width={120}
            height={60}
            alt={t.logoAlt}
            priority
          />
        </Link>
      </h1>
      <div className="flex items-center gap-x-4">
        <nav className="hidden lg:flex">
          <ul className="flex items-center gap-8 body01M text-gray-800">
            <li>
              <Link href="#home">{t.nav.home}</Link>
            </li>
            <li>
              <Link href="#calendar">{t.nav.calendar}</Link>
            </li>
            <li>
              <Link href="#youtube">{t.nav.youtube}</Link>
            </li>
            <li>
              <Link href="#notice">{t.nav.notice}</Link>
            </li>
            <li>
              <Link href="#site">{t.nav.site}</Link>
            </li>
            <li>
              <Link href="#faq">{t.nav.faq}</Link>
            </li>
          </ul>
        </nav>
        <Select value={value} onValueChange={handleLanguageChange}>
          <SelectTrigger className="h-10 gap-1.5 rounded-full border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700 shadow-none hover:bg-gray-100 transition-colors [&_svg]:size-3.5 [&_svg]:text-gray-500">
            <Globe className="size-4 text-gray-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="min-w-[7rem] rounded-xl border-gray-200 shadow-lg">
            <SelectItem value="kr" className="rounded-lg font-medium">한국어</SelectItem>
            <SelectItem value="en" className="rounded-lg font-medium">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
