"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function BookDisplay({ book }) {
  const router = useRouter();
  // Gracefully handle filename for the DigitalOcean URL
  const isEpub = book?.BookFileName?.toLowerCase().endsWith('.epub');
  const parts = book?.BookFileName ? book.BookFileName.split(".") : ["default_thumbnail"];
  const bookThumbnailName = isEpub ? "book-cover-placeholder" : "thumb+" + parts[0];

  // Default fallbacks referencing your wireframe format
  const year = book?.BookDate.slice(0,10)|| "YYYY";
  const title = book?.BookTitle || "Book Title 1";
  const author = book?.BookAuthor || "Author";
  const description = book?.ItemDescription || "This is placeholder text for the synopsis of the book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
  const location = book?.Location || "This is a placeholder location";

    function handleReadClick() {
      const fileName = book?.BookFileName || "";
      const bookID = book?.id || book?.BookID || "unknown";
  
      if (fileName.toLowerCase().endsWith(".epub")) {
        router.push(`/student/catalogue/read/epub/${bookID}`);
      } else {
        router.push(`/student/catalogue/read/pdf/${bookID}`);
      }
    }
  return (
    <div className="flex flex-row gap-4 p-4 mt-2 w-full max-w-4xl bg-white text-black font-sans">
      
      {/* Left Sidebar Action Icons */}
      <div className="flex flex-col gap-3 flex-shrink-0 mt-1">
        {[
          // List icon
          <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
          // Search icon
          <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
          // Edit/Pen icon
          <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
          // Open Book icon
          <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
          // Quotes icon
          <svg key="5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25-.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
        ].map((icon, idx) => (
          <button key={idx} className="p-2 border-2 border-black rounded-[0.4rem] hover:bg-gray-100 flex items-center justify-center w-11 h-11 text-black cursor-pointer transition-colors shadow-sm">
            {icon}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-full pl-2">
        
        {/* Top Section: Thumbnail + Metadata */}
        <div className="flex flex-row gap-5 items-stretch">
          
          {/* Thumbnail Box */}
          <div className="flex justify-center items-center w-[120px] h-[120px] border-[1.5px]  rounded-md bg-white flex-shrink-0 p-2">
             <Image
                src={`https://fyp-assets.lon1.cdn.digitaloceanspaces.com/thumbnails/${bookThumbnailName}.jpg`}
                width={120}
                height={120}
                alt={title}
                unoptimized={true}
                className="object-contain max-h-full max-w-full"
             />
          </div>

          {/* Title and Details block */}
          <div className="flex flex-col justify-center py-1">
            <h1 className="text-[22px] font-medium text-gray-900 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-[14px] text-gray-800 mt-1.5">
              {author}, {year}
            </p>
            <p className="text-[14px] text-gray-800 mt-[2px]">
              <span className="text-[#a1e582] font-medium mr-1 tracking-wide">Available at</span> 
              {location}
            </p>
            <button onClick={handleReadClick} className="mt-3.5 bg-[#2da1c2] hover:bg-[#258aa8] text-white py-[6px] px-4 rounded-md text-[14px] font-medium shadow-sm w-max transition-colors">
              Read Online
            </button>
          </div>

        </div>

        {/* Synopsis Paragraph */}
        <div className="mt-6 w-full max-w-[500px]">
          <p className="text-[15px] text-gray-900 leading-[1.6]">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}