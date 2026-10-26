import type { StaticImageData } from "next/image";
import bell from "@/assets/logos/bell.png";
import tamuSae from "@/assets/logos/tamu-sae.svg";
import tamuSrt from "@/assets/logos/tamu-srt.webp";
import textron from "@/assets/logos/textron-systems.svg";

export type Organization = {
  name: string;
  role: string;
  logo: StaticImageData;
  // Logo heights at each size, tuned per mark so wide wordmarks and compact
  // emblems read at a similar visual weight.
  height: { sm: string; md: string };
};

// Listed in reverse chronological order by start date, most recent first.
export const organizations: Organization[] = [
  {
    name: "TAMU FSAE - Internal Combustion",
    role: "Chassis Engineering Apprentice",
    logo: tamuSae,
    height: { sm: "h-6", md: "h-9" },
  },
  {
    name: "Textron Systems",
    role: "Mechanical Design Engineering Intern",
    logo: textron,
    height: { sm: "h-3", md: "h-5" },
  },
  {
    name: "Bell Flight",
    role: "Manufacturing Engineering Intern",
    logo: bell,
    height: { sm: "h-7", md: "h-10" },
  },
  {
    name: "Texas A&M Sounding Rocketry Team",
    role: "Structures Engineer",
    logo: tamuSrt,
    height: { sm: "h-7", md: "h-10" },
  },
];

export function getOrganization(name: string) {
  return organizations.find((org) => org.name === name);
}
