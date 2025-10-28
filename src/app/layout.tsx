import type { Metadata } from "next";
import { Gemunu_Libre } from "next/font/google";
import "./globals.css";

const gemunuLibre = Gemunu_Libre({
  variable: "--font-gemunu-libre",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bad Alien",
  description: "Bad Alien - Creative and Consulting Services",
  icons: {
    icon: "/logos/ba-logo-trans-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gemunuLibre.variable} antialiased`}
        style={{ fontFamily: 'var(--font-gemunu-libre)' }}
      >
        {children}
      </body>
    </html>
  );
}
