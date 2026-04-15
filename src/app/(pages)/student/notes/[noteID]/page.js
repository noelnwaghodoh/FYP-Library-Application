"use client";
import { API_URL } from "@/config";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

// We strictly must dynamically import react-quill-new to avoid SSR window/document errors
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function NoteEditorPage() {
  const { noteID } = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Note Title");
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);

  // Automatically fetch existing data from database on mount!
  useEffect(() => {
    if (noteID) {
      axios.get(`${API_URL}/notes/` + noteID, { withCredentials: true })
        .then(res => {
          // Assuming your backend returns the Note object directly or wrapped in data.note
          const fetchedNote =  res.data[0]; 
          
          console.log("FETCHED NOTE IS ", fetchedNote);
          
          if (fetchedNote.NoteTitle) {
            let cleanTitle = fetchedNote.NoteTitle;
            if (typeof cleanTitle === 'string' && cleanTitle.startsWith('"') && cleanTitle.endsWith('"')) {
              try { cleanTitle = JSON.parse(cleanTitle); } catch(e) {}
            }
            setTitle(cleanTitle);
          }
          
          if (fetchedNote.NotesContent) {
            let cleanHTML = fetchedNote.NotesContent;
            // If the backend accidentally ran JSON.stringify() on the string before saving, 
            // the database contains literal '"<p>Hello</p>"'. JSON.parse safely undoes exactly one layer of this.
            if (typeof cleanHTML === 'string' && cleanHTML.startsWith('"') && cleanHTML.endsWith('"')) {
               try { cleanHTML = JSON.parse(cleanHTML); } catch(e) {}
            }
            setContent(cleanHTML);
          }
        })
        .catch(err => {
          console.error("Failed to fetch initial note data:", err);
        });
    }
  }, [noteID]);

  // Handler ready for database save logic
  const handleSave = async () => {
    console.log("Preparing to save note...", { title, content });
    // TODO: Add backend API call here

    axios.put(`${API_URL}/notes/` + noteID, { title, content }, { withCredentials: true })
      .then(res => {
        console.log("Note saved successfully", res.data);
      })
      .catch(err => {
        console.log("Error saving note", err);
      });
  };

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
        <div className="flex gap-4 tracking-wide text-sm font-light relative">
          {/* File Dropdown Container */}
          <div className="relative">
            <span 
              className="cursor-pointer hover:underline"
              onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
            >
              File
            </span>
            
            {/* Dropdown Menu */}
            {isFileMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-white text-gray-800 shadow-xl rounded-md py-1 z-50 border border-gray-200">
                <button 
                  onClick={() => {
                    handleSave();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Save Note
                </button>
              </div>
            )}
          </div>

          <span className="cursor-pointer hover:underline">Edit</span>
          <span className="cursor-pointer hover:underline">Insert</span>
          <span className="cursor-pointer hover:underline">View</span>
        </div>
        {/* Back/Return Arrow */}
        <button onClick={() => router.push('/student/notes')} className="text-white hover:text-gray-300 transition-colors">
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
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="text-[26px] font-semibold text-gray-900 leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 w-full placeholder-gray-400"
            />
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
