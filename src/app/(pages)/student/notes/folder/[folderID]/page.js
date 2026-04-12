"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/pageheader";
// Since we are inside /folder/[folderID], utils are two directories up!
import { FolderCard, FileCard, AddFolderButton, AddFileButton, handleAddNote, handleAddFolder, CreateFolderModal } from "../../note-util"; 
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function FolderPage() {
  const router = useRouter(); 
  const { folderID } = useParams(); // Unwrap dynamic route securely
  
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal tracking state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    axios.get("http://localhost:8080/me", { withCredentials: true })
      .then(res => {
        setCurrentUser(res.data);
      })
      .catch(err => console.log("Not logged in or session expired"));
  }

  // Poll exactly for your File/Note items 
  function getNestedFiles() {
     // NOTE: I am defaulting to the singular pluralization "/notes/folder/" 
     // If your files explicitly route through somewhere else, rename this string!
     axios.get("http://localhost:8080/notes/folders/" + folderID + "/files", { withCredentials: true })
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
    axios.get("http://localhost:8080/notes/folders/" + folderID, { withCredentials: true })
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

  return (
    <div className="min-h-screen bg-white">
      {/* Top UI Header logic - Include a slight visual cue we are in a subfolder */}
      <PageHeader title="Folder Explorer" />

      <main className="px-10 py-12">
        <div className="flex flex-row gap-6 flex-wrap items-start max-w-4xl">
          
          {/* Back button strictly navigating to root */}
          <div 
             onClick={() => router.push('/student/notes')}
             className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform w-[90px]"
          >
             <div className="w-[72px] h-[72px] bg-gray-100 rounded-md flex items-center justify-center border-[1.5px] border-gray-300">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M19 12H5M12 19l-7-7 7-7"/>
               </svg>
             </div>
             <span className="text-[14px] font-medium text-gray-600 text-center">Go Back</span>
          </div>

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
          
          {/* Subfolder functionality inherits the folder routing context! */}
          <AddFolderButton onClick={createFolder} />
          <AddFileButton onClick={createAndNavigate} />
        </div>

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
