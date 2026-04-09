"use client";

import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Setup pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ pdfUrl, onDocumentLoadSuccess, pageNumber }) {
  return (
    <Document 
        file={pdfUrl} 
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="text-gray-500 mt-10">Loading PDF document...</div>}
        error={<div className="text-gray-500 mt-10">
           <p className="mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
           <p className="text-xs text-center text-gray-400 border-t pt-4">Fallback text shown because real PDF failed to load</p>
        </div>}
    >
        <Page 
           pageNumber={pageNumber} 
           renderTextLayer={false} 
           renderAnnotationLayer={false} 
        />
    </Document>
  );
}
