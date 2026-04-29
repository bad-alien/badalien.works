import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  const pageLinks = [
    { href: '/consult', label: 'Consult' },
    { href: '/creative', label: 'Creative' },
    { href: '/insights', label: 'Insights' },
    { href: '/contact', label: 'Contact' },
  ];

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  ];

  return (
    <footer className="bg-surface border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column - Logo + Tagline */}
          <div className="space-y-4">
            <Logo size="md" linkToHome={false} />
            <p className="text-text-secondary text-sm font-sans leading-relaxed max-w-xs">
              AI strategy and creative technology for ambitious organizations
            </p>
          </div>

          {/* Middle Column - Pages */}
          <nav aria-label="Footer pages">
            <h3 className="text-white font-sans text-lg mb-6">Pages</h3>
            <ul className="space-y-3">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-white transition-colors font-sans text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Column - Connect */}
          <nav aria-label="Connect" className="min-w-0">
            <h3 className="text-white font-sans text-lg mb-6">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@badalien.works"
                  className="text-text-secondary hover:text-white transition-colors font-sans text-base break-all"
                >
                  contact@badalien.works
                </a>
              </li>
              <li>
                <a
                  href="tel:+16264695839"
                  className="text-text-secondary hover:text-white transition-colors font-sans text-base"
                >
                  (626) 469-5839
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
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
