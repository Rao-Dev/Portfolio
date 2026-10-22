import Image from "next/image";
import type { Figure } from "@/content/projects";

export function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="font-label border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

// Photos fill their frame; diagrams sit whole on white so labels stay readable.
export function FigureImage({
  figure,
  sizes,
  preload,
  className = "aspect-[4/3]",
}: {
  figure: Figure;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-border ${
        figure.diagram ? "bg-white" : "bg-surface"
      } ${className}`}
    >
      <Image
        src={figure.image}
        alt={figure.caption}
        fill
        sizes={sizes}
        preload={preload}
        placeholder="blur"
        className={figure.diagram ? "object-contain p-4" : "object-cover"}
      />
    </div>
  );
}
