import Image from "next/image";
import { organizations, type Organization } from "@/content/organizations";

// Every logo is flattened to one ink color so different brands read as a set:
// black on light surfaces, white on dark ones (dark mode, or the maroon band).
export function OrgLogo({
  org,
  size = "md",
  onMaroon = false,
}: {
  org: Organization;
  size?: "sm" | "md";
  onMaroon?: boolean;
}) {
  return (
    <Image
      src={org.logo}
      alt={`${org.name} logo`}
      className={`${org.height[size]} w-auto brightness-0 ${onMaroon ? "invert" : "dark:invert"}`}
    />
  );
}

// A full-width maroon band listing every organization with its logo and role.
export function ExperienceLogos() {
  return (
    <section aria-label="Experience" className="bg-maroon text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="font-label text-[11px] font-semibold tracking-[0.2em] text-stone uppercase">Experience</p>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {organizations.map((org) => (
            <li key={org.name} className="group flex flex-col items-start" title={org.role}>
              <div className="flex h-10 items-center opacity-80 transition-opacity group-hover:opacity-100">
                <OrgLogo org={org} onMaroon />
              </div>
              <p className="font-label mt-3 text-[10px] font-semibold tracking-widest text-white uppercase">
                {org.name}
              </p>
              <p className="mt-0.5 text-xs text-white/70">{org.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
