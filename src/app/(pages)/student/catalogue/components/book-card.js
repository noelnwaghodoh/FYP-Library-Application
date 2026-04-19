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

  const title = book.BookTitle || book.title || "Untitled Book";
  const author = book.BookAuthor || book.author || "Unknown Author";
  
  // Safely grab the filename by checking if it exists first
  let imgSrc = "https://fyp-assets.lon1.cdn.digitaloceanspaces.com/thumbnails/book-cover-placeholder.jpg";
  
  if (book.BookFileName) {
      const isEpub = book.BookFileName.toLowerCase().endsWith('.epub');
      const parts = book.BookFileName.split(".");
      const bookThumbnailName = isEpub ? "book-cover-placeholder" : "thumb+" + parts[0];
      imgSrc = `https://fyp-assets.lon1.cdn.digitaloceanspaces.com/thumbnails/${bookThumbnailName}.jpg`;
  } else if (book.BookIdentifier) {
      // Use the Medium (-M) OpenLibrary CDN for much better visual clarity natively on the grid!
      imgSrc = `https://covers.openlibrary.org/b/isbn/${book.BookIdentifier}-M.jpg`;
  }

  return (
    <div 
      className="flex flex-col items-center p-5 w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer group" 
      onClick={handleClick}
    >
      <div className="relative w-[110px] h-[160px] flex-shrink-0 mb-4 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100/50 shadow-inner">
        <Image
          src={imgSrc}
          fill
          sizes="110px"
          className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          alt={title}
          unoptimized={true}
        />
      </div>
      <div className="flex flex-col text-center items-center w-full px-1">
        <h2 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2">
          {title}
        </h2>
        <p className="text-[13px] font-medium text-[#2ba5c7] tracking-wide mt-1.5 line-clamp-1">
          {author}
        </p>
        <p className="text-[12px] font-medium text-gray-400 mt-1">
          {book.BookYear || year}
        </p>
      </div>
    </div>
  );
}