"use client";

import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import Link from "next/link";

const NOTION_COLOR_MAP: Record<string, string> = {
  gray: "text-gray-500",
  brown: "text-amber-700",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  green: "text-green-600",
  blue: "text-blue-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  red: "text-red-500",
  gray_background: "bg-gray-100",
  brown_background: "bg-amber-50",
  orange_background: "bg-orange-50",
  yellow_background: "bg-yellow-50",
  green_background: "bg-green-50",
  blue_background: "bg-blue-50",
  purple_background: "bg-purple-50",
  pink_background: "bg-pink-50",
  red_background: "bg-red-50",
};

export function NotionBlocks({ blocks }: { blocks: BlockObjectResponse[] }) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: BlockObjectResponse[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }
      elements.push(
        <ul
          key={items[0].id}
          className="my-[2px] list-disc pl-[1.7em] marker:text-[rgb(55,53,47)]"
        >
          {items.map((item) => (
            <NotionBlock key={item.id} block={item} />
          ))}
        </ul>,
      );
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: BlockObjectResponse[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i]);
        i++;
      }
      elements.push(
        <ol
          key={items[0].id}
          className="my-[2px] list-decimal pl-[1.7em] marker:text-[rgb(55,53,47)]"
        >
          {items.map((item) => (
            <NotionBlock key={item.id} block={item} />
          ))}
        </ol>,
      );
      continue;
    }

    elements.push(<NotionBlock key={block.id} block={block} />);
    i++;
  }

  return (
    <div className="mx-auto w-full text-[16px] leading-[1.65] text-[rgb(55,53,47)]">
      {elements}
    </div>
  );
}

