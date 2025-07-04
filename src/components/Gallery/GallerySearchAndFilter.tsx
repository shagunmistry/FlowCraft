import { useState } from 'react';

interface GallerySearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = ['Newest', 'Trending', 'Flow', 'Chart', 'Whiteboard', 'Mind Map', 'Generated Images'];

export default function GallerySearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}: GallerySearchAndFilterProps) {
  return (
    <div className="mb-12">
      <div className="relative max-w-xl mx-auto mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search diagrams..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
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