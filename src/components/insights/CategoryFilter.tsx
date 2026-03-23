'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import type { Category } from '@/lib/blog';

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/insights?${params.toString()}`);
  };

  const allCategories = ['All', ...categories];

  return (
    <div className="flex flex-wrap gap-2 mb-12">
      {allCategories.map((category) => {
        const isActive =
          (category === 'All' && !activeCategory) ||
          category === activeCategory;

        return (
          <button
            key={category}
            onClick={() =>
              handleCategoryClick(category === 'All' ? null : category)
            }
            className={`
              px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider
              border transition-colors duration-200
              ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-border text-text-secondary hover:border-muted'
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
