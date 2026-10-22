import type { Metadata } from "next";
import { Open_Sans, Oswald, Work_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteMap } from "@/components/site-map";
import { profile } from "@/content/profile";
import "./globals.css";

// Texas A&M's brand typefaces: Oswald for display, Work Sans for labels, Open Sans for text.
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rubin Rao | Portfolio",
    template: "%s · Rubin Rao",
  },
  description: profile.intro,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${workSans.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <SiteMap />
      </body>
    </html>
  );
}
