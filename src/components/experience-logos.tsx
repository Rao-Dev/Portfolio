import Image from "next/image";
import { organizations, type Organization } from "@/content/organizations";

// Every logo is flattened to one ink color so different brands read as a set.
export function OrgLogo({ org, size = "md" }: { org: Organization; size?: "sm" | "md" }) {
  return (
    <Image
      src={org.logo}
      alt={`${org.name} logo`}
      className={`${org.height[size]} w-auto brightness-0 dark:invert`}
    />
  );
}

export function ExperienceLogos() {
  return (
    <div className="mt-10 border-t border-border pt-6">
      <p className="font-label text-[11px] font-semibold tracking-[0.2em] text-subtle uppercase">
        Experience
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {organizations.map((org) => (
          <li key={org.name} className="group flex flex-col items-start" title={org.role}>
            <div className="flex h-10 items-center opacity-70 transition-opacity group-hover:opacity-100">
              <OrgLogo org={org} />
            </div>
            <p className="font-label mt-3 text-[10px] font-semibold tracking-widest text-muted uppercase">
              {org.name}
            </p>
            <p className="mt-0.5 text-xs text-subtle">{org.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
