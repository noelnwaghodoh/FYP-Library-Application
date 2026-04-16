"use client";import { API_URL } from "@/config";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReaderPage({ params }) {
  const usedParams = React.use(params);
  const router = useRouter();
  const [book, setBook] = useState(null);

  console.log("usedParams are : ", usedParams);
  useEffect(() => {
    // Attempt to fetch the book to get its details, fallback to dummy data
    
    const fetchBook = async () => {

      try {

        const params = new URLSearchParams();
        console.log("term is " + usedParams.bookID);
        params.append("bookID", usedParams.bookID);
        const res = await fetch(`${API_URL}/catalogue/id?${params}`);
        const data = await res.json();

        console.log("THE DATA FROM THE CATALOGUE BY ID ROUTE IS : "+JSON.stringify(data));
        // Assuming params.bookID maps to book.id or something similar
        const found = data.BookID == usedParams.bookID || String(data.BookID) === String(usedParams.bookID) ? data : null;
        if (found) {
          if (found.BookFileName && found.BookFileName !== "sample.pdf") {
            try {
              const urlParams = new URLSearchParams();
              urlParams.append("fileName", found.BookFileName);
              const urlRes = await fetch(`${API_URL}/catalogue/signed-url?${urlParams}`);
              if (urlRes.ok) {
                const urlData = await urlRes.json();
                found.secureUrl = urlData.url;
              }
            } catch (urlErr) {
              console.error("Failed to fetch signed URL", urlErr);
            }
          }
          setBook(found);
        } else {
          throw new Error("Not found");
        }
      } catch (err) {
        setBook({
          BookTitle: "Book Title 1",
          BookAuthor: "Author",
          BookYear: "YYYY",
          BookFileName: "sample.pdf"
        });
      }
    };
    fetchBook();
  }, [usedParams.bookID]);

  if (!book) return <div className="p-8 text-center">Loading reader...</div>;


  const pdfUrl = book.secureUrl || "/path/to/your/pdf.pdf"; // Fallback if no secure url could be fetched

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] font-sans">
      {/* Top Header */}
      <div className="flex flex-row items-center justify-between px-6 py-4 bg-[#2da1c2] text-white shadow-sm">
        <div className="flex flex-row items-center gap-4">
          <button onClick={() => router.push('/student/catalogue/discovery')} className="text-white hover:text-gray-200 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 className="text-[20px] font-medium tracking-wide">{book.BookTitle}</h1>
        </div>
        <div className="text-[15px] font-light">
          {book.BookAuthor}, {book.BookYear}
        </div>
      </div>

      <div className="flex px-8 py-6 justify-center w-full h-[85vh]">
        {/* Explicit Native Embed Injection Wrapper - Instantly outsources all decoding mathematically to C++ */}
        <object 
           data={pdfUrl} 
           type="application/pdf" 
           className="w-full h-full rounded-md shadow-md border-[1.5px] border-[#d1d5db]"
        >
           <p className="text-gray-600 font-medium text-center mt-10">We noticed your browser is missing a native PDF Viewer Plugin. Please try another browser or download the file manually.</p>
        </object>
      </div>
    </div>
  );
}