'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';

/**
 * Search bar component for filtering products by name or description.
 * Uses Next.js router to update URL search params for shareable links.
 */
export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      } else {
        params.delete('search');
      }

      // Keep category filter if present
      router.push(`/products?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchQuery('');
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      router.push(`/products?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none"
          disabled={isPending}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
}
