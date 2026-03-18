import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  const pageLinks = [
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
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
    <footer className="bg-white/[0.02] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column - Logo + Tagline */}
          <div className="space-y-4">
            <Logo size="md" linkToHome={false} />
            <p className="text-white/60 text-sm font-gemunu leading-relaxed max-w-xs">
              AI strategy and creative technology for ambitious organizations
            </p>
          </div>

          {/* Middle Column - Pages */}
          <div>
            <h3 className="text-white font-gemunu text-lg mb-6">Pages</h3>
            <ul className="space-y-3">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors font-gemunu text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Connect */}
          <div>
            <h3 className="text-white font-gemunu text-lg mb-6">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@badalien.works"
                  className="text-white/70 hover:text-white transition-colors font-gemunu text-base"
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
                    className="text-white/70 hover:text-white transition-colors font-gemunu text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm font-gemunu text-center">
            © 2026 Bad Alien. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
