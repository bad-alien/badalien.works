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
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
