import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export const NOTION_COLOR_MAP: Record<string, string> = {
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

export function renderRichText(richTexts: RichTextItemResponse[]) {
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
