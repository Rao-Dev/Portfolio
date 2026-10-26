import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/portrait.jpg";
import { SectionHeading } from "@/components/project-bits";
import { ProjectExplorer } from "@/components/project-explorer";
import { profile } from "@/content/profile";

export default function Home() {
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
              <Link href="#contact" className="border border-border px-5 py-3 transition-colors hover:border-maroon">
                Get in touch
              </Link>
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

      <ProjectExplorer />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
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
            <a
              href={profile.resume}
              download
              className="flex items-center gap-2 border border-border px-5 py-3 whitespace-nowrap transition-colors hover:border-maroon"
            >
              Download resume
              <svg viewBox="0 0 16 16" width="14" height="14" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M8 2v9M4 7.5 8 11.5l4-4M2.5 14h11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
