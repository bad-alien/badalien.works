import Link from 'next/link';
import Logo from './Logo';

const pageLinks = [
  { href: '/consult', label: 'Consult' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/ai-consultant-pasadena', label: 'AI Consultant in Pasadena' },
  { href: '/creative', label: 'Creative' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
];

const linkClass = 'text-text-secondary hover:text-white transition-colors font-sans text-base';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      {/* Extra bottom padding below md keeps the bottom bar clear of the fixed chat launcher */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-12 lg:pt-16 pb-28 md:pb-12 lg:pb-16">
        {/* Brand row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
          {/* self-start keeps the column flexbox from stretching the logo to full width below sm */}
          <Logo size="md" linkToHome={false} className="self-start sm:self-center" />
          <div className="space-y-1">
            <p className="text-text-secondary text-sm font-sans leading-relaxed">
              AI strategy and creative technology for ambitious organizations
            </p>
            <p className="text-text-secondary text-sm font-sans leading-relaxed">
              Based in Pasadena, CA. Working with teams across Los Angeles and remotely.
            </p>
          </div>
        </div>

        {/* Nav + contact row */}
        <div className="mt-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 lg:justify-end lg:shrink-0">
            <li>
              <a href="mailto:contact@badalien.works" className={`${linkClass} break-all`}>
                contact@badalien.works
              </a>
            </li>
            <li>
              <a href="tel:+16264695839" className={linkClass}>
                (626) 469-5839
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 md:pr-24 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm font-sans text-center md:text-left">
            © 2026 Bad Alien LLC. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/40 hover:text-white transition-colors font-sans text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
