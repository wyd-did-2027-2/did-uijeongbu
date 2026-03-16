import Image from "next/image";
import { Modal } from "@/components/modal";
import { Tag } from "@/components/ui/tag";
import { getNoticeById } from "@/lib/notion";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/content";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function NoticeModal({ params }: PageProps) {
  const { id, locale } = await params;
  if (!isLocale(locale)) notFound();

  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  return (
    <Modal>
      {notice.image && (
        <div className="relative w-full aspect-video">
          <Image
            src={notice.image}
            alt={notice.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Tag shape="capsule">{notice.category}</Tag>
          <span className="body03R text-muted-foreground">{notice.date}</span>
        </div>
        <h2 className="heading03B text-foreground mb-4">{notice.title}</h2>
        <p className="body01R text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {notice.content}
        </p>
      </div>
    </Modal>
  );
}
