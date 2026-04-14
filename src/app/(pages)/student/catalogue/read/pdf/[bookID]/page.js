"use client";import { API_URL } from "@/config";


import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const PDFViewer = dynamic(() => import("./pdf-viewer"), { ssr: false });

export default function ReaderPage({ params }) {

  const usedParams = React.use(params);
  const router = useRouter();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
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

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const goPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1));

  const leftIcons = [
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
  ];

  if (!book) return <div className="p-8 text-center">Loading reader...</div>;


  const pdfUrl = book.secureUrl || "/path/to/your/pdf.pdf"; // Fallback if no secure url could be fetched

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] font-sans">
      {/* Top Header */}
      <div className="flex flex-row items-center justify-between px-6 py-4 bg-[#2da1c2] text-white shadow-sm">
        <div className="flex flex-row items-center gap-4">
          <button onClick={() => router.back()} className="text-white hover:text-gray-200 transition-colors">
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

      <div className="flex flex-row flex-1 p-6 md:p-10 gap-6 justify-center w-full max-w-[1200px] mx-auto">
        
        {/* Left Sidebar Layout */}
        <div className="flex flex-col gap-3 pt-2">
          {leftIcons.map((icon, idx) => (
            <button key={idx} className="p-2 border-[1.5px] border-black rounded-[0.4rem] hover:bg-gray-100 flex items-center justify-center w-11 h-11 text-black cursor-pointer bg-white transition-colors shadow-sm">
              {icon}
            </button>
          ))}
        </div>

        {/* Center Content Map */}
        <div className="flex-1 bg-white border-[1.5px] border-black p-8 min-h-[600px] shadow-sm flex flex-col justify-start items-center overflow-auto max-w-4xl relative">
             <PDFViewer 
                 pdfUrl={pdfUrl}
                 onDocumentLoadSuccess={onDocumentLoadSuccess}
                 pageNumber={pageNumber}
             />
        </div>

        {/* Right Sidebar Pagination */}
        <div className="flex flex-col gap-3 pt-8">
            <button onClick={goPrevPage} disabled={pageNumber <= 1} className="p-2 border-[1.5px] border-black rounded-[0.4rem] hover:bg-gray-100 flex items-center justify-center w-11 h-11 text-black cursor-pointer bg-white disabled:opacity-30 transition-colors shadow-sm">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
               </svg>
            </button>
            <button onClick={goNextPage} disabled={numPages && pageNumber >= numPages} className="p-2 border-[1.5px] border-black rounded-[0.4rem] hover:bg-gray-100 flex items-center justify-center w-11 h-11 text-black cursor-pointer bg-white disabled:opacity-30 transition-colors shadow-sm">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
               </svg>
            </button>
            <div className="text-center text-sm font-medium mt-1 text-gray-700">
               {pageNumber} / {numPages || '-'}
            </div>
        </div>

      </div>
    </div>
  );
}