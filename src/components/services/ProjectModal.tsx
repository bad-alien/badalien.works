'use client';

import { useState, useEffect, useRef } from 'react';
import { Project, ProjectMedia } from './types';
import Image from 'next/image';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const allMedia = [project.thumbnail, ...(project.media || [])];
  const currentMedia = allMedia[currentMediaIndex];
  const hasMultipleMedia = allMedia.length > 1;

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Auto-play video when it becomes current media
  useEffect(() => {
    if (currentMedia.type === 'video' && videoRef.current) {
      videoRef.current.play();
    }
  }, [currentMedia, currentMediaIndex]);

  // Reset media index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMediaIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderMedia = (media: ProjectMedia) => {
    switch (media.type) {
      case 'video':
        return (
          <video
            ref={videoRef}
            src={media.url}
            controls
            autoPlay
            className="w-full h-full object-contain"
            poster={media.thumbnail}
          />
        );

      case 'youtube':
        const youtubeId = media.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );

      case 'vimeo':
        const vimeoId = media.url.match(/vimeo\.com\/(\d+)/)?.[1];
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );

      case 'image':
      default:
        return (
          <Image
            src={media.url}
            alt={media.alt || project.title}
            fill
            className="object-contain"
          />
        );
    }
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl mx-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 border border-white/20 rounded-full transition-all duration-300"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Media Section */}
          <div className="relative w-full md:w-2/3 bg-black/40">
            <div className="relative aspect-video w-full">
              {renderMedia(currentMedia)}
            </div>

            {/* Media Navigation */}
            {hasMultipleMedia && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 border border-white/20 rounded-full transition-all duration-300"
                  aria-label="Previous media"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 border border-white/20 rounded-full transition-all duration-300"
                  aria-label="Next media"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Media Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allMedia.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentMediaIndex
                          ? 'bg-white w-8'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to media ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/3 p-6 md:p-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-3xl font-light tracking-wide mb-2">
                  {project.title}
                </h2>
                {project.subtitle && (
                  <p className="text-text-secondary font-light tracking-wide">
                    {project.subtitle}
                  </p>
                )}
              </div>

              {/* Full Description */}
              <div className="space-y-3">
                <p className="text-text-body font-light leading-relaxed whitespace-pre-line">
                  {project.fullDescription}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-sm font-light tracking-wider text-text-secondary mb-3">
                  TECH STACK
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-light tracking-wider bg-base border border-border rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {project.links && project.links.length > 0 && (
                <div className="space-y-3 pt-4">
                  {project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full px-6 py-3 text-center text-sm font-light tracking-wider rounded-lg transition-all duration-300 ${
                        link.type === 'primary'
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-transparent border border-white/30 hover:bg-white/10 hover:border-white/60'
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
