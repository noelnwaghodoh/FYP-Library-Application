"use client";
import Header from "@/components/ui/header";
import PageHeader from "@/components/ui/pageheader";
import { FolderCard, FileCard, AddFolderButton, AddFileButton, handleAddNote, handleAddFolder, CreateFolderModal } from "./note-util";
import { useState, useEffect } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter(); // Next.js App Router navigator
  
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal tracking state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Wrapper function firing open the Modal overlay instead of directly mutating database
  const createNewFolder = () => {
    setIsModalOpen(true);
  };
  
  // Actually commits the data to the MySQL Database once the user clicks "Create"
  const handleModalSubmit = async (folderName) => {
    await handleAddFolder(currentUser, folderName, null, setFolders);
    setIsModalOpen(false);
  };

  // Wrapper function cleanly executing note generation BEFORE redirecting natively
  const createAndNavigate = async () => {
    // We explicitly supply "untitled" as the default base name here!
    const newNoteId = await handleAddNote(currentUser, "untitled", null, setFiles);
    
    if (newNoteId) {
      // Transition strictly to the rich text editor page holding that exact ID
      router.push(`/student/notes/${newNoteId}`);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getRootFolders();
    getRootFiles();
  }, []);

  function getCurrentUser() {
    axios.get("http://localhost:8080/me", { withCredentials: true })
      .then(res => {
        setCurrentUser(res.data); // Now you have the user object!
      })
      .catch(err => console.log("Not logged in or session expired"));
  }
  
  function getRootFolders() {
   
    axios.get("http://localhost:8080/notes/folders", { withCredentials: true })
      .then(res => {
        // Defensively process the array whether it's raw or wrapped in an object
        const payload = res.data;
        console.log("RAW FOLDERS FETCHED FROM BACKEND: ", res.data);
        if (Array.isArray(payload)) {
           setFolders(payload);
        } else if (payload && payload.folders) {
           setFolders(payload.folders);
        } else {
           console.log("Unrecognized folder payload shape:", payload);
        }
      })
      .catch(err => console.log("Not logged in or session expired"));
  }
  function getRootFiles() {
    console.log("THIS FUNCTION IS BEING CALLED IN THE FIRST PLACE")
    axios.get("http://localhost:8080/notes", { withCredentials: true })
      .then(res => {
        console.log("RAW FILES FETCHED FROM BACKEND: ", res.data);
        setFiles(res.data);
      })
      .catch(err => console.error("Failed to fetch files:", err));
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
      {/* Page Header pulling styles from existing central repository */}
      <PageHeader title="Notes" />

      {/* Main Container handling the Horizontal layout of the Note Explorer Component Grid */}
      <main className="px-10 py-12">
        <div className="flex flex-row gap-6 flex-wrap items-start max-w-4xl">
          
          {/* Dynamically mapped Items based on pagination */}
          {currentItems.map((item, index) => {
            if (item.type === 'folder') {
              // Extract the secure folder database ID safely
              const folderId = item.id || item.folderID || item.folder_id || item.FolderID;
              return (
                <FolderCard 
                  key={index} 
                  onClick={() => router.push(`/student/notes/folder/${folderId}`)}
                  label={item.FolderName || item.title || `Untitled Folder`} 
                  hasDocs={item.hasDocs || false} 
                />
              );
            }
            
            // Extract the secure database ID safely and assign onClick redirection
            const noteId = item.id || item.noteID || item.note_id || item.NoteID;
            return (
              <FileCard 
                key={index} 
                onClick={() => router.push(`/student/notes/${noteId}`)} 
                label={item.NoteTitle || item.name || `Untitled Note`} 
              />
            );
          })}
          
          {/* Utility Creators (Usually you keep these outside pagination so they are always accessible) */}
          <AddFolderButton onClick={createNewFolder} />
          <AddFileButton onClick={createAndNavigate} />
        </div>

        {/* Pagination Toolbar */}
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
