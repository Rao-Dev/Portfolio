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
      {/* Hero and bio in one: name, full introduction and actions beside the portrait. */}
      <section id="about" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-maroon opacity-[0.06] dark:text-stone [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:48px_48px]"
        />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-[3fr_2fr]">
          <div className="order-2 md:order-1">
            <p className="font-label text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
              Texas A&amp;M University · Mechanical Engineering
            </p>
            <h1 className="font-display mt-4 text-6xl leading-none font-bold tracking-wide uppercase sm:text-7xl">
              {profile.name}
            </h1>
            <div className="mt-6 space-y-4 text-muted text-pretty">
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="font-label mt-8 flex flex-wrap gap-3 text-xs font-semibold tracking-widest uppercase">
              <Link href="#projects" className="bg-maroon px-5 py-3 text-white transition-colors hover:bg-maroon-light">
                View projects
              </Link>
              <SiteMapButton className="flex items-center gap-2 border border-border px-5 py-3 uppercase transition-colors hover:border-maroon">
                Open the site map
                <kbd className="border border-border px-1 text-[9px]">M</kbd>
              </SiteMapButton>
            </div>
          </div>
          <Image
            src={portrait}
            alt={`Portrait of ${profile.name}`}
            // The landscape photo is cropped to a 4:5 frame, so it renders about 1.76x wider
            // than the frame itself; sizes describes that full width so the browser fetches
            // a sharp enough file.
            sizes="(min-width: 768px) 670px, 106vw"
            quality={90}
            placeholder="blur"
            preload
            className="order-1 aspect-[4/5] w-3/5 max-w-sm border-b-4 border-maroon object-cover object-top sm:w-1/2 md:order-2 md:w-full md:justify-self-end"
          />
        </div>
      </section>

      <ExperienceLogos />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section id="projects" className="py-16">
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
