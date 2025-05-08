interface EmptyStateProps {
    searchQuery: string;
  }
  
  export default function EmptyState({ searchQuery }: EmptyStateProps) {
    return (
      <div className="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No diagrams found</h3>
        <p className="mt-1 text-gray-500 max-w-md mx-auto">
          {searchQuery
            ? `No results for "${searchQuery}". Try a different search term.`
            : 'There are currently no public diagrams available.'}
        </p>
      </div>
    );
  }