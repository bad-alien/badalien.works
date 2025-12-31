import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blackbox Decoded 2025 | Bad Alien",
  description: "A year in review. The data, the stories, the void.",
};

export default function DecodedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white min-h-screen selection:bg-void-orange selection:text-black overflow-hidden">
      {children}
    </div>
  );
}
