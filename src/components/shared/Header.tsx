'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useScrollState } from '@/hooks/useScrollState';

interface HeaderProps {
  variant?: 'default' | 'minimal';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = useScrollState(50);
  const pathname = usePathname();

  const leftLinks = [
    { href: '/consult', label: 'Consult' },
    { href: '/creative', label: 'Creative' },
  ];

  const rightLinks = [
    { href: '/insights', label: 'Insights' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0A0A]/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-24 md:h-28">
          {/* Left Nav - Desktop only */}
          {variant === 'default' && (
            <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8 absolute left-0">
              {leftLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href ? 'text-white' : 'text-white/80'
                  } hover:text-white transition-colors text-lg font-sans`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Centered Logo - Custom size ~15% larger than md (64px → 74px) */}
          <Logo size="md" className="!h-[77px]" />

          {/* Right Nav - Desktop only */}
          {variant === 'default' && (
            <nav className="hidden md:flex items-center gap-8 absolute right-0">
              {rightLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href ? 'text-white' : 'text-white/80'
                  } hover:text-white transition-colors text-lg font-sans`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-white text-black font-sans text-lg hover:bg-white/90 transition-colors rounded"
              >
                Let&apos;s Talk
              </Link>
            </nav>
          )}

          {/* Mobile Hamburger - only show in default variant */}
          {variant === 'default' && (
            <button
              className="md:hidden absolute right-0 flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white block transition-all"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-white block transition-all"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white block transition-all"
              />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && variant === 'default' && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.nav
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-base border-l border-border z-50 md:hidden"
            >
              {/* Close button */}
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
                  aria-label="Close menu"
                >
                  <span className="w-full h-0.5 bg-white block rotate-45 translate-y-2" />
                  <span className="w-full h-0.5 bg-white block -rotate-45 -translate-y-2" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col gap-2 px-6">
                {[...leftLinks, ...rightLinks].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-4 ${
                        pathname === link.href ? 'text-white' : 'text-white/80'
                      } hover:text-white transition-colors text-xl font-sans border-b border-white/5`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3 * 0.1 }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-4 ${
                      pathname === '/contact' ? 'text-white' : 'text-white/80'
                    } hover:text-white transition-colors text-xl font-sans`}
                  >
                    Let&apos;s Talk
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
