"use client";
import { API_URL } from "@/config";
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/pageheader";
// Since we are inside /folder/[folderID], utils are two directories up!
import { FolderCard, FileCard, AddFolderButton, AddFileButton, handleAddNote, handleAddFolder, CreateFolderModal } from "../../note-util"; 
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function FolderPage() {
  const router = useRouter(); 
  const { folderID } = useParams(); // Unwrap dynamic route securely
  
  const [viewMode, setViewMode] = useState("grid");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal tracking state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Wrapper function cleanly opening the modal instead of instantly firing the generator
  const createFolder = () => {
    setIsModalOpen(true);
  };

  // The actual database handler executing specifically inside this exact parameterized folder tree
  const handleModalSubmit = async (folderName) => {
    await handleAddFolder(currentUser, folderName, folderID, setFolders);
    setIsModalOpen(false);
  };

  // Wrapper function cleanly executing note generation BEFORE redirecting natively
  const createAndNavigate = async () => {
    // Crucial Update: Here we pass `folderID` instead of null!
    const newNoteId = await handleAddNote(currentUser, "untitled", folderID, setFiles);
    
    if (newNoteId) {
      router.push(`/student/notes/${newNoteId}`);
    }
  };

  useEffect(() => {
    getCurrentUser();
    
    // Only fire if the URL parameter properly hydrated
    if (folderID) {
       getFolderContents();
       getNestedFiles();
    }
  }, [folderID]);

  function getCurrentUser() {
    axios.get(`${API_URL}/me`, { withCredentials: true })
      .then(res => {
        setCurrentUser(res.data);
      })
      .catch(err => console.log("Not logged in or session expired"));
  }

  // Poll exactly for your File/Note items 
  function getNestedFiles() {
     // NOTE: I am defaulting to the singular pluralization "/notes/folder/" 
     // If your files explicitly route through somewhere else, rename this string!
     axios.get(`${API_URL}/notes/folders/` + folderID + "/files", { withCredentials: true })
      .then(res => {
         const payload = res.data;
         console.log("RAW NESTED FILES FETCHED: ", payload);
         
         if (Array.isArray(payload)) {
            setFiles(payload);
         } else if (payload && payload.notes) {
            setFiles(payload.notes);
         } else if (payload && payload.files) {
            setFiles(payload.files);
         }
      })
      .catch(err => console.error("Failed to fetch nested files:", err));
  }

  // Using the endpoint you confirmed: /notes/folders/:folderID
  function getFolderContents() {
    axios.get(`${API_URL}/notes/folders/` + folderID, { withCredentials: true })
      .then(res => {
        const payload = res.data;
        console.log("RAW NESTED FOLDERS FETCHED: ", payload);

        // Depending on your backend, if it returns an object { folders: [], notes: [] } or just an array of files []
        if (Array.isArray(payload)) {
           // Since your explicit route ends in '/folders', an array payload strictly means these are Folders!
           setFolders(payload);
        } else if (payload.notes || payload.files || payload.folders) {
           setFiles(payload.notes || payload.files || []);
           setFolders(payload.folders || []);
        } else {
           console.log("Unrecognized payload shape for folder contents: ", payload);
        }
      })
      .catch(err => console.error("Failed to fetch folder contents:", err));
  }

  // Combine folders and files into a single unified array so they display in one grid
  const allItems = [
    ...folders.map(f => ({ ...f, type: 'folder' })),
    ...files.map(f => ({ ...f, type: 'file' }))
  ];

  // Derive the sliced items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Special handler resolving the explicit parent block seamlessly 
  const handleGoToParent = () => {
     router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top UI Header logic - Include a slight visual cue we are in a subfolder */}
      <PageHeader title="Folder Explorer" onBackClick={handleGoToParent}>
        <button onClick={() => setViewMode('grid')} title="Grid View" className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </button>
        <button onClick={() => setViewMode('table')} title="List View" className={`p-1.5 rounded transition ${viewMode === 'table' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>
      </PageHeader>

      <main className="px-10 py-12">
        {viewMode === "grid" ? (
          <div className="flex flex-row gap-6 flex-wrap items-start max-w-4xl">
          
          {currentItems.map((item, index) => {
            if (item.type === 'folder') {
              const subFolderId = item.id || item.folderID || item.folder_id || item.FolderID;
              return (
                <FolderCard 
                  key={index} 
                  onClick={() => router.push(`/student/notes/folder/${subFolderId}`)}
                  label={item.name || item.title || `Folder ${index+1}`} 
                  hasDocs={item.hasDocs || false} 
                />
              );
            }
            
            // Shotgun extracting the DB identifier based on whatever common column name your SQL uses
            const noteId = item.id || item.ID || item.noteID || item.NoteID || item.note_id || item.NotesID;
            
            return (
              <FileCard 
                key={index} 
                onClick={() => router.push(`/student/notes/${noteId}`)} 
                label={item.title || item.name || item.NoteTitle || item.NotesContent || `File ${index+1}`} 
              />
            );
          })}
          
          </div>
        ) : (
          <div className="w-full max-w-4xl">
             <div className="w-full flex justify-end gap-3 mb-4">
               <button onClick={createFolder} className="bg-[#2ba5c7] text-white px-4 py-2 rounded font-medium shadow-sm hover:opacity-90 transition">New Folder</button>
               <button onClick={createAndNavigate} className="bg-[#5CB85C] text-white px-4 py-2 rounded font-medium shadow-sm hover:opacity-90 transition">New File</button>
             </div>
             <div className="bg-white rounded shadow-md overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse select-none">
                  <thead>
                     <tr className="bg-gray-100 text-gray-700 text-sm border-b-2 border-gray-300">
                       <th className="py-4 px-6 font-bold w-16 text-center">Type</th>
                       <th className="py-4 px-6 font-bold">Name</th>
                     </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 && (
                       <tr><td colSpan="2" className="text-center py-8 text-gray-500 italic">This directory is empty.</td></tr>
                    )}
                    {currentItems.map((item, index) => {
                        const isFolder = item.type === "folder";
                        const id = isFolder ? (item.id || item.folderID || item.folder_id || item.FolderID) : (item.id || item.ID || item.noteID || item.NoteID || item.note_id || item.NotesID);
                        const name = isFolder ? (item.name || item.title || `Folder ${index+1}`) : (item.title || item.name || item.NoteTitle || item.NotesContent || `File ${index+1}`);
                        const targetUrl = isFolder ? `/student/notes/folder/${id}` : `/student/notes/${id}`;
                        
                        return (
                          <tr key={index} onDoubleClick={() => router.push(targetUrl)} title="Double-click to open" className="border-b hover:bg-blue-50 transition cursor-pointer">
                            <td className="py-4 px-6 flex justify-center">
                               <Image src={isFolder ? "/images/folder.png" : "/images/file (1).png"} alt="icon" width={24} height={24} className="object-contain" />
                            </td>
                            <td className="py-4 px-6 text-gray-800 font-medium">{name}</td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
             </div>
             <div className="text-xs text-gray-400 mt-2 italic text-right w-full">Double-click any row to open the file or folder.</div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-start w-full mt-10 gap-3 max-w-4xl">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-[#2ba5c7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600 text-sm font-medium flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-[#2ba5c7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Renders safely on top of everything when isModalOpen becomes true */}
      <CreateFolderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit} 
      />
    </div>
  );
}
