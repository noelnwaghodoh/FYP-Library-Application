'use client';

import { useState } from 'react';
import { BookCard } from './book-card';

export default function SearchResults({ books = [], meta = {}, itemsPerPage = 5, onBookSelect }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure books is an array
  const booksList = Array.isArray(books) ? books : [];

  // Calculate pagination values
  const totalPages = Math.ceil(booksList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = booksList.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  if (booksList.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 text-sm">
        No books found. Please try a different search.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Alert Banner dynamically rendered if the backend agent triggers a fallback tier */}
      {(meta.isFallback || meta.isRelated) && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-2 rounded-r-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-400 mr-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-700 font-medium">
              We couldn&#39;t find an exact match for your search. Here are some {meta.isFallback ? "recommended books you might like" : "closely related books on this topic"}:
            </p>
          </div>
        </div>
      )}

      {/* List of books */}
      <div className="flex flex-col space-y-1">
        {currentBooks.map((book, index) => (
          // We spread the book object so BookCard receives the properties correctly
          <BookCard 
            key={book.identifier || book.id || index} 
            {...book} 
            handleClick={() => onBookSelect && onBookSelect(book)} 
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
              ${currentPage === 1 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-gray-700 bg-white border hover:bg-gray-50'}`}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
              ${currentPage === totalPages 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-gray-700 bg-white border hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}