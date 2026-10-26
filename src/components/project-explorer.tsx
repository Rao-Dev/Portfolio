"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ExperienceLogos } from "@/components/experience-logos";
import { FigureImage, ProjectOrg, SectionHeading, Tags } from "@/components/project-bits";
import { projects } from "@/content/projects";

// The Experience band and the project list share one filter: clicking an
// organization shows only its projects, clicking it again shows everything.
export function ProjectExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const listRef = useRef<HTMLElement>(null);

  const select = (name: string | null) => {
    setSelected(name);
    if (name) listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const shown = selected ? projects.filter((p) => p.organization === selected) : projects;
  const [featured, ...rest] = shown;

  return (
    <>
      <ExperienceLogos selected={selected} onSelect={select} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section id="projects" ref={listRef} className="py-16" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={selected ? `Filtered · ${selected}` : "Featured project"}>
              Selected work
            </SectionHeading>
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="font-label border border-border px-4 py-2 text-[11px] font-semibold tracking-widest uppercase transition-colors hover:border-maroon"
              >
                Show all projects
              </button>
            )}
          </div>

          {!featured ? (
            <p className="mt-8 border border-dashed border-border p-8 text-muted">
              Project write-ups for {selected} are coming soon.
            </p>
          ) : (
            <Link
              key={featured.slug}
              href={`/projects/${featured.slug}`}
              className="group mt-8 grid items-center gap-8 border border-border bg-surface p-4 transition-colors hover:border-maroon sm:p-6 md:grid-cols-[2fr_3fr]"
            >
              <div className="order-2 md:order-1">
                <ProjectOrg organization={featured.organization} period={featured.period} />
                <h3 className="font-display mt-2 text-3xl leading-tight font-semibold tracking-wide uppercase text-balance">
                  {featured.title}
                </h3>
                <p className="mt-4 text-muted text-pretty">{featured.summary}</p>
                <div className="mt-5">
                  <Tags tags={featured.tags} />
                </div>
                <p className="font-label mt-6 text-xs font-semibold tracking-widest text-accent uppercase">
                  Explore the project{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </p>
              </div>
              <FigureImage
                figure={featured.cover}
                sizes="(min-width: 768px) 600px, 100vw"
                preload={!selected}
                className="order-1 aspect-[16/10] md:order-2"
              />
            </Link>
          )}

          {rest.length > 0 && (
            <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2">
              {rest.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
                  <FigureImage figure={project.cover} sizes="(min-width: 640px) 480px, 100vw" />
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl leading-tight font-semibold tracking-wide uppercase group-hover:text-accent">
                      {project.title}
                    </h3>
                    <span className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProjectOrg organization={project.organization} period={project.period} />
                  </div>
                  <p className="mt-2 text-sm text-muted text-pretty">{project.summary}</p>
                  <div className="mt-4">
                    <Tags tags={project.tags} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
