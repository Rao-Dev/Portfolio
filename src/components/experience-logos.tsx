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

// A full-width maroon band listing every organization. Each one is a toggle
// that filters the project list below it.
export function ExperienceLogos({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  return (
    <section aria-label="Experience" className="bg-maroon text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-label text-[11px] font-semibold tracking-[0.2em] text-stone uppercase">
            Experience <span className="text-white/60 normal-case tracking-normal">· select one to filter projects</span>
          </p>
          {selected && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="font-label text-[11px] font-semibold tracking-widest text-white/80 uppercase underline-offset-4 hover:text-white hover:underline"
            >
              Show all
            </button>
          )}
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {organizations.map((org) => {
            const active = selected === org.name;
            const dimmed = selected !== null && !active;
            return (
              <li key={org.name}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(active ? null : org.name)}
                  className={`group -m-3 flex w-[calc(100%+1.5rem)] flex-col items-start p-3 text-left transition-[background-color,opacity] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white ${
                    active ? "bg-white/15" : ""
                  } ${dimmed ? "opacity-50 hover:opacity-100" : ""}`}
                >
                  <span className="flex h-10 items-center opacity-80 transition-opacity group-hover:opacity-100">
                    <OrgLogo org={org} onMaroon />
                  </span>
                  <span className="font-label mt-3 text-[10px] font-semibold tracking-widest text-white uppercase">
                    {org.name}
                  </span>
                  <span className="mt-0.5 text-xs text-white/70">{org.role}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
