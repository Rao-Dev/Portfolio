import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="bg-maroon text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-8 text-sm sm:px-6">
        <p className="font-display text-base tracking-wide uppercase">
          {profile.name} <span className="text-stone/70">· © {new Date().getFullYear()}</span>
        </p>
        <div className="font-label flex gap-5 text-xs font-semibold tracking-widest uppercase">
          <a href={`mailto:${profile.email}`} className="text-white/80 hover:text-white">
            Email
          </a>
          <a href={profile.linkedin} className="text-white/80 hover:text-white">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
