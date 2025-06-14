import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "badalien.works - Coming Soon",
  description: "badalien.works - Coming Soon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
