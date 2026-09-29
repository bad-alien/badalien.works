import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata = {
  title: 'Page not found | Bad Alien',
  robots: { index: false, follow: true },
};

const links = [
  { href: '/', label: 'Home' },
  { href: '/consult', label: 'AI Consulting' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base relative grain-texture flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 flex items-center px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto w-full">
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary block mb-6">
            404 / not found
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-heading mb-6">
            Nothing here.
          </h1>
          <p className="text-lg md:text-xl text-text-body leading-relaxed mb-10 max-w-xl">
            That page moved or never existed. The useful parts of the site are one click away.
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-heading hover:text-primary underline underline-offset-4 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
