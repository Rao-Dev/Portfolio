import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrgLogo } from "@/components/experience-logos";
import { FigureImage, Tags } from "@/components/project-bits";
import { getOrganization } from "@/content/organizations";
import { getProject, projects } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

function Section({
  title,
  paragraphs,
  list,
}: {
  title: string;
  paragraphs: string[];
  list?: string[];
}) {
  if (paragraphs.length === 0 && !list?.length) return null;
  return (
    <section className="grid gap-3 border-t border-border py-10 md:grid-cols-[1fr_3fr] md:gap-10">
      <h2 className="font-display text-xl font-semibold tracking-wide uppercase">{title}</h2>
      <div className="space-y-4 text-muted text-pretty">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {list && (
          <ul className="list-disc space-y-2 pl-5 marker:text-subtle">
            {list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  const org = getOrganization(project.organization);
  const meta: { label: string; value: React.ReactNode }[] = [
    {
      label: "Organization",
      value: org ? (
        // Logo only; its alt text and tooltip carry the name.
        <span className="flex h-7 items-center" title={org.name}>
          <OrgLogo org={org} size="sm" />
        </span>
      ) : (
        project.organization
      ),
    },
    { label: "Role", value: project.role },
    { label: "Location", value: project.location },
    { label: "Period", value: project.period },
  ];

  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="pt-10 pb-8 sm:pt-14">
        <nav className="font-label text-[11px] font-semibold tracking-widest text-subtle uppercase">
          <Link href="/#projects" className="hover:text-foreground">
            Projects
          </Link>{" "}
          / <span className="text-muted">{project.title}</span>
        </nav>
        <h1 className="font-display mt-5 max-w-3xl text-4xl leading-tight font-semibold tracking-wide uppercase text-balance sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted text-pretty">{project.summary}</p>
        <div className="mt-5">
          <Tags tags={project.tags} />
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border py-5 text-sm md:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="font-label text-[10px] font-semibold tracking-widest text-accent uppercase">{item.label}</dt>
              <dd className="mt-1 font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <figure>
        <FigureImage
          figure={project.cover}
          sizes="(min-width: 1024px) 976px, 100vw"
          preload
          className="aspect-[16/9]"
          naturalAspect={project.cover.full}
        />
        <figcaption className="mt-2 text-xs text-subtle">{project.cover.caption}</figcaption>
      </figure>

      <div className="mt-10">
        <Section title="Problem" paragraphs={project.problem} list={project.problemList} />
        <Section title="Process" paragraphs={project.process} list={project.processList} />
        <Section title="Solution" paragraphs={project.solution} list={project.solutionList} />

        {project.takeaways.length > 0 && (
          <section className="grid gap-3 border-t border-border py-10 md:grid-cols-[1fr_3fr] md:gap-10">
            <h2 className="font-display text-xl font-semibold tracking-wide uppercase">Takeaways</h2>
            <div className={`grid gap-4 ${project.takeaways.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {project.takeaways.map((takeaway) => (
                <div key={takeaway.title} className="border-t-2 border-maroon bg-surface p-5">
                  <h3 className="font-display text-lg font-semibold tracking-wide uppercase">{takeaway.title}</h3>
                  <p className="mt-2 text-sm text-muted text-pretty">{takeaway.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.gallery.length > 0 && (
          <section className="border-t border-border py-10">
            <h2 className="font-display text-xl font-semibold tracking-wide uppercase">Gallery</h2>
            <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2">
              {project.gallery.map((figure) => (
                <figure key={figure.caption}>
                  <FigureImage figure={figure} sizes="(min-width: 640px) 480px, 100vw" />
                  <figcaption className="mt-2 text-xs text-subtle">{figure.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>

      <Link
        href={`/projects/${next.slug}`}
        className="group mb-16 flex items-center justify-between gap-4 bg-maroon p-6 text-white transition-colors hover:bg-maroon-light"
      >
        <div>
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-stone">Next project</p>
          <p className="font-display mt-1 text-xl font-semibold tracking-wide uppercase">{next.title}</p>
        </div>
        <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </article>
  );
}
