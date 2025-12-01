import { memo } from 'react';
import Image from 'next/image';
import { Photo } from '@/data/photos';

interface PhotoCardProps {
  photo: Photo;
  onClick: (photoId: number) => void;
}

function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <div
      className="cursor-pointer hover:opacity-90 transition-opacity mb-6"
      onClick={() => onClick(photo.id)}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="w-full h-auto"
      />
    </div>
  );
}

export default memo(PhotoCard);
