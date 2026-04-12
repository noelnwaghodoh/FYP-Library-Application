"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// We strictly must dynamically import react-quill-new to avoid SSR window/document errors
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function NoteEditorPage({ params }) {
  const [content, setContent] = useState("");

  // Simple string formatter for today's date
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  // User requested to disable the toolbar
  const modules = {
    toolbar: false,
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Black Header mimicking the wireframe */}
      <div className="bg-[#18181b] text-white px-5 py-2.5 flex items-center justify-between">
        <div className="flex gap-4 tracking-wide text-sm font-light">
          <span className="cursor-pointer hover:underline">File</span>
          <span className="cursor-pointer hover:underline">Edit</span>
          <span className="cursor-pointer hover:underline">Insert</span>
          <span className="cursor-pointer hover:underline">View</span>
        </div>
        {/* Back/Return Arrow */}
        <button className="text-white hover:text-gray-300">
          <svg
            width="28"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full p-8 md:p-12 font-sans flex-1">
        {/* Note Header Title Area */}
        <div className="flex items-center gap-5 mb-10">
          <div className="border-[1.5px] border-black rounded-[0.4rem] p-3 flex items-center justify-center flex-shrink-0 shadow-sm">
            {/* Pencil icon matching wireframe roughly */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-[26px] font-semibold text-gray-900 leading-tight">
              Note Title
            </h1>
            <p className="text-[13px] text-gray-600 tracking-wide">
              {dateStr}
            </p>
          </div>
        </div>

        {/* Text Editor Area */}
        <div className="w-full text-gray-900 border-none">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Lorem Ipsum is simply dummy text..."
          />
        </div>

        {/* Override default quill stylings to look like simple raw text without box outlines */}
        <style dangerouslySetInnerHTML={{__html: `
          .ql-container.ql-snow {
            border: none !important;
            font-size: 15px;
            font-family: inherit;
            color: #111827; 
          }
          .ql-editor {
            padding: 0;
            min-height: 400px;
          }
          .ql-editor p {
             line-height: 1.6;
          }
          .ql-editor.ql-blank::before {
             left: 0;
             font-style: normal;
             color: #6b7280;
          }
        `}} />
      </div>
    </div>
  );
}
