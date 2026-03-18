import type { FaqItem } from "@/lib/notion";

interface FaqProps {
  items: FaqItem[];
}

export default function Faq({ items }: FaqProps) {
  return (
    <div className="flex mobile:flex-wrap tablet:flex-wrap">
      <ul className="flex w-full flex-col">
        {items.map(({ id, title, content }, index) => {
          return (
            <li key={id} className="group w-full overflow-hidden">
              <label
                htmlFor={id}
                className="cursor-pointer flex items-center justify-between relative heading03B border-b border-b-[#e6e6e6] before:absolute h-30 max-[1079px]:h-20 before:-bottom-px before:h-0.5 before:w-0 before:bg-black before:content-[''] before:transition-[width] before:duration-500 group-has-checked:before:w-full"
              >
                <span className="w-3/4 inline-block truncate max-[1079px]:heading04B max-sm:body01B">
                  {title}
                </span>
                <div className="relative h-5 w-5">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block h-0.5 w-5 bg-black" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block h-5 w-0.5 bg-black transition-transform duration-300 group-has-checked:rotate-90" />
                </div>
              </label>
              <input
                type="radio"
                name="faq"
                id={id}
                defaultChecked={index === 0}
                hidden
              />
              <div className="grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] group-has-checked:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <div className="px-4 py-8 body01M max-[1079px]:px-2 max-[1079px]:py-6 whitespace-pre-line">
                    {content}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
