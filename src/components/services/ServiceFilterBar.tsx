'use client';

import { memo } from 'react';
import { ServiceCategory } from './types';

type ServiceFilter = ServiceCategory | 'All';

interface ServiceFilterBarProps {
  filters: readonly ServiceFilter[];
  activeFilter: ServiceFilter;
  onFilterChange: (filter: ServiceFilter) => void;
  isScrolled: boolean;
}

function ServiceFilterBar({ filters, activeFilter, onFilterChange, isScrolled }: ServiceFilterBarProps) {
  return (
    <div
      className={`sticky z-30 transition-all duration-300 ${
        isScrolled ? 'top-[60px] py-3' : 'top-[88px] py-5'
      }`}
    >
      <div
        className={`transition-all duration-300 ${
          isScrolled ? 'bg-base/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex gap-2 justify-center overflow-x-auto flex-nowrap md:flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                aria-pressed={activeFilter === filter}
                className={`px-5 py-2 font-light tracking-wider text-sm rounded-md backdrop-blur-md transition-all duration-300 whitespace-normal md:whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-surface text-text-body border border-border hover:border-text-secondary hover:bg-elevated'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ServiceFilterBar);
