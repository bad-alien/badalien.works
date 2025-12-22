import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Void | Bad Alien",
  description: "Enter the Void - An AI interface by Bad Alien",
};

export default function VoidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
