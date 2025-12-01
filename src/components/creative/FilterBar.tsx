import { memo } from 'react';
import { PhotoTag } from '@/data/photos';

interface FilterBarProps {
  filters: (PhotoTag | 'All')[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  isScrolled: boolean;
}

function FilterBar({ filters, activeFilter, onFilterChange, isScrolled }: FilterBarProps) {
  return (
    <div
      className={`sticky z-30 bg-transparent transition-all duration-300 ${
        isScrolled
          ? 'top-[72px] py-4'
          : 'top-[112px] py-6'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
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
  );
}

export default memo(FilterBar);
