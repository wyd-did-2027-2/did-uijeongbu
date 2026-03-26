import { Modal } from "@/components/modal";
import { Tag } from "@/components/ui/tag";
import { NotionBlocks } from "@/components/ui/notion-blocks";
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

  const header = (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Tag shape="capsule">{notice.category}</Tag>
        <span className="body03R text-muted-foreground">{notice.date}</span>
      </div>
      <h2 className="heading03B text-foreground">{notice.title}</h2>
    </div>
  );

  return (
    <Modal header={header}>
      <div className="prose prose-gray max-w-none">
        <NotionBlocks blocks={notice.blocks} />
      </div>
    </Modal>
  );
}
