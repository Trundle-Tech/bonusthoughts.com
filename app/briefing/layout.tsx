import type { Metadata } from "next";

// Private page: keep it out of search results and previews.
export const metadata: Metadata = {
  title: "Briefing | BonusThoughts",
  description: "Private daily briefing.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
  openGraph: undefined,
  twitter: undefined,
};

export default function BriefingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
