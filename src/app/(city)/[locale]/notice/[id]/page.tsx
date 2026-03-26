import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import { NotionBlocks } from "@/components/ui/notion-blocks";
import { getNoticeById, getAllNoticeIds } from "@/lib/notion";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/content";
import { content } from "@/lib/content";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateStaticParams() {
  const [krIds, enIds] = await Promise.all([
    getAllNoticeIds("kr"),
    getAllNoticeIds("en"),
  ]);
  const allIds = [...new Set([...krIds, ...enIds])];
  return ["kr", "en"].flatMap((locale) =>
    allIds.map((id) => ({ locale, id })),
  );
}

export default async function NoticePage({ params }: PageProps) {
  const { id, locale: localeStr } = await params;
  if (!isLocale(localeStr)) notFound();
  const locale = localeStr;

  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  const t = content[locale];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 body02M text-muted-foreground hover:text-foreground mb-8"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t.notice.backLink}
        </Link>

        <article className="bg-card rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Tag shape="capsule">{notice.category}</Tag>
              <span className="body03R text-muted-foreground">
                {notice.date}
              </span>
            </div>
            <h1 className="heading03B text-foreground mb-4">{notice.title}</h1>
            <div className="prose prose-gray max-w-none">
              <NotionBlocks blocks={notice.blocks} />
            </div>
          </div>
        </article>

        <div className="mt-8 flex justify-center">
          <Link
            href={`/${locale}#notice`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg body02M hover:bg-primary/90 transition-colors"
          >
            {t.notice.backLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
