import { memo } from 'react';
import Image from 'next/image';
import { PortfolioItem } from '@/data/portfolio';

interface LightboxProps {
  photo: PortfolioItem;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

function Lightbox({ photo, onClose, onPrevious, onNext }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center lightbox-fade-in"
      onClick={onClose}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .lightbox-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>

      {/* Close button */}
      <button
        className="absolute top-8 right-8 text-white text-4xl hover:text-gray-400 transition-colors z-10"
        onClick={onClose}
      >
        ×
      </button>

      {/* Previous arrow */}
      <button
        className="absolute left-8 text-white text-5xl hover:text-gray-400 transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
      >
        ‹
      </button>

      {/* Photo and Info Container */}
      <div
        className="relative flex flex-col items-center max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-w-full max-h-[75vh] w-auto h-auto object-contain"
        />

        {/* Info Panel - only render if title, notes, or url exist */}
        {(photo.title || photo.notes || photo.url) && (
          <div className="mt-6 max-w-2xl w-full px-4 text-center">
            {photo.title && (
              <h3 className="text-2xl font-display text-[#F0F0F0] mb-3">
                {photo.title}
              </h3>
            )}
            {photo.notes && (
              <p className="text-base font-sans text-[#C5C5C5] leading-relaxed mb-4 line-clamp-2">
                {photo.notes}
              </p>
            )}
            {photo.url && (
              <a
                href={photo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-mono text-sm text-[#FF6B35] hover:text-[#FF8C5A] uppercase tracking-[0.08em] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Site →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Next arrow */}
      <button
        className="absolute right-8 text-white text-5xl hover:text-gray-400 transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        ›
      </button>
    </div>
  );
}

export default memo(Lightbox);
