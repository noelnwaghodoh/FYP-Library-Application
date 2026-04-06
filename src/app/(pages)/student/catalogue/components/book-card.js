export function BookCard(book) {
  // Extract year from releaseDate or default to "YYYY"
  let year = "YYYY";
  if (book.releaseDate) {
    const match = String(book.releaseDate).match(/\b(19|20)\d{2}\b/);
    if (match) {
      year = match[0];
    } else {
      year = book.releaseDate;
    }
  }

  const title = book.title || "Book Title";
  const author = book.author || "Author";

  return (
    <div className="flex items-center gap-3 p-2 w-max transition-colors rounded-md hover:bg-gray-50">
      <div className="flex-shrink-0">
        <svg 
          width="32" 
          height="40" 
          viewBox="0 0 24 25" 
          fill="none" 
          stroke="#1f2937" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2.5" ry="2.5"></rect>
          <path d="M4 17h16"></path>
        </svg>
      </div>
      <div className="flex flex-col text-left">
        <h2 className="text-[14px] text-gray-900 leading-snug">
          {book.BookTitle}
        </h2>
        <p className="text-[12px] text-gray-800 tracking-wide mt-0.5">
          {book.BookAuthor}, {book.BookYear}
        </p>
      </div>
    </div>
  );
}