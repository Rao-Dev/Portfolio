import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

// The site map's view of the site: one hub (home), constellations of
// project pages grouped by organization, and single stars for everything else.

export type Vec3 = [number, number, number];

export type MapNode = {
  id: string;
  label: string;
  kind: "hub" | "cluster" | "single" | "page";
  description: string;
  href?: string;
  // Display number for top-level stars ("01", "02", …).
  number?: string;
  // Subtitle under top-level labels, e.g. "3 pages".
  meta?: string;
  // For pages: the constellation they belong to.
  group?: string;
  pos: Vec3;
};

export type MapRing = { center: Vec3; radius: number };

export type SiteMap = {
  nodes: MapNode[];
  edges: [string, string][];
  rings: MapRing[];
  groups: { id: string; label: string; number: string; pages: MapNode[] }[];
};

type Body =
  | { kind: "cluster"; id: string; label: string; description: string; pages: typeof projects }
  | { kind: "single"; id: string; label: string; description: string; href?: string; meta: string };

function constellation(label: string, description: string): Body {
  return {
    kind: "cluster",
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label,
    description,
    pages: projects.filter((p) => p.organization.startsWith(label)),
  };
}

const bodies: Body[] = [
  constellation(
    "Bell Flight",
    "Manufacturing Engineering Intern at the Drive Systems Center, summer 2025: tooling, process improvement and shop-floor documentation.",
  ),
  constellation(
    "Texas A&M Sounding Rocketry Team",
    "Structures Engineer, 2024–2026: composite couplers, carbon fiber airframes, rocket integration and lander ground support.",
  ),
  constellation(
    "Textron Systems",
    "Design Engineering Intern in Hunt Valley, MD, summer 2026: test-stand bracketry for the Aerosonde.",
  ),
  {
    kind: "single",
    id: "fsae",
    label: "TAMU FSAE - Internal Combustion",
    description: "Chassis Engineering Apprentice on the TAMU FSAE - Internal Combustion team. Project write-up coming soon.",
    meta: "Coming soon",
  },
  {
    kind: "single",
    id: "about",
    label: "About",
    description: profile.intro,
    href: "/#about",
    meta: "Section",
  },
  {
    kind: "single",
    id: "contact",
    label: "Contact",
    description: `Email ${profile.email} or connect on LinkedIn.`,
    href: "/#contact",
    meta: "Section",
  },
];

function build(): SiteMap {
  const nodes: MapNode[] = [
    {
      id: "home",
      label: profile.name,
      kind: "hub",
      description: profile.intro,
      href: "/",
      meta: "Home",
      pos: [0, 0, 0],
    },
  ];
  const edges: [string, string][] = [];
  const rings: MapRing[] = [];
  const groups: SiteMap["groups"] = [];

  bodies.forEach((body, i) => {
    const number = String(i + 1).padStart(2, "0");
    // Spread bodies around the hub, interleaved so the two constellations sit
    // on opposite sides and their labels never collide; constellations sit farther out.
    const slot = [0, 3, 1, 4, 2, 5][i] ?? i;
    const angle = (slot / bodies.length) * Math.PI * 2 + 0.4;
    const radius = body.kind === "cluster" ? 260 : 190;
    const center: Vec3 = [
      Math.cos(angle) * radius,
      (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 12),
      Math.sin(angle) * radius,
    ];

    if (body.kind === "single") {
      nodes.push({ ...body, number, pos: center });
      edges.push(["home", body.id]);
      return;
    }

    nodes.push({
      id: body.id,
      label: body.label,
      kind: "cluster",
      description: body.description,
      number,
      meta: `${body.pages.length} ${body.pages.length === 1 ? "page" : "pages"}`,
      pos: center,
    });
    edges.push(["home", body.id]);
    rings.push({ center, radius: 80 });

    const pages = body.pages.map((project, j) => {
      const a = (j / body.pages.length) * Math.PI * 2 + i;
      const node: MapNode = {
        id: project.slug,
        label: project.title,
        kind: "page",
        description: project.summary,
        href: `/projects/${project.slug}`,
        group: body.label,
        pos: [center[0] + Math.cos(a) * 80, center[1] + (j % 2 ? 14 : -10), center[2] + Math.sin(a) * 80],
      };
      edges.push([body.id, node.id]);
      return node;
    });
    nodes.push(...pages);
    groups.push({ id: body.id, label: body.label, number, pages });
  });

  return { nodes, edges, rings, groups };
}

export const siteMap = build();
