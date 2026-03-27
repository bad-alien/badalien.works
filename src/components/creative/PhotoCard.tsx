import { memo } from 'react';
import Image from 'next/image';
import { PortfolioItem } from '@/data/portfolio';

interface PhotoCardProps {
  photo: PortfolioItem;
  onClick: (photoId: number) => void;
}

function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <div
      className="relative cursor-pointer group mb-6"
      onClick={() => onClick(photo.id)}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="w-full h-auto transition-opacity group-hover:opacity-90"
        {...(photo.unoptimized ? { unoptimized: true } : {})}
      />

      {/* Category label overlay */}
      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-white">
            {photo.category}
            {photo.title && <span className="ml-2 text-[#C5C5C5]">· {photo.title}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(PhotoCard);
