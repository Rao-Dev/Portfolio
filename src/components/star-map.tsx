"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteMap, type MapNode, type Vec3 } from "@/content/site-map";

export const OPEN_STAR_MAP = "open-star-map";

type Camera = { yaw: number; pitch: number; dist: number; target: Vec3 };

const OVERVIEW: Camera = { yaw: 0.5, pitch: 0.8, dist: 820, target: [0, 0, 0] };
const MIN_DIST = 180;
const MAX_DIST = 1600;

const nodesById = new Map(siteMap.nodes.map((n) => [n.id, n]));
const topLevel = siteMap.nodes.filter((n) => n.kind === "cluster" || n.kind === "single");

// Background starfield and nebula glows, fixed so they don't shift between renders.
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}
const rand = seeded(42);
const STARS = Array.from({ length: 900 }, () => {
  const u = rand() * 2 - 1;
  const t = rand() * Math.PI * 2;
  const r = 1400 + rand() * 1600;
  const s = Math.sqrt(1 - u * u);
  return {
    pos: [Math.cos(t) * s * r, u * r, Math.sin(t) * s * r] as Vec3,
    size: rand() * 1.3 + 0.3,
    phase: rand() * Math.PI * 2,
  };
});
const NEBULAE = Array.from({ length: 7 }, () => ({
  pos: [(rand() - 0.5) * 1600, (rand() - 0.5) * 500, (rand() - 0.5) * 1600] as Vec3,
  size: 260 + rand() * 260,
}));

type Projected = { x: number; y: number; z: number; scale: number };

function makeProjector(cam: Camera, w: number, h: number) {
  const cp = Math.cos(cam.pitch);
  const eye: Vec3 = [
    cam.target[0] + cam.dist * cp * Math.sin(cam.yaw),
    cam.target[1] + cam.dist * Math.sin(cam.pitch),
    cam.target[2] + cam.dist * cp * Math.cos(cam.yaw),
  ];
  // Orthonormal view basis looking from the eye at the target.
  const f = [cam.target[0] - eye[0], cam.target[1] - eye[1], cam.target[2] - eye[2]];
  const fl = Math.hypot(f[0], f[1], f[2]);
  f[0] /= fl;
  f[1] /= fl;
  f[2] /= fl;
  const r = [-f[2], 0, f[0]];
  const rl = Math.hypot(r[0], r[2]) || 1;
  r[0] /= rl;
  r[2] /= rl;
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const focal = Math.min(w, h) * 1.1;

  return (p: Vec3): Projected | null => {
    const d = [p[0] - eye[0], p[1] - eye[1], p[2] - eye[2]];
    const z = d[0] * f[0] + d[1] * f[1] + d[2] * f[2];
    if (z < 5) return null;
    const x = d[0] * r[0] + d[1] * r[1] + d[2] * r[2];
    const y = d[0] * u[0] + d[1] * u[1] + d[2] * u[2];
    const scale = focal / z;
    return { x: w / 2 + x * scale, y: h / 2 - y * scale, z, scale };
  };
}

export function StarMapButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_STAR_MAP))}
    >
      {children}
    </button>
  );
}

export function StarMap() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]");
      if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === "m") {
        // Keep the keystroke from landing in the search box we focus on open.
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener(OPEN_STAR_MAP, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_STAR_MAP, show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!open) return null;
  return createPortal(<StarMapOverlay onClose={() => setOpen(false)} />, document.body);
}

function StarMapOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const cam = useRef<Camera>({ ...OVERVIEW, dist: MAX_DIST });
  const goal = useRef<Camera>({ ...OVERVIEW });
  const projected = useRef<{ node: MapNode; p: Projected }[]>([]);
  const hovered = useRef<string | null>(null);
  const interacted = useRef(false);
  const warping = useRef<string | null>(null);
  const [selectedId, setSelectedId] = useState("home");
  const selectedRef = useRef(selectedId);
  const [query, setQuery] = useState("");
  const [readout, setReadout] = useState("");

  const selected = nodesById.get(selectedId)!;

  const focus = useCallback((node: MapNode) => {
    interacted.current = true;
    setSelectedId(node.id);
    goal.current = {
      ...goal.current,
      target: [...node.pos],
      dist: node.kind === "hub" ? OVERVIEW.dist : node.kind === "cluster" ? 420 : 300,
    };
  }, []);

  const warp = useCallback(
    (node: MapNode) => {
      if (!node.href || warping.current) return;
      warping.current = node.id;
      goal.current = { ...goal.current, target: [...node.pos], dist: MIN_DIST * 0.4 };
      setTimeout(() => {
        router.push(node.href!);
        onClose();
      }, 550);
    },
    [router, onClose],
  );

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  // Lock page scroll and handle keys while open.
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && !(e.target instanceof HTMLInputElement)) {
        warp(nodesById.get(selectedRef.current)!);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, warp]);

  // Render loop.
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const styles = getComputedStyle(document.documentElement);
    const display = styles.getPropertyValue("--font-oswald").trim() || "sans-serif";
    const label = styles.getPropertyValue("--font-work-sans").trim() || "sans-serif";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = () => {
      frame++;
      const c = cam.current;
      const g = goal.current;
      if (!interacted.current && !reduceMotion) g.yaw += 0.0012;
      const k = 0.09;
      c.yaw += (g.yaw - c.yaw) * k;
      c.pitch += (g.pitch - c.pitch) * k;
      c.dist += (g.dist - c.dist) * k;
      for (let i = 0; i < 3; i++) c.target[i] += (g.target[i] - c.target[i]) * k;

      const project = makeProjector(c, w, h);
      ctx.clearRect(0, 0, w, h);

      for (const n of NEBULAE) {
        const p = project(n.pos);
        if (!p) continue;
        const r = Math.min(n.size * p.scale, 900);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, "rgba(128, 0, 0, 0.22)");
        grad.addColorStop(1, "rgba(80, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }

      for (const s of STARS) {
        const p = project(s.pos);
        if (!p || p.x < 0 || p.y < 0 || p.x > w || p.y > h) continue;
        const twinkle = reduceMotion ? 0.7 : 0.55 + 0.45 * Math.sin(frame * 0.02 + s.phase);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.25 + 0.5 * twinkle})`;
        ctx.fillRect(p.x, p.y, s.size, s.size);
      }

      // Orbit rings around each constellation.
      ctx.strokeStyle = "rgba(214, 211, 196, 0.16)";
      ctx.lineWidth = 1;
      for (const ring of siteMap.rings) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          const p = project([
            ring.center[0] + Math.cos(a) * ring.radius,
            ring.center[1],
            ring.center[2] + Math.sin(a) * ring.radius,
          ]);
          if (!p) {
            started = false;
            continue;
          }
          if (started) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          started = true;
        }
        ctx.stroke();
      }

      const points = new Map<string, Projected>();
      for (const node of siteMap.nodes) {
        const p = project(node.pos);
        if (p) points.set(node.id, p);
      }

      for (const [a, b] of siteMap.edges) {
        const pa = points.get(a);
        const pb = points.get(b);
        if (!pa || !pb) continue;
        const fromHub = a === "home";
        const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        grad.addColorStop(0, fromHub ? "rgba(200, 40, 40, 0.75)" : "rgba(200, 40, 40, 0.45)");
        grad.addColorStop(1, "rgba(200, 40, 40, 0.2)");
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // Nodes, far to near so closer labels sit on top.
      const ordered = siteMap.nodes
        .map((node) => ({ node, p: points.get(node.id) }))
        .filter((e): e is { node: MapNode; p: Projected } => !!e.p)
        .sort((a, b) => b.p.z - a.p.z);
      projected.current = ordered;

      for (const { node, p } of ordered) {
        const isSelected = node.id === selectedRef.current;
        const isHovered = node.id === hovered.current;
        const zoom = Math.max(0.6, Math.min(p.scale * 1.6, 1.6));

        if (node.kind === "page") {
          const size = 3.2 * zoom;
          ctx.fillStyle = isSelected || isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.85)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
          if (isSelected || isHovered || p.scale > 1.7) {
            ctx.font = `500 ${11}px ${label}`;
            ctx.fillStyle = isSelected || isHovered ? "#ffffff" : "rgba(214, 211, 196, 0.75)";
            ctx.fillText(node.label, p.x + size + 6, p.y + 4);
          }
          continue;
        }

        const size = (node.kind === "hub" ? 9 : node.kind === "cluster" ? 7 : 5) * zoom;
        if (node.kind === "hub") {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(p.x - size, p.y - size, size * 2, size * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(p.x - size / 2.5, p.y - size / 2.5, (size * 2) / 2.5, (size * 2) / 2.5);
        } else {
          ctx.shadowColor = "rgba(220, 30, 30, 0.9)";
          ctx.shadowBlur = 14;
          ctx.fillStyle = node.href || node.kind === "cluster" ? "#c41e1e" : "#7a2a2a";
          ctx.fillRect(p.x - size, p.y - size, size * 2, size * 2);
          ctx.shadowBlur = 0;
        }
        if (isSelected || isHovered) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x - size - 5, p.y - size - 5, size * 2 + 10, size * 2 + 10);
        }

        // Callout label with a leader line, as on a star chart.
        const name = node.label.toUpperCase();
        if (node.kind === "hub") {
          ctx.textAlign = "center";
          ctx.font = `600 ${18}px ${display}`;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(name, p.x, p.y + size + 24);
          ctx.font = `600 9px ${label}`;
          ctx.fillStyle = "#e05050";
          ctx.fillText("• YOU ARE HERE", p.x, p.y + size + 38);
          ctx.textAlign = "left";
          continue;
        }
        const lx = p.x + size + 14;
        const ly = p.y - size - 16;
        ctx.font = `600 ${15}px ${display}`;
        const text = node.label.length > 22 ? node.label.split(" ").slice(-2).join(" ").toUpperCase() : name;
        const nw = ctx.measureText(text).width;
        ctx.font = `600 9px ${label}`;
        const numW = ctx.measureText(node.number ?? "").width + 6;
        ctx.strokeStyle = "rgba(214, 211, 196, 0.4)";
        ctx.beginPath();
        ctx.moveTo(p.x + size, p.y - size);
        ctx.lineTo(lx, ly + 6);
        ctx.lineTo(lx + numW + nw + 10, ly + 6);
        ctx.stroke();
        ctx.fillStyle = "#e05050";
        ctx.fillText(node.number ?? "", lx, ly);
        ctx.font = `600 ${15}px ${display}`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, lx + numW, ly);
        ctx.font = `600 8px ${label}`;
        ctx.fillStyle = "rgba(214, 211, 196, 0.65)";
        ctx.fillText((node.meta ?? "").toUpperCase(), lx + numW, ly + 18);
      }

      if (frame % 6 === 0) {
        const fmt = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(1).padStart(5, "0")}`;
        const t = c.target;
        setReadout(`X ${fmt(t[0])}  Y ${fmt(t[1])}  Z ${fmt(c.dist)}`);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  // Pointer controls: drag to orbit, right/shift-drag to pan, wheel to zoom, click to inspect.
  useEffect(() => {
    const canvas = canvasRef.current!;
    let drag: { x: number; y: number; moved: number; pan: boolean } | null = null;

    const pick = (x: number, y: number) => {
      let best: MapNode | null = null;
      let bestD = 22;
      for (const { node, p } of projected.current) {
        const d = Math.hypot(p.x - x, p.y - y);
        if (d <= bestD) {
          best = node;
          bestD = d;
        }
      }
      return best;
    };
    const local = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top] as const;
    };

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, moved: 0, pan: e.button === 2 || e.shiftKey };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) {
        const [x, y] = local(e);
        const node = pick(x, y);
        hovered.current = node?.id ?? null;
        canvas.style.cursor = node ? "pointer" : "grab";
        return;
      }
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      interacted.current = true;
      canvas.style.cursor = "grabbing";
      const g = goal.current;
      if (drag.pan) {
        const s = g.dist / 900;
        const cos = Math.cos(g.yaw);
        const sin = Math.sin(g.yaw);
        g.target = [g.target[0] - dx * s * cos, g.target[1] + dy * s, g.target[2] + dx * s * sin];
      } else {
        g.yaw -= dx * 0.005;
        g.pitch = Math.max(-1.2, Math.min(1.35, g.pitch + dy * 0.005));
      }
    };
    const onUp = (e: PointerEvent) => {
      if (drag && drag.moved < 5) {
        const [x, y] = local(e);
        const node = pick(x, y);
        if (node) focus(node);
      }
      drag = null;
      canvas.style.cursor = "grab";
    };
    const onDouble = (e: MouseEvent) => {
      const [x, y] = local(e);
      const node = pick(x, y);
      if (node) warp(node);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      interacted.current = true;
      const g = goal.current;
      g.dist = Math.max(MIN_DIST, Math.min(MAX_DIST, g.dist * Math.exp(e.deltaY * 0.001)));
    };
    const noMenu = (e: Event) => e.preventDefault();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("dblclick", onDouble);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", noMenu);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("dblclick", onDouble);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", noMenu);
    };
  }, [focus, warp]);

  const zoomBy = (factor: number) => {
    interacted.current = true;
    const g = goal.current;
    g.dist = Math.max(MIN_DIST, Math.min(MAX_DIST, g.dist * factor));
  };

  const q = query.trim().toLowerCase();
  const list = useMemo(
    () =>
      topLevel
        .map((node) => {
          const pages = siteMap.groups.find((g) => g.id === node.id)?.pages ?? [];
          const hit = (n: MapNode) => !q || n.label.toLowerCase().includes(q);
          return { node, pages: hit(node) ? pages : pages.filter(hit), show: hit(node) || pages.some(hit) };
        })
        .filter((g) => g.show),
    [q],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Star map"
      className="fixed inset-0 z-50 bg-[#0b0606] text-white"
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full cursor-grab touch-none" />

      <div className="pointer-events-none absolute inset-0 flex flex-col">
        <div className="pointer-events-auto flex items-start justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-label text-[10px] font-semibold tracking-[0.2em] text-white/60 uppercase">
              Navigation · {siteMap.nodes.filter((n) => n.href).length} pages
            </p>
            <h2 className="font-display text-xl font-semibold tracking-wide uppercase">Star map</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedId("home");
                goal.current = { ...OVERVIEW, yaw: goal.current.yaw };
              }}
              className="font-label border border-white/25 px-3 py-2 text-[11px] font-semibold tracking-widest uppercase hover:bg-white/10"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-label flex items-center gap-2 bg-maroon px-3 py-2 text-[11px] font-semibold tracking-widest uppercase hover:bg-maroon-light"
            >
              Close <kbd className="border border-white/40 px-1 text-[9px]">Esc</kbd>
            </button>
          </div>
        </div>

        <div className="relative flex-1">
          <nav
            aria-label="All pages"
            className="pointer-events-auto absolute top-4 bottom-4 left-4 hidden w-64 flex-col border border-white/10 bg-black/60 backdrop-blur md:flex"
          >
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages…"
              aria-label="Search pages"
              className="border-b border-white/10 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-white/40"
            />
            <ul className="flex-1 overflow-y-auto py-2 text-sm">
              {list.map(({ node, pages }) => (
                <li key={node.id}>
                  <button
                    type="button"
                    onClick={() => focus(node)}
                    onDoubleClick={() => warp(node)}
                    className={`font-label flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] font-semibold tracking-widest uppercase hover:bg-white/5 ${
                      selectedId === node.id ? "text-white" : "text-white/80"
                    }`}
                  >
                    <span className="text-[#e05050]">{node.number}</span>
                    {node.label}
                  </button>
                  {pages.length > 0 && (
                    <ul className="mb-2 ml-4 border-l border-white/10">
                      {pages.map((page) => (
                        <li key={page.id}>
                          <button
                            type="button"
                            onClick={() => focus(page)}
                            onDoubleClick={() => warp(page)}
                            className={`w-full px-3 py-1.5 text-left text-[13px] hover:bg-white/5 ${
                              selectedId === page.id ? "text-white" : "text-white/65"
                            }`}
                          >
                            {page.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {list.length === 0 && <li className="px-3 py-2 text-white/50">No matches.</li>}
            </ul>
          </nav>

          <aside
            aria-live="polite"
            className="pointer-events-auto absolute right-4 bottom-4 left-4 border border-white/10 bg-black/70 p-5 backdrop-blur md:top-4 md:bottom-auto md:left-auto md:w-80"
          >
            <p className="font-label text-[10px] font-semibold tracking-[0.2em] text-[#e05050] uppercase">
              {selected.kind === "hub"
                ? "Home · you are here"
                : selected.group ?? (selected.kind === "cluster" ? "Constellation" : selected.meta)}
            </p>
            <h3 className="font-display mt-2 text-2xl leading-tight font-semibold tracking-wide uppercase">
              {selected.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{selected.description}</p>
            {selected.href ? (
              <button
                type="button"
                onClick={() => warp(selected)}
                className="font-label mt-5 flex w-full items-center justify-between bg-maroon px-4 py-3 text-[11px] font-semibold tracking-widest uppercase hover:bg-maroon-light"
              >
                Warp to page <span aria-hidden>↗</span>
              </button>
            ) : selected.kind === "cluster" ? (
              <p className="font-label mt-5 text-[11px] tracking-widest text-white/50 uppercase">
                Select a star in this constellation
              </p>
            ) : null}
          </aside>
        </div>

        <div className="flex items-end justify-between px-5 pb-4">
          <div className="font-label hidden text-[10px] tracking-[0.18em] text-white/50 uppercase md:block">
            <p>
              <span className="text-[#e05050]">Camera</span>{" "}
              <span className="font-mono tracking-normal">{readout}</span>
            </p>
            <p className="mt-2">
              Drag · orbit &nbsp; Scroll · zoom &nbsp; Right-drag · pan &nbsp; Click · inspect &nbsp; Enter ·
              warp
            </p>
          </div>
          <div className="pointer-events-auto ml-auto hidden gap-1 md:flex">
            {[
              ["+", 0.75, "Zoom in"],
              ["−", 1.33, "Zoom out"],
            ].map(([text, factor, name]) => (
              <button
                key={name as string}
                type="button"
                aria-label={name as string}
                onClick={() => zoomBy(factor as number)}
                className="size-9 border border-white/25 bg-black/50 text-lg hover:bg-white/10"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
