import Image from "next/image";

export function BookCard({ handleClick, ...book }) {
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
  
  // Safely grab the filename by checking if it exists first
  let imgSrc = "https://fyp-assets.lon1.cdn.digitaloceanspaces.com/thumbnails/book-cover-placeholder.jpg";
  
  if (book.BookFileName) {
      const isEpub = book.BookFileName.toLowerCase().endsWith('.epub');
      const parts = book.BookFileName.split(".");
      const bookThumbnailName = isEpub ? "book-cover-placeholder" : "thumb+" + parts[0];
      imgSrc = `https://fyp-assets.lon1.cdn.digitaloceanspaces.com/thumbnails/${bookThumbnailName}.jpg`;
  } else if (book.BookIdentifier) {
      // If it exists in the DB heavily without a file, check OpenLibrary CDN (Small 32px resolution)
      imgSrc = `https://covers.openlibrary.org/b/isbn/${book.BookIdentifier}-S.jpg`;
  }

  return (
    <div className="flex items-center gap-3 p-2 w-max transition-colors rounded-md hover:bg-gray-50 cursor-pointer" onClick={handleClick}>
          <div className="flex-shrink-0">
        
       <Image
       src={imgSrc}
       width={32}
       height={40}
       alt={book.BookTitle || "Book Cover"}
       unoptimized={true}
       />
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