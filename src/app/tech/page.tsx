'use client';

import Logo from '@/components/shared/Logo';

export default function TechPage() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Coming Soon Message */}
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
