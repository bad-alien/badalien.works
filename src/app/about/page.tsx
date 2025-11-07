'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col">
      {/* Navigation */}
      <nav className="w-full z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/logos/ba-logo-trans-white.png"
                alt="Bad Alien Logo"
                className="h-16 w-auto"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* Coming Soon Message */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light text-white flex items-center justify-center gap-0">
            <span>Coming soon</span><span className="dots"></span>
          </h1>
          <p className="text-sm text-white opacity-25 mt-2">
            maybe
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }

        .dots {
          display: inline-block;
          width: 1.5em;
          text-align: left;
        }

        .dots::after {
          content: '';
          animation: blink 2s infinite;
        }
      `}</style>
    </div>
  );
}
