import Image, { type StaticImageData } from "next/image";
import bell from "@/assets/logos/bell.png";
import tamuSae from "@/assets/logos/tamu-sae.svg";
import tamuSrt from "@/assets/logos/tamu-srt.webp";
import textron from "@/assets/logos/textron-systems.svg";

type Logo = { name: string; role: string; image: StaticImageData; height: string };

// Heights are tuned per mark so the wide wordmarks and the compact emblems
// read at a similar visual weight.
const logos: Logo[] = [
  { name: "Textron Systems", role: "Design Engineering Intern", image: textron, height: "h-5" },
  { name: "Bell Flight", role: "Manufacturing Engineering Intern", image: bell, height: "h-10" },
  { name: "TAMU FSAE - Internal Combustion", role: "Chassis Engineering Apprentice", image: tamuSae, height: "h-9" },
  { name: "Texas A&M Sounding Rocketry", role: "Structures Engineer", image: tamuSrt, height: "h-10" },
];

export function ExperienceLogos() {
  return (
    <div className="mt-10 border-t border-border pt-6">
      <p className="font-label text-[11px] font-semibold tracking-[0.2em] text-subtle uppercase">
        Experience
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {logos.map((logo) => (
          <li key={logo.name} className="group flex flex-col items-start" title={logo.role}>
            <div className="flex h-10 items-center">
              {/* Every logo is flattened to one ink color so the row reads as a set. */}
              <Image
                src={logo.image}
                alt={`${logo.name} logo`}
                className={`${logo.height} w-auto opacity-70 brightness-0 transition-opacity group-hover:opacity-100 dark:invert`}
              />
            </div>
            <p className="font-label mt-3 text-[10px] font-semibold tracking-widest text-muted uppercase">
              {logo.name}
            </p>
            <p className="mt-0.5 text-xs text-subtle">{logo.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
