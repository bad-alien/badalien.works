'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import Logo from '@/components/shared/Logo'
import PhotoCard from '@/components/creative/PhotoCard'
import Lightbox from '@/components/creative/Lightbox'
import { portfolioItems, portfolioFilters, type PortfolioCategory } from '@/data/portfolio'
import { useScrollState } from '@/hooks/useScrollState'
import { usePhotoNavigation } from '@/hooks/usePhotoNavigation'

export default function CreativePage() {
  const isScrolled = useScrollState(50)
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory | 'All'>('All')
  const { selectedPhoto, selectPhoto, clearSelection, goToPrevious, goToNext } = usePhotoNavigation(portfolioItems)

  const filteredPhotos = useMemo(
    () => (activeFilter === 'All' ? portfolioItems : portfolioItems.filter(item => item.category === activeFilter)),
    [activeFilter]
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div
          className={`transition-all duration-300 ${
            isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
          }`}
        >
          <div className={`mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-center relative transition-all duration-300 ${
            isScrolled ? 'h-20' : 'h-24 md:h-28'
          }`}>
            <Link
              href="/"
              className="absolute left-6 lg:left-8 flex items-center gap-2 text-sm font-light tracking-wider text-white/70 hover:text-white transition-colors"
            >
              <span aria-hidden="true">&larr;</span> Back to Home
            </Link>

            <Logo size="md" className={`transition-all duration-300 ${isScrolled ? '!h-[40px]' : '!h-[77px]'}`} />

            <Link
              href="/contact"
              className="absolute right-6 text-sm font-light tracking-wider hover:text-gray-400 transition-colors"
            >
              CONTACT
            </Link>
          </div>
        </div>

        {/* Filter buttons — below header nav, each individually glassy */}
        <div className={`flex justify-center gap-3 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
          {portfolioFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 font-light tracking-wider text-sm rounded-md transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-[#FF6B35] text-white backdrop-blur-md'
                  : 'bg-black/80 backdrop-blur-md text-white border border-white/20 hover:border-white/50 hover:bg-black/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Photo Grid */}
      <main id="main-content" aria-label="Creative portfolio" className="container mx-auto px-6 pt-44 pb-16">
        <Masonry
          breakpointCols={{
            default: 3,
            1280: 3,
            1024: 2,
            640: 2,
            0: 1
          }}
          className="flex -ml-6 w-auto"
          columnClassName="pl-6 bg-clip-padding"
        >
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={selectPhoto}
            />
          ))}
        </Masonry>
      </main>

      {/* Lightbox */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={clearSelection}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </div>
  )
}
