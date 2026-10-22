import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/portrait.jpg";
import { ExperienceLogos } from "@/components/experience-logos";
import { FigureImage, ProjectOrg, Tags } from "@/components/project-bits";
import { SiteMapButton } from "@/components/site-map";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

function SectionHeading({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-label text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2 className="font-display mt-1 text-3xl font-semibold tracking-wide uppercase">{children}</h2>
    </div>
  );
}

export default function Home() {
  const [featured, ...rest] = projects;

  return (
    <>
      <section className="relative overflow-hidden bg-maroon text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="font-label text-[11px] font-semibold tracking-[0.25em] text-stone uppercase">
            Texas A&amp;M University · Mechanical Engineering
          </p>
          <h1 className="font-display mt-4 text-6xl leading-none font-bold tracking-wide uppercase sm:text-8xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 text-pretty">{profile.intro}</p>
          <div className="font-label mt-8 flex flex-wrap gap-3 text-xs font-semibold tracking-widest uppercase">
            <Link href="#projects" className="bg-white px-5 py-3 text-maroon transition-colors hover:bg-stone">
              View projects
            </Link>
            <SiteMapButton className="flex items-center gap-2 border border-white/40 px-5 py-3 uppercase transition-colors hover:bg-white/10">
              Open the site map
              <kbd className="border border-white/40 px-1 text-[9px]">M</kbd>
            </SiteMapButton>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section id="about" className="py-16">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <Image
              src={portrait}
              alt={`Portrait of ${profile.name}`}
              sizes="(min-width: 768px) 320px, 100vw"
              placeholder="blur"
              className="aspect-square w-full max-w-xs border-b-4 border-maroon object-cover object-top"
            />
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-wide text-accent uppercase">Howdy</h2>
              <div className="mt-5 space-y-4 text-muted text-pretty">
                {profile.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
          <ExperienceLogos />
        </section>

        <section id="projects" className="border-t border-border py-16">
          <SectionHeading eyebrow="Featured project">Selected work</SectionHeading>
          <Link
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
              preload
              className="order-1 aspect-[16/10] md:order-2"
            />
          </Link>

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
        </section>

        <section id="contact" className="border-t border-border py-16">
          <SectionHeading eyebrow="Contact">Let’s stay in touch</SectionHeading>
          <p className="mt-4 max-w-xl text-muted">
            The quickest way to reach me is email, or connect with me on LinkedIn.
          </p>
          <div className="font-label mt-6 flex flex-wrap gap-3 text-xs font-semibold tracking-widest uppercase">
            <a
              href={`mailto:${profile.email}`}
              className="bg-maroon px-5 py-3 text-white transition-colors hover:bg-maroon-light"
            >
              {profile.email}
            </a>
            <a
              href={profile.linkedin}
              className="border border-border px-5 py-3 transition-colors hover:border-maroon"
            >
              LinkedIn ↗
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
