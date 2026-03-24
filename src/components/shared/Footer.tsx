import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  const pageLinks = [
    { href: '/consult', label: 'Consult' },
    { href: '/creative', label: 'Creative' },
    { href: '/insights', label: 'Insights' },
    { href: '/contact', label: 'Contact' },
  ];

  const connectLinks = [
    {
      href: 'https://creative.badalien.works',
      label: 'creative.badalien.works',
      external: true,
    },
    {
      href: 'https://decoded.badalien.works',
      label: 'decoded.badalien.works',
      external: true,
    },
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
          <nav aria-label="Footer navigation">
            <div>
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
            </div>

            {/* Right Column - Connect */}
            <div className="min-w-0">
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
                {connectLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-white transition-colors font-sans text-base break-all"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-white/40 text-sm font-sans text-center">
            © 2026 Bad Alien. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
