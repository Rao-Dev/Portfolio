import Image from "next/image";
import { OrgLogo } from "@/components/experience-logos";
import { getOrganization } from "@/content/organizations";
import type { Figure } from "@/content/projects";

export function SectionHeading({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-label text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2 className="font-display mt-1 text-3xl font-semibold tracking-wide uppercase">{children}</h2>
    </div>
  );
}

// Organization logo in place of its name, followed by the project dates.
export function ProjectOrg({ organization, period }: { organization: string; period: string }) {
  const org = getOrganization(organization);
  return (
    <div className="font-label flex items-center gap-3 text-[11px] font-semibold tracking-widest text-subtle uppercase">
      {org ? (
        <span className="flex h-7 items-center opacity-80" title={org.name}>
          <OrgLogo org={org} size="sm" />
        </span>
      ) : (
        <span>{organization}</span>
      )}
      <span>{period}</span>
    </div>
  );
}

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
