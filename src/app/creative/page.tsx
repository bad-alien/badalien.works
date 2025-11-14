'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const photos = [
  { id: 1, src: '/web/CDMXtower-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'B/W', 'Multi'] },
  { id: 2, src: '/web/LA-crosswalk.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 18, src: '/web/hummingbird-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 6, src: '/web/cabin-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 3, src: '/web/abstract-self.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 4, src: '/web/agave-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 5, src: '/web/beach-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 31, src: '/web/prince-longexp.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 23, src: '/web/me-myself-i-2.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 34, src: '/web/statue-dream.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 32, src: '/web/self-double-120.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['120mm', 'B/W'] },
  { id: 7, src: '/web/cabin-fever.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 9, src: '/web/cliff-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 10, src: '/web/concert-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'B/W', 'Multi'] },
  { id: 11, src: '/web/courthouse-sky.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 12, src: '/web/dodger-champs.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 13, src: '/web/dream-building.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 8, src: '/web/cabin-four.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 14, src: '/web/dream-center.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 15, src: '/web/escondido-sunset.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 16, src: '/web/friend-triple.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 17, src: '/web/house-dusk.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 19, src: '/web/la-man.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 20, src: '/web/la-police.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 22, src: '/web/me-myself-I-1.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 24, src: '/web/me-myself-i-3.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 25, src: '/web/motel-night.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 26, src: '/web/museo-thinker.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'B/W'] },
  { id: 27, src: '/web/night-liquor-120.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['120mm', 'B/W'] },
  { id: 28, src: '/web/pool-roof.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 29, src: '/web/prince-couch.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 30, src: '/web/prince-gargoyle.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 33, src: '/web/silly-man.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 35, src: '/web/sunset-meeting.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 36, src: '/web/symmetry-ballast.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 37, src: '/web/the-boys.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
]

export default function CreativePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePhotoClick = (photoId: number) => {
    setSelectedPhoto(photoId)
  }

  const handleClose = () => {
    setSelectedPhoto(null)
  }

  const handlePrevious = () => {
    if (selectedPhoto !== null) {
      const currentIndex = photos.findIndex(p => p.id === selectedPhoto)
      const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
      setSelectedPhoto(photos[prevIndex].id)
    }
  }

  const handleNext = () => {
    if (selectedPhoto !== null) {
      const currentIndex = photos.findIndex(p => p.id === selectedPhoto)
      const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1
      setSelectedPhoto(photos[nextIndex].id)
    }
  }

  const selectedPhotoData = selectedPhoto !== null
    ? photos.find(p => p.id === selectedPhoto)
    : null

  const filteredPhotos = activeFilter === 'All'
    ? photos
    : photos.filter(photo => photo.tags.includes(activeFilter))

  return (
    <div className="min-h-screen bg-black text-white">
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

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-md py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-center relative">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logos/ba-logo-trans-white.png"
              alt="Bad Alien"
              width={64}
              height={64}
              className={`transition-all duration-300 ${
                isScrolled ? 'h-12' : 'h-16'
              } w-auto`}
            />
          </Link>

          <Link
            href="/consult"
            className="absolute right-6 text-sm font-light tracking-wider hover:text-gray-400 transition-colors"
          >
            CONTACT
          </Link>
        </div>
      </header>

      {/* Filter Bar */}
      <div
        className={`sticky z-30 bg-transparent transition-all duration-300 ${
          isScrolled
            ? 'top-[72px] py-4'
            : 'top-[112px] py-6'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {['All', '35mm', '120mm', 'B/W', 'Multi'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 font-light tracking-wider text-sm rounded-md backdrop-blur-md transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-black/80 text-white border border-white/30 hover:border-white/60 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="break-inside-avoid cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handlePhotoClick(photo.id)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox */}
      {selectedPhoto !== null && selectedPhotoData && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center lightbox-fade-in"
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            className="absolute top-8 right-8 text-white text-4xl hover:text-gray-400 transition-colors z-10"
            onClick={handleClose}
          >
            ×
          </button>

          {/* Previous arrow */}
          <button
            className="absolute left-8 text-white text-5xl hover:text-gray-400 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
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
              src={selectedPhotoData.src}
              alt={selectedPhotoData.alt}
              width={selectedPhotoData.width}
              height={selectedPhotoData.height}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
            />
          </div>

          {/* Next arrow */}
          <button
            className="absolute right-8 text-white text-5xl hover:text-gray-400 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
