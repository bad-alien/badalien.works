import { memo } from 'react';
import Image from 'next/image';
import { Photo } from '@/data/photos';

interface LightboxProps {
  photo: Photo;
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

      {/* Photo */}
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
        />
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
