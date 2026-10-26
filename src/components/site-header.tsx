import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/portrait.jpg";
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
          <span className="font-display text-lg font-semibold tracking-wide whitespace-nowrap uppercase">{profile.name}</span>
        </Link>
        <nav className="font-label flex items-center gap-3 text-[11px] font-semibold tracking-wider uppercase sm:gap-6 sm:text-xs sm:tracking-widest">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
