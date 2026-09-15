import { Paperclip, ExternalLink } from "lucide-react";
import { content, type Locale } from "@/lib/content";
import type { NoticeDetail } from "@/lib/notion";

export function NoticeAttachments({ attachments, locale }: {
  attachments: NoticeDetail["attachments"];
  locale: Locale;
}) {
  if (attachments.length === 0) return null;
  const t = content[locale].notice;
  return (
    <section className="mt-6 border-t border-gray-200 pt-5" aria-label={t.attachments}>
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{t.attachments}</h3>
      <ul className="space-y-2">
        {attachments.map((file, index) => (
          <li key={`${file.name}-${index}`}>
            <a href={file.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2">
              <Paperclip className="size-5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 break-all">{file.name}</span>
              <span className="shrink-0">{t.openFile}</span>
              <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