function NotionBlock({ block }: { block: BlockObjectResponse }) {
  switch (block.type) {
    case "paragraph": {
      const isEmpty = block.paragraph.rich_text.length === 0;
      return (
        <p
          className={`px-[2px] py-[3px] leading-[1.65] ${isEmpty ? "min-h-[1.65em]" : ""}`}
        >
          {renderRichText(block.paragraph.rich_text)}
        </p>
      );
    }

    case "heading_1":
      return (
        <h2 className="mt-[2em] mb-[4px] text-[1.875em] leading-[1.3] font-bold text-[rgb(55,53,47)]">
          {renderRichText(block.heading_1.rich_text)}
        </h2>
      );

    case "heading_2":
      return (
        <h3 className="mt-[1.4em] mb-[1px] text-[1.5em] leading-[1.3] font-semibold text-[rgb(55,53,47)]">
          {renderRichText(block.heading_2.rich_text)}
        </h3>
      );

    case "heading_3":
      return (
        <h4 className="mt-[1em] mb-[1px] text-[1.25em] leading-[1.3] font-semibold text-[rgb(55,53,47)]">
          {renderRichText(block.heading_3.rich_text)}
        </h4>
      );

    case "bulleted_list_item":
      return (
        <li className="py-[1px] pl-[2px] leading-[1.65]">
          {renderRichText(block.bulleted_list_item.rich_text)}
        </li>
      );

    case "numbered_list_item":
      return (
        <li className="py-[1px] pl-[2px] leading-[1.65]">
          {renderRichText(block.numbered_list_item.rich_text)}
        </li>
      );

    case "quote":
      return (
        <blockquote className="my-[4px] border-l-[3px] border-current py-[3px] pl-[14px] leading-[1.65]">
          {renderRichText(block.quote.rich_text)}
        </blockquote>
      );

    case "to_do":
      return (
        <div className="flex items-start gap-[8px] py-[3px] leading-[1.65]">
          <div className="flex h-[1.65em] items-center">
            <input
              type="checkbox"
              checked={block.to_do.checked}
              readOnly
              className="h-[16px] w-[16px] shrink-0 cursor-default rounded-[3px] accent-blue-500"
            />
          </div>
          <span
            className={
              block.to_do.checked ? "text-[rgb(155,154,151)] line-through" : ""
            }
          >
            {renderRichText(block.to_do.rich_text)}
          </span>
        </div>
      );

    case "code":
      return (
        <div className="my-[4px]">
          {block.code.language && block.code.language !== "plain text" && (
            <div className="rounded-t-[4px] border border-b-0 border-[rgb(232,230,227)] bg-[rgb(247,246,243)] px-[16px] py-[6px] text-[12px] text-[rgb(120,119,116)]">
              {block.code.language}
            </div>
          )}
          <pre
            className={`overflow-x-auto border border-[rgb(232,230,227)] bg-[rgb(247,246,243)] p-[32px] text-[14px] leading-[1.6] ${
              block.code.language && block.code.language !== "plain text"
                ? "rounded-b-[4px]"
                : "rounded-[4px]"
            }`}
          >
            <code className="font-mono">
              {renderRichText(block.code.rich_text)}
            </code>
          </pre>
        </div>
      );

    case "callout": {
      const bgColor = block.callout.color?.includes("background")
        ? NOTION_COLOR_MAP[block.callout.color] || "bg-[rgb(241,241,239)]"
        : "bg-[rgb(241,241,239)]";
      return (
        <div
          className={`my-[4px] flex gap-[8px] rounded-[4px] p-[16px] leading-[1.65] ${bgColor}`}
        >
          {block.callout.icon?.type === "emoji" && (
            <span className="shrink-0 text-[1.2em] leading-[1.65]">
              {block.callout.icon.emoji}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {renderRichText(block.callout.rich_text)}
          </div>
        </div>
      );
    }

    case "divider":
      return (
        <div className="w-full py-[12px]">
          <hr className="border-[rgb(232,230,227)]" />
        </div>
      );

    case "image": {
      const captions = block.image.caption ?? [];
      const linkHref = captions.find((c) => c.href)?.href;
      const visibleCaptions = captions.filter((c) => !c.href);
      const alt = visibleCaptions.map((c) => c.plain_text).join("") || "";
      const img = <NotionImage src={getImageUrl(block.image)} alt={alt} />;

      return (
        <figure className="my-[8px]">
          {linkHref ? (
            linkHref.startsWith("/") ? (
              <Link href={linkHref}>{img}</Link>
            ) : (
              <a href={linkHref} target="_blank" rel="noopener noreferrer">
                {img}
              </a>
            )
          ) : (
            img
          )}
          {visibleCaptions.length > 0 && (
            <figcaption className="mt-[6px] w-full text-center text-[14px] leading-[1.4] text-[rgb(120,119,116)]">
              {renderRichText(visibleCaptions)}
            </figcaption>
          )}
        </figure>
      );
    }

    case "bookmark":
      return (
        <a
          href={block.bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-[4px] flex items-center overflow-hidden rounded-[4px] border border-[rgb(232,230,227)] text-[14px] text-[rgb(55,53,47)] no-underline transition-colors hover:bg-[rgb(247,246,243)]"
        >
          <span className="truncate px-[14px] py-[12px]">
            {block.bookmark.url}
          </span>
        </a>
      );

    case "toggle":
      return (
        <details className="py-[3px]">
          <summary className="cursor-pointer leading-[1.65]">
            {renderRichText(
              (
                block as unknown as {
                  toggle: { rich_text: RichTextItemResponse[] };
                }
              ).toggle.rich_text,
            )}
          </summary>
        </details>
      );

    case "table_of_contents":
      return (
        <div className="my-[4px] text-[14px] text-[rgb(120,119,116)]">목차</div>
      );

    case "column_list":
    case "column":
      return null;

    default:
      return null;
  }
}

function renderRichText(richTexts: RichTextItemResponse[]) {
  return richTexts.map((text, i) => {
    // 줄바꿈(\n)을 <br />로 변환
    const parts = text.plain_text.split("\n");
    let content: React.ReactNode =
      parts.length > 1
        ? parts.map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < parts.length - 1 && <br />}
            </span>
          ))
        : text.plain_text;

    const classes: string[] = [];

    if (text.annotations.bold)
      content = <strong className="font-semibold">{content}</strong>;
    if (text.annotations.italic) content = <em>{content}</em>;
    if (text.annotations.strikethrough) content = <s>{content}</s>;
    if (text.annotations.underline) content = <u>{content}</u>;
    if (text.annotations.code)
      content = (
        <code className="rounded-[3px] bg-[rgba(135,131,120,0.15)] px-[0.4em] py-[0.2em] text-[85%] text-[#eb5757]">
          {content}
        </code>
      );

    if (text.annotations.color && text.annotations.color !== "default") {
      const mapped = NOTION_COLOR_MAP[text.annotations.color];
      if (mapped) classes.push(mapped);
    }

    if (text.href) {
      content = (
        <a
          href={text.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[rgba(55,53,47,0.4)] underline-offset-[2px] hover:decoration-[rgba(55,53,47,0.6)]"
        >
          {content}
        </a>
      );
    }

    return (
      <span
        key={i}
        className={classes.length > 0 ? classes.join(" ") : undefined}
      >
        {content}
      </span>
    );
  });
}

function getImageUrl(
  image:
    | { type: "file"; file: { url: string } }
    | { type: "external"; external: { url: string } },
): string {
  return image.type === "file" ? image.file.url : image.external.url;
}

function NotionImage({ src, alt }: { src: string; alt: string }) {
  /* eslint-disable-next-line @next/next/no-img-element */
  return (
    <img
      src={src}
      alt={alt}
      className="m-auto h-auto max-w-full rounded-[2px]"
    />
  );
}
