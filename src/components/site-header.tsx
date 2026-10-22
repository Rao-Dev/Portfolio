import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/portrait.jpg";
import { SiteMapButton } from "@/components/site-map";
import { profile } from "@/content/profile";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={portrait}
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-full object-cover object-top"
          />
          <span className="font-display text-lg font-semibold tracking-wide uppercase">{profile.name}</span>
        </Link>
        <nav className="font-label flex items-center gap-4 text-xs font-semibold tracking-widest uppercase sm:gap-6">
          <SiteMapButton className="flex items-center gap-1.5 uppercase text-accent transition-opacity hover:opacity-75">
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" aria-hidden>
              <path d="M8 2 13.5 12h-11Z" strokeLinejoin="round" />
              <circle cx="8" cy="2" r="1.4" fill="currentColor" />
              <circle cx="13.5" cy="12" r="1.4" fill="currentColor" />
              <circle cx="2.5" cy="12" r="1.4" fill="currentColor" />
            </svg>
            Map
          </SiteMapButton>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-muted transition-colors hover:text-foreground sm:block"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
